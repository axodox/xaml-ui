import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayConfig, OverlayRef, OverlaySizeConfig } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "./FlyoutPresenter";
import { resume_after, FlyoutPlacementMode } from "../Common";

export const PopupTemplate = `<ng-template #template><FlyoutPresenter #presenter [IsVisible]="isVisible" [TransitionAnimation]="transitionAnimation" [Padding]="Padding"><ng-content/></FlyoutPresenter></ng-template>`;

@Component({
  imports: [FlyoutPresenter],
  selector: 'FlyoutBase',
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: FlyoutBaseComponent }]
})
export abstract class FlyoutBaseComponent implements OnDestroy {

  @Input() Placement: FlyoutPlacementMode = 'Top';

  @Input() Padding?: string;
  @Input() HasBackdrop = true;

  private _backdropContextMenuSubscription?: () => void;

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
  protected isVisible = false;

  private updatePlacement() {
    if (!this._overlayRef) return;

    let target = this.Target ?? this._hostElement;
    let positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(target)
      .withPositions([this.positioning])
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(true)
      .withPush(true);

    this._overlayRef.updatePositionStrategy(positionStrategy);
    if (this.Placement === 'Cover') {
      this._overlayRef.updateSize(target as OverlaySizeConfig);
    }
  }

  private async showOverlay() {
    //Create overlay
    let config = new OverlayConfig({
      hasBackdrop: this.HasBackdrop,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      backdropClass: 'xaml-flyout-overlay-backdrop'
    });
    this._overlayRef = this._overlay.create(config);
    this.OnOverlay(this._overlayRef);

    //Configure overlay placement
    this.updatePlacement();

    //Display overlay
    let templatePortal = new TemplatePortal(
      this._template,
      this._viewContainerRef
    );

    this._overlayRef.attach(templatePortal);

    //Ensure backdrop event handling
    this._overlayRef.backdropClick().subscribe(() => this.Hide());
    if (this.HasBackdrop) this._backdropContextMenuSubscription = this._renderer.listen(this._overlayRef.backdropElement, 'contextmenu', p => { p.preventDefault(); this.Hide(); });

    //Make content visible - after next layout
    await resume_after(0);

    this.isVisible = true;
  }

  private async hideOverlay() {
    //Start hide animation
    this.isVisible = false;

    //Remove event handlers
    if (this._backdropContextMenuSubscription) this._backdropContextMenuSubscription();

    //Dispose overlay after hidden
    if (this._overlayRef === undefined) return;
    await resume_after(FlyoutPresenter.TransitionDuration);

    this._overlayRef.detach();
    this._overlayRef.dispose();
    this._overlayRef = undefined;
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

  private get positioning(): ConnectedPosition {

    switch (this.Placement) {
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
    private _viewContainerRef: ViewContainerRef,
    private _overlay: Overlay,
    private _hostElement: ElementRef,
    protected _renderer: Renderer2
  ) { }

  ngOnDestroy(): void {
    this.hideOverlay();
  }

  protected OnOverlay(overlay: OverlayRef) {

  }

  Show() {
    this.IsOpen = true;
  }

  Hide() {
    this.IsOpen = false;
  }
}