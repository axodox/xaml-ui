import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayConfig, OverlayRef, OverlaySizeConfig } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "./FlyoutPresenter";
import { resume_after, FlyoutPlacementMode, FlyoutShowMode } from "../Common";
import { XamlRootComponent } from "../XamlRoot";

/** The state of one opening of a flyout. Each opening has its own, so a presenter that fades out never shows again. */
export class FlyoutPopupState {
  IsVisible = false;
}

export const PopupTemplate = `<ng-template #template let-popup><XamlRoot><FlyoutPresenter #presenter [IsVisible]="popup.IsVisible" [TransitionAnimation]="transitionAnimation" [Padding]="Padding"><ng-content/></FlyoutPresenter></XamlRoot></ng-template>`;

@Component({
  imports: [FlyoutPresenter, XamlRootComponent],
  selector: 'FlyoutBase',
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: FlyoutBaseComponent }]
})
export abstract class FlyoutBaseComponent implements OnDestroy {

  /**
   * Where the flyout opens, relative to its target (WinUI's `FlyoutPlacementMode`). Where it does not fit, it opens on
   * the opposite side, then on the sides across; it is never narrowed to fit, but moved into the window.
   */
  @Input() Placement: FlyoutPlacementMode = 'Top';

  @Input() Padding?: string;
  @Input() HasBackdrop = true;

  /**
   * `Standard`: the flyout takes the keyboard focus when it opens and gives it back when it closes, and **Esc** closes
   * it. `Transient`: it leaves the focus and the keys to its owner (a list or spin buttons beside a focused field).
   */
  @Input() ShowMode: FlyoutShowMode = 'Standard';

  private _backdropContextMenuSubscription?: () => void;
  private _keydownSubscription?: Subscription;

  private _isOpen = false;
  get IsOpen() {
    return this._isOpen;
  }
  @Input() set IsOpen(value: boolean) {
    if (value === this._isOpen) return;
    this._isOpen = value;

    if (value) {
      this.showOverlay();
    }
    else {
      this.hideOverlay();
    }
    this.IsOpenChange.emit(value);
  }
  @Output() IsOpenChange = new EventEmitter<boolean>();

  private _overlayRef?: OverlayRef;
  private _popup?: FlyoutPopupState;
  private _focusOrigin?: HTMLElement | null;

  /** Whether the flyout is open and has faded in. */
  protected get isVisible() {
    return this._popup?.IsVisible ?? false;
  }

  private static readonly _viewportMargin = 4;

  private updatePlacement() {
    if (!this._overlayRef) return;

    let target = this.Target ?? this._hostElement;
    let positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(target)
      .withPositions(FlyoutBaseComponent.getPositionCandidates(this.Placement))
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(false)
      .withViewportMargin(FlyoutBaseComponent._viewportMargin)
      .withPush(true);

    this._overlayRef.updatePositionStrategy(positionStrategy);
    if (this.Placement === 'Cover') {
      this._overlayRef.updateSize(target as OverlaySizeConfig);
    }
  }

  private async showOverlay() {
    //A flyout reopened while it fades out gets a new presenter; the fading one keeps its own state
    let popup = new FlyoutPopupState();
    this._popup = popup;
    this._focusOrigin = document.activeElement as HTMLElement | null;

    //Create overlay
    let config = new OverlayConfig({
      hasBackdrop: this.HasBackdrop,
      panelClass: 'xaml-overlay-pane',
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      backdropClass: 'xaml-flyout-overlay-backdrop'
    });
    let overlayRef = this._overlay.create(config);
    this._overlayRef = overlayRef;
    this.OnOverlay(overlayRef);

    //Configure overlay placement
    this.updatePlacement();

    //Display overlay
    let templatePortal = new TemplatePortal(
      this._template,
      this._viewContainerRef,
      { $implicit: popup }
    );

    overlayRef.attach(templatePortal);

    //Ensure backdrop event handling
    overlayRef.backdropClick().subscribe(() => this.Hide());
    if (this.HasBackdrop) this._backdropContextMenuSubscription = this._renderer.listen(overlayRef.backdropElement, 'contextmenu', p => { p.preventDefault(); this.Hide(); });

    //Esc closes the topmost standard flyout: the CDK hands each key press to the last opened overlay that listens for
    //them. A transient flyout leaves the keys to its owner (the field it shows beside).
    if (this.ShowMode === 'Standard') {
      this._keydownSubscription = overlayRef.keydownEvents().subscribe(event => this.onOverlayKeyDown(event));
    }

    //Make content visible - after next layout
    await resume_after(0);
    if (this._popup !== popup) return;

    popup.IsVisible = true;
    this._changeDetector.markForCheck();
    this.OnOpened(overlayRef, this._focusOrigin);
  }

  private onOverlayKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    event.preventDefault();
    this.Hide();
  }

  private async hideOverlay() {
    //Start hide animation
    if (this._popup) this._popup.IsVisible = false;
    this._popup = undefined;
    this._changeDetector.markForCheck();

    //Remove event handlers
    if (this._backdropContextMenuSubscription) {
      this._backdropContextMenuSubscription();
      this._backdropContextMenuSubscription = undefined;
    }
    this._keydownSubscription?.unsubscribe();
    this._keydownSubscription = undefined;

    //Dispose overlay after hidden
    const overlayRef = this._overlayRef;
    if (!overlayRef) return;

    this._overlayRef = undefined;

    //While it fades out the pointer goes through it, so the next click reaches the page and is not lost on it
    overlayRef.hostElement.style.pointerEvents = 'none';
    overlayRef.overlayElement.style.pointerEvents = 'none';
    if (overlayRef.backdropElement) overlayRef.backdropElement.style.pointerEvents = 'none';

    this.restoreFocus(overlayRef);
    this.OnClosing(overlayRef);

    await resume_after(FlyoutPresenter.TransitionDuration);

    overlayRef.detach();
    overlayRef.dispose();
  }

  //A standard flyout gives the focus back to where it was when it opened, if the focus is in the flyout or lost
  private restoreFocus(overlayRef: OverlayRef) {
    let origin = this._focusOrigin;
    this._focusOrigin = undefined;
    if (this.ShowMode !== 'Standard' || !origin || origin === document.body || !origin.isConnected) return;

    let focused = document.activeElement;
    if (focused && focused !== document.body && !overlayRef.overlayElement.contains(focused)) return;

    origin.focus({ preventScroll: true });
  }

  private _target: FlexibleConnectedPositionStrategyOrigin | null = null;
  get Target() {
    return this._target;
  }
  @Input() set Target(value: FlexibleConnectedPositionStrategyOrigin | null) {
    this._target = value;
    this.updatePlacement();
  }

  @ViewChild('template') private _template!: TemplateRef<any>;

  @HostBinding('style')
  private get style() {
    return {
      'position': 'absolute',
      'inset': 0,
      'pointer-events': 'none'
    };
  }

  protected get transitionAnimation(): FlyoutPresenterAnimation {
    return 'Default';
  }

  //The placement asked for, then the opposite side, then the sides across
  private static getPositionCandidates(placement: FlyoutPlacementMode): ConnectedPosition[] {
    let order: FlyoutPlacementMode[];
    switch (placement) {
      case 'Top': order = ['Top', 'Bottom', 'Left', 'Right']; break;
      case 'TopEdgeAlignedLeft': order = ['TopEdgeAlignedLeft', 'BottomEdgeAlignedLeft', 'TopEdgeAlignedRight', 'BottomEdgeAlignedRight']; break;
      case 'TopEdgeAlignedRight': order = ['TopEdgeAlignedRight', 'BottomEdgeAlignedRight', 'TopEdgeAlignedLeft', 'BottomEdgeAlignedLeft']; break;
      case 'Bottom': order = ['Bottom', 'Top', 'Left', 'Right']; break;
      case 'BottomEdgeAlignedLeft': order = ['BottomEdgeAlignedLeft', 'TopEdgeAlignedLeft', 'BottomEdgeAlignedRight', 'TopEdgeAlignedRight']; break;
      case 'BottomEdgeAlignedRight': order = ['BottomEdgeAlignedRight', 'TopEdgeAlignedRight', 'BottomEdgeAlignedLeft', 'TopEdgeAlignedLeft']; break;
      case 'Left': order = ['Left', 'Right', 'Top', 'Bottom']; break;
      case 'LeftEdgeAlignedTop': order = ['LeftEdgeAlignedTop', 'RightEdgeAlignedTop', 'LeftEdgeAlignedBottom', 'RightEdgeAlignedBottom']; break;
      case 'LeftEdgeAlignedBottom': order = ['LeftEdgeAlignedBottom', 'RightEdgeAlignedBottom', 'LeftEdgeAlignedTop', 'RightEdgeAlignedTop']; break;
      case 'Right': order = ['Right', 'Left', 'Top', 'Bottom']; break;
      case 'RightEdgeAlignedTop': order = ['RightEdgeAlignedTop', 'LeftEdgeAlignedTop', 'RightEdgeAlignedBottom', 'LeftEdgeAlignedBottom']; break;
      case 'RightEdgeAlignedBottom': order = ['RightEdgeAlignedBottom', 'LeftEdgeAlignedBottom', 'RightEdgeAlignedTop', 'LeftEdgeAlignedTop']; break;
      default: order = [placement]; break;
    }
    return order.map(p => FlyoutBaseComponent.getPosition(p));
  }

  private static getPosition(placement: FlyoutPlacementMode): ConnectedPosition {

    switch (placement) {
      case "Top":
        return {
          originX: 'center', originY: 'top',
          overlayX: 'center', overlayY: 'bottom'
        };
      case "TopEdgeAlignedLeft":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'start', overlayY: 'bottom'
        };
      case "TopEdgeAlignedRight":
        return {
          originX: 'end', originY: 'top',
          overlayX: 'end', overlayY: 'bottom'
        };

      case "Bottom":
        return {
          originX: 'center', originY: 'bottom',
          overlayX: 'center', overlayY: 'top'
        };
      case "BottomEdgeAlignedLeft":
        return {
          originX: 'start', originY: 'bottom',
          overlayX: 'start', overlayY: 'top'
        };
      case "BottomEdgeAlignedRight":
        return {
          originX: 'end', originY: 'bottom',
          overlayX: 'end', overlayY: 'top'
        };

      case "Left":
        return {
          originX: 'start', originY: 'center',
          overlayX: 'end', overlayY: 'center'
        };
      case "LeftEdgeAlignedTop":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'end', overlayY: 'top'
        };
      case "LeftEdgeAlignedBottom":
        return {
          originX: 'start', originY: 'bottom',
          overlayX: 'end', overlayY: 'bottom'
        };

      case "Right":
        return {
          originX: 'end', originY: 'center',
          overlayX: 'start', overlayY: 'center'
        };
      case "RightEdgeAlignedTop":
        return {
          originX: 'end', originY: 'top',
          overlayX: 'start', overlayY: 'top'
        };
      case "RightEdgeAlignedBottom":
        return {
          originX: 'end', originY: 'bottom',
          overlayX: 'start', overlayY: 'bottom'
        };

      case "Cover":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'start', overlayY: 'top'
        };
    }
  };

  constructor(
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _overlay: Overlay,
    private readonly _hostElement: ElementRef,
    private readonly _changeDetector: ChangeDetectorRef,
    protected readonly _renderer: Renderer2
  ) { }

  ngOnDestroy(): void {
    this.hideOverlay();
  }

  protected OnOverlay(overlay: OverlayRef) {

  }

  /**
   * The flyout has faded in. A standard flyout takes the focus: on its presenter, so its keys reach it and Tab goes on
   * into its content. `focusOrigin` had the focus when it opened.
   */
  protected OnOpened(overlay: OverlayRef, focusOrigin: HTMLElement | null | undefined) {
    if (this.ShowMode !== 'Standard') return;

    let presenter = this.GetPresenter(overlay);
    if (!presenter || presenter.contains(document.activeElement)) return;

    presenter.tabIndex = -1;
    presenter.focus({ preventScroll: true });
  }

  /** The flyout has started to fade out: it is no longer open, and takes no input. */
  protected OnClosing(overlay: OverlayRef) {

  }

  /** The presenter element of the open flyout. */
  protected GetPresenter(overlay: OverlayRef) {
    return overlay.overlayElement.querySelector<HTMLElement>('FlyoutPresenter');
  }

  Show() {
    this.IsOpen = true;
  }

  Hide() {
    this.IsOpen = false;
  }
}
