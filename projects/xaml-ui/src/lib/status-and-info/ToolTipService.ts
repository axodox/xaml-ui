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

  //The content may change while the tip shows: the open tip follows it, and closes when it is cleared
  private _toolTip?: string;
  get ToolTip() {
    return this._toolTip;
  }
  @Input('ToolTipService-ToolTip') set ToolTip(value: string | undefined) {
    if (value === this._toolTip) return;

    this._toolTip = value;
    this.updateContent();
  }

  private _toolTipTemplate?: TemplateRef<unknown>;
  get ToolTipTemplate() {
    return this._toolTipTemplate;
  }
  @Input('ToolTipService-ToolTipTemplate') set ToolTipTemplate(value: TemplateRef<unknown> | undefined) {
    if (value === this._toolTipTemplate) return;

    this._toolTipTemplate = value;
    this.updateContent();
  }

  @Input('ToolTipService-Placement') Placement: PlacementMode = 'Mouse';

  private _overlayRef?: OverlayRef;
  private _toolTipRef?: ComponentRef<ToolTipComponent>;

  //After a press the tip stays away until the pointer has left the element, as in WinUI
  private _isSuppressed = false;
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

  //Keyboard focus shows the tip; the focus a click gives does not
  @HostListener('focusin', ['$event'])
  protected onFocusIn(event: FocusEvent): void {
    if (!(event.target as Element | null)?.matches?.(':focus-visible')) return;
    this.scheduleShow(event);
  }

  //A mouse or pen over the element shows the tip; a finger does not
  @HostListener('pointerover', ['$event'])
  protected onPointerOver(event: PointerEvent): void {
    if (event.pointerType === 'touch' || this._isSuppressed) return;

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
    this._isSuppressed = true;
    this.hideOverlay();
  }

  @HostListener('pointerout', ['$event'])
  @HostListener('focusout', ['$event'])
  protected onPointerOut(event: PointerEvent | FocusEvent): void {
    //These events also fire when crossing between descendants — only dismiss on a real exit.
    const related = event.relatedTarget as Node | null;
    if (related && this._hostElement.nativeElement.contains(related)) return;
    if (event.type === 'pointerout') this._isSuppressed = false;
    this.hideOverlay();
  }

  //Shows the new content in the open tip, or closes it when there is none left
  private updateContent(): void {
    if (!this._toolTipRef) return;

    if (!this.ToolTip && !this.ToolTipTemplate) {
      this.hideOverlay();
      return;
    }

    this._toolTipRef.setInput('ContentTemplate', this.ToolTipTemplate);
    this._toolTipRef.setInput('Content', this.ToolTipTemplate ? undefined : this.ToolTip);
    this._overlayRef?.updatePosition();
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
    const toolTip = this._overlayRef.attach(new ComponentPortal(ToolTipComponent));
    this._toolTipRef = toolTip;

    //Set content
    const element = toolTip.location.nativeElement as HTMLElement;
    if (this.ToolTipTemplate) {
      toolTip.setInput('ContentTemplate', this.ToolTipTemplate);
    } else {
      toolTip.setInput('Content', this.ToolTip);
    }

    //Add accessibility info
    element.id = this._id;
    this._hostElement.nativeElement.setAttribute('aria-describedby', this._id);

    //Make content visible - after next layout
    await resume_after(0);
    if (this._toolTipRef !== toolTip) return;

    toolTip.setInput('IsVisible', true);
    this._changeDetector.markForCheck();
  }

  private async hideOverlay(): Promise<void> {
    //Cancel any pending show
    if (this._revealTimer) {
      clearTimeout(this._revealTimer);
      this._revealTimer = undefined;
    }

    //Start hide animation
    this._toolTipRef?.setInput('IsVisible', false);

    //Dispose overlay after hidden
    const overlayRef = this._overlayRef;
    if (!overlayRef) return;

    this._hostElement.nativeElement.removeAttribute('aria-describedby');
    this._toolTipRef = undefined;
    this._overlayRef = undefined;
    await resume_after(ToolTipComponent.TransitionDuration);

    overlayRef.detach();
    overlayRef.dispose();
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
