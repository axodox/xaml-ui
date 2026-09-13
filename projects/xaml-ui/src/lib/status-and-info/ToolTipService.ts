import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Subscription } from "rxjs";
import { ComponentRef, Directive, ElementRef, HostBinding, HostListener, Input, NgModule, OnDestroy, TemplateRef, inject } from "@angular/core";
import { PlacementMode } from "../Common";
import { ToolTipAnimation, ToolTipComponent } from "./ToolTip";

let nextToolTipId = 0;

/**
 * WinUI-style tooltip. Applied via `ToolTipService-ToolTip` (plain text) or
 * `ToolTipService-ToolTipTemplate` (rich content), it shows a themed popup (a {@link ToolTipComponent}
 * in a CDK overlay) positioned relative to the host, after a short hover or focus delay, and dismisses
 * on leave / blur / press / scroll. Kept API-compatible with the previous `title`-attribute
 * implementation so existing markup needs no changes.
 *
 * Mirrors `Microsoft.UI.Xaml.Controls.ToolTip`: `Placement` positions the tip relative to the target
 * (default `Top`), with an automatic flip to the opposite side when there is no room. `Mouse` anchors
 * the tip's top-left corner to the pointer instead, falling back to `Top` when opened by keyboard focus.
 *
 * Hit-testing is nearest-owner-wins: the tip only opens while the pointer's closest tooltip-owning
 * element is *this* host. So a tip on a container yields to a tip on a control nested inside it (each
 * host is tagged `data-xaml-tooltip`, and the handlers resolve the nearest owner under the pointer).
 */
@Directive({
  selector: '[ToolTipService-ToolTip], [ToolTipService-ToolTipTemplate]',
  standalone: false
})
export class ToolTipDirective implements OnDestroy {
  
  private readonly _id = `xaml-tooltip-${nextToolTipId++}`;

  //Delay before a hovered/focused tip appears
  private static _revealDelay = 400;

  //Gap between the target and the tool tip
  private static readonly _targetElementSpacing = 8;

  //Vertical clearance below the pointer for `Mouse` placement, so the tip clears the cursor glyph.
  private static readonly _cursorSpacing = 20;

  @Input('ToolTipService-ToolTip') ToolTip?: string;
  @Input('ToolTipService-ToolTipTemplate') ToolTipTemplate?: TemplateRef<unknown>;
  @Input('ToolTipService-Placement') Placement: PlacementMode = 'Top';

  private _toolTipOverlay?: OverlayRef;
  private _toolTip?: ComponentRef<ToolTipComponent>;
  private _positionSubscription?: Subscription;
  private _revealTimer?: number;
  //Last pointer position over this host, for `Mouse` placement; undefined when opened by focus.
  private _pointerPosition?: { x: number, y: number };

  constructor(
    private readonly _host: ElementRef<HTMLElement>,
    private readonly _overlay: Overlay) {
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
    if (!this._toolTipOverlay) {
      this._pointerPosition = { x: event.clientX, y: event.clientY };
    }
  }

  private scheduleShow(event: Event): void {
    //If the tooltip is already open or scheduled to open, do nothing
    if (this._toolTipOverlay || this._revealTimer) return;

    //If we have no tooltip content, then nothing to show
    if (!this.ToolTip && !this.ToolTipTemplate) return;

    //If this is not the top-most tool-tip, then return and let that show
    const target = event.target as Element | null;
    if (target?.closest?.('[xaml-tooltip]') !== this._host.nativeElement) {
      this.hide();
      return;
    }
    
    //Otherwise, schedule the tooltip to show after a delay
    this._revealTimer = setTimeout(() => {
      this._revealTimer = undefined;
      this.show();
    }, ToolTipDirective._revealDelay);
  }

  //Track the cursor until the tooltip opens
  @HostListener('pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    this.updatePointerPosition(event);
  }

  @HostListener('pointerdown')
  protected onPointerDown(): void {
    this.hide();
  }

  @HostListener('pointerout', ['$event'])
  @HostListener('focusout', ['$event'])
  protected onPointerOut(event: PointerEvent | FocusEvent): void {
    //These events also fire when crossing between descendants — only dismiss on a real exit.
    const related = event.relatedTarget as Node | null;
    if (related && this._host.nativeElement.contains(related)) return;
    this.hide();
  }

  private show(): void {
    if ((!this.ToolTip && !this.ToolTipTemplate) || this._toolTipOverlay) return;

    const placement = this.Placement !== 'Mouse' || this._pointerPosition !== undefined ? this.Placement : 'Top';
    const positionStrategy = this._overlay.position()
      .flexibleConnectedTo(placement === 'Mouse' ? this._pointerPosition! : this._host)
      .withPositions(ToolTipDirective.getPlacementOptions(placement))
      .withPush(true);
      
    this._toolTipOverlay = this._overlay.create(new OverlayConfig({
      positionStrategy,
      scrollStrategy: this._overlay.scrollStrategies.close()
    }));

    //The tip flips to its fallback side when the primary one would clip, so the slide direction has to
    //follow the position actually applied. The first change arrives synchronously from attach() below.
    let animation: ToolTipAnimation = 'SlideUp';
    this._positionSubscription = positionStrategy.positionChanges.subscribe(change => {
      animation = ToolTipDirective.getTransitionAnimation(change.connectionPair);
      this._toolTip?.setInput('TransitionAnimation', animation);
    });
    //The tip is presentation only — never let it capture the pointer or block what's beneath it.
    this._toolTipOverlay.overlayElement.style.pointerEvents = 'none';

    this._toolTip = this._toolTipOverlay.attach(new ComponentPortal(ToolTipComponent));
    const element = this._toolTip.location.nativeElement as HTMLElement;
    if (this.ToolTipTemplate) {
      this._toolTip.setInput('ContentTemplate', this.ToolTipTemplate);
    } else {
      this._toolTip.setInput('Content', this.ToolTip);
    }
    element.id = this._id;
    this._toolTip.setInput('TransitionAnimation', animation);
    this._host.nativeElement.setAttribute('aria-describedby', this._id);

    //Commit the hidden/offset start state (force a reflow), then flip visible so the fade/slide
    //transition actually runs — reflow is reliable where a throttled rAF would not be.
    void element.offsetWidth;
    this._toolTip.setInput('IsOpen', true);
  }

  private hide(): void {
    if (this._revealTimer) {
      clearTimeout(this._revealTimer);
      this._revealTimer = undefined;
    }
    if (!this._toolTipOverlay) return;

    this._positionSubscription?.unsubscribe();
    this._positionSubscription = undefined;

    this._host.nativeElement.removeAttribute('aria-describedby');
    this._toolTip?.setInput('IsOpen', false);

    //Dispose after the fade-out so it doesn't vanish mid-transition.
    const ref = this._toolTipOverlay;
    this._toolTipOverlay = undefined;
    this._toolTip = undefined;
    setTimeout(() => ref.dispose(), 200);
  }

  private static getPlacementOptions(placement: PlacementMode): ConnectedPosition[] {
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

  private static getTransitionAnimation(position: ConnectedPosition): ToolTipAnimation {
    //A side placement pins the tip's vertical centre, so the slide runs on the axis it is offset along.
    if (position.overlayY === 'center') {
      return position.overlayX === 'end' ? 'SlideLeft' : 'SlideRight';
    }
    else{
      return position.overlayY === 'bottom' ? 'SlideUp' : 'SlideDown';
    }
  }

  ngOnDestroy(): void {
    this._positionSubscription?.unsubscribe();
    if (this._revealTimer) clearTimeout(this._revealTimer);
    this._toolTipOverlay?.dispose();
  }
}

@NgModule({
  declarations: [ToolTipDirective],
  exports: [ToolTipDirective]
})
export class ToolTipServiceModule { }
