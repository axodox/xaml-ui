import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayConfig, OverlayRef, OverlaySizeConfig } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "./FlyoutPresenter";
import { FlyoutPlacementMode } from "../Common";

export const PopupTemplate = `<ng-template #template><FlyoutPresenter #presenter [IsVisible]="isVisible" [TransitionAnimation]="transitionAnimation" [Padding]="Padding"><ng-content/></FlyoutPresenter></ng-template>`;

@Component({
  imports: [FlyoutPresenter],
  selector: 'FlyoutBase',
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: FlyoutBaseComponent }]
})
export abstract class FlyoutBaseComponent implements AfterViewInit, OnDestroy {

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
      this.updatePlacement();

      this._overlayRef.attach(this._templatePortal);

      if (this.HasBackdrop) this._backdropContextMenuSubscription = this._renderer.listen(this._overlayRef.backdropElement, 'contextmenu', p => { p.preventDefault(); this.Hide(); });
      setTimeout(() => this.isVisible = true, 0);
    }
    else {
      this.isVisible = false;
      setTimeout(() => this._overlayRef.detach(), FlyoutPresenter.TransitionDuration);

      if (this._backdropContextMenuSubscription) this._backdropContextMenuSubscription();
    }
    this.IsOpenChange.emit(value);
  }

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

  protected isVisible = false;

  @Output() IsOpenChange = new EventEmitter<boolean>();

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

  private _overlayRef!: OverlayRef;
  private _templatePortal!: TemplatePortal;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _overlay: Overlay,
    private _hostElement: ElementRef,
    protected _renderer: Renderer2
  ) {

  }

  ngOnDestroy(): void {
    if (this._backdropContextMenuSubscription) this._backdropContextMenuSubscription();
  }

  ngAfterViewInit(): void {
    this._templatePortal = new TemplatePortal(
      this._template,
      this._viewContainerRef
    );

    let config = new OverlayConfig({
      hasBackdrop: this.HasBackdrop,
      scrollStrategy: this._overlay.scrollStrategies.reposition()
    });
    this._overlayRef = this._overlay.create(config);
    this._overlayRef.backdropClick().subscribe(() => this.Hide());
    this.OnOverlay(this._overlayRef);
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