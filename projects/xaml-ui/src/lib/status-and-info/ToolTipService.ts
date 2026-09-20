import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, HostBinding, HostListener, Input, NgModule, OnDestroy, TemplateRef, inject } from "@angular/core";
import { PlacementMode, resume_after } from "../Common";
import { ToolTipComponent } from "./ToolTip";

@Directive({
  selector: '[ToolTipService-ToolTip], [ToolTipService-ToolTipTemplate]',
  standalone: false
})
export class ToolTipDirective implements OnDestroy {
  
  private static _nextToolTipId = 1;
  private readonly _id = `xaml-tooltip-${ToolTipDirective._nextToolTipId++}`;

  //Delay before a hovered/focused tip appears
  private static _revealDelay = 400;

  //Gap between the target and the tool tip
  private static readonly _targetElementSpacing = 8;

  //Vertical clearance below the pointer for `Mouse` placement, so the tip clears the cursor glyph.
  private static readonly _cursorSpacing = 20;

  @Input('ToolTipService-ToolTip') ToolTip?: string;
  @Input('ToolTipService-ToolTipTemplate') ToolTipTemplate?: TemplateRef<unknown>;
  @Input('ToolTipService-Placement') Placement: PlacementMode = 'Mouse';

  private _overlayRef?: OverlayRef;
  private _toolTip?: ComponentRef<ToolTipComponent>;
  private _revealTimer?: number;
  private _pointerPosition?: { x: number, y: number };

  constructor(
    private readonly _hostElement: ElementRef<HTMLElement>,
    private readonly _overlay: Overlay,
    private readonly _changeDetector: ChangeDetectorRef) {
  }

  //Tags this host as a tooltip owner so ancestors can detect that a nested tip should win (see below).
  @HostBinding('attr.xaml-tooltip')
  protected get marker(): string | null {
    return this.ToolTip || this.ToolTipTemplate ? '' : null;
  }

  @HostListener('focusin', ['$event'])
  protected onFocusIn(event: FocusEvent): void {
    this.scheduleShow(event);
  }

  @HostListener('pointerover', ['$event'])
  protected onPointerOver(event: PointerEvent): void {
    this.updatePointerPosition(event);
    this.scheduleShow(event);
  }

  private updatePointerPosition(event: PointerEvent): void {
    if (!this._overlayRef) {
      this._pointerPosition = { x: event.clientX, y: event.clientY };
    }
  }

  private scheduleShow(event: Event): void {
    //If the tooltip is already open or scheduled to open, do nothing
    if (this._overlayRef || this._revealTimer) return;

    //If we have no tooltip content, then nothing to show
    if (!this.ToolTip && !this.ToolTipTemplate) return;

    //If this is not the top-most tool-tip, then return and let that show
    const target = event.target as Element | null;
    if (target?.closest?.('[xaml-tooltip]') !== this._hostElement.nativeElement) {
      this.hideOverlay();
      return;
    }
    
    //Otherwise, schedule the tooltip to show after a delay
    this._revealTimer = setTimeout(() => {
      this._revealTimer = undefined;
      this.showOverlay();
    }, ToolTipDirective._revealDelay);
  }

  //Track the cursor until the tooltip opens
  @HostListener('pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    this.updatePointerPosition(event);
  }

  @HostListener('pointerdown')
  protected onPointerDown(): void {
    this.hideOverlay();
  }

  @HostListener('pointerout', ['$event'])
  @HostListener('focusout', ['$event'])
  protected onPointerOut(event: PointerEvent | FocusEvent): void {
    //These events also fire when crossing between descendants — only dismiss on a real exit.
    const related = event.relatedTarget as Node | null;
    if (related && this._hostElement.nativeElement.contains(related)) return;
    this.hideOverlay();
  }

  private async showOverlay() {
    //If the tooltip is already open, or if there is no content, do nothing
    if ((!this.ToolTip && !this.ToolTipTemplate) || this._overlayRef) return;

    //Define placement
    const placement = this.Placement !== 'Mouse' || this._pointerPosition !== undefined ? this.Placement : 'Top';
    this._overlayRef = this._overlay.create(new OverlayConfig({
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(placement === 'Mouse' ? this._pointerPosition! : this._hostElement)
        .withPositions(ToolTipDirective.getPositionCandidates(placement))
        .withPush(true),
      scrollStrategy: this._overlay.scrollStrategies.close()
    }));

    //The tip is presentation only — never let it capture the pointer or block what's beneath it.
    this._overlayRef.overlayElement.style.pointerEvents = 'none';

    //Show tooltip
    this._toolTip = this._overlayRef.attach(new ComponentPortal(ToolTipComponent));

    //Set content
    const element = this._toolTip.location.nativeElement as HTMLElement;
    if (this.ToolTipTemplate) {
      this._toolTip.setInput('ContentTemplate', this.ToolTipTemplate);
    } else {
      this._toolTip.setInput('Content', this.ToolTip);
    }

    //Add accessibility info
    element.id = this._id;
    this._hostElement.nativeElement.setAttribute('aria-describedby', this._id);

    //Make content visible - after next layout
    await resume_after(0);

    this._toolTip.setInput('IsVisible', true);
    this._changeDetector.markForCheck();
  }

  private async hideOverlay(): Promise<void> {
    //Cancel any pending show
    if (this._revealTimer) {
      clearTimeout(this._revealTimer);
      this._revealTimer = undefined;
    }

    //Start hide animation
    this._toolTip?.setInput('IsVisible', false);

    //Dispose overlay after hidden
    if (!this._overlayRef) return;    
    await resume_after(ToolTipComponent.TransitionDuration);

    this._hostElement.nativeElement.removeAttribute('aria-describedby');

    this._toolTip = undefined;
    this._overlayRef.detach();
    this._overlayRef.dispose();
    this._overlayRef = undefined;
  }

  private static getPositionCandidates(placement: PlacementMode): ConnectedPosition[] {
    //Primary placement plus the opposite side as a fallback, so the tip flips when it would clip.
    switch (placement) {
      case 'Mouse':
        return [
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: ToolTipDirective._cursorSpacing },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -ToolTipDirective._targetElementSpacing }
        ];
      case 'Bottom':
        return [
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: ToolTipDirective._targetElementSpacing },
          { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -ToolTipDirective._targetElementSpacing }
        ];
      case 'Left':
        return [
          { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -ToolTipDirective._targetElementSpacing },
          { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: ToolTipDirective._targetElementSpacing }
        ];
      case 'Right':
        return [
          { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: ToolTipDirective._targetElementSpacing },
          { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -ToolTipDirective._targetElementSpacing }
        ];
      case 'Top':
      default:
        return [
          { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -ToolTipDirective._targetElementSpacing },
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: ToolTipDirective._targetElementSpacing }
        ];
    }
  }

  ngOnDestroy(): void {
    if (this._revealTimer) clearTimeout(this._revealTimer);
    this._overlayRef?.dispose();
  }
}

@NgModule({
  declarations: [ToolTipDirective],
  exports: [ToolTipDirective]
})
export class ToolTipServiceModule { }
