import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, Directive, ElementRef, Input, NgModule, OnDestroy, TemplateRef, inject } from "@angular/core";
import { FlyoutPlacementMode } from "../Common";
import { ToolTipComponent } from "./ToolTip";

let nextToolTipId = 0;

/**
 * WinUI-style tooltip. Applied via `ToolTipService-ToolTip` (plain text) or
 * `ToolTipService-ToolTipTemplate` (rich content), it shows a themed popup (a {@link ToolTipComponent}
 * in a CDK overlay) positioned relative to the host, after a short hover or focus delay, and dismisses
 * on leave / blur / press / scroll. Kept API-compatible with the previous `title`-attribute
 * implementation so existing markup needs no changes.
 *
 * Mirrors `Microsoft.UI.Xaml.Controls.ToolTip`: `Placement` positions the tip relative to the target
 * (default `Top`), with an automatic flip to the opposite side when there is no room.
 *
 * Hit-testing is nearest-owner-wins: the tip only opens while the pointer's closest tooltip-owning
 * element is *this* host. So a tip on a container yields to a tip on a control nested inside it (each
 * host is tagged `data-xaml-tooltip`, and the handlers resolve the nearest owner under the pointer).
 */
@Directive({
  selector: '[ToolTipService-ToolTip], [ToolTipService-ToolTipTemplate]',
  standalone: false,
  host: {
    '(pointerover)': 'OnOver($event)',
    '(pointerout)': 'OnOut($event)',
    '(pointerdown)': 'Hide()',
    '(focusin)': 'OnOver($event)',
    '(focusout)': 'OnOut($event)',
    '[attr.data-xaml-tooltip]': 'Marker'
  }
})
export class ToolTipDirective implements OnDestroy {
  /** Delay before a hovered/focused tip appears, and how long it stays before auto-dismissing (ms). */
  static InitialShowDelay = 400;
  static ShowDuration = 5000;

  /** Gap between the target and the tip, and the distance the tip slides in over (px). */
  private static readonly Gap = 8;
  private static readonly Reveal = 4;

  @Input('ToolTipService-ToolTip') ToolTip?: string;
  @Input('ToolTipService-ToolTipTemplate') ToolTipTemplate?: TemplateRef<unknown>;
  @Input('ToolTipService-Placement') Placement: FlyoutPlacementMode = 'Top';

  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _overlay = inject(Overlay);

  private readonly _id = `xaml-tooltip-${nextToolTipId++}`;
  private _overlayRef?: OverlayRef;
  private _tip?: ComponentRef<ToolTipComponent>;
  private _showTimer?: ReturnType<typeof setTimeout>;
  private _hideTimer?: ReturnType<typeof setTimeout>;

  // Tags this host as a tooltip owner so ancestors can detect that a nested tip should win (see below).
  protected get Marker(): string | null {
    return this.ToolTip || this.ToolTipTemplate ? '' : null;
  }

  protected OnOver(event: PointerEvent | FocusEvent): void {
    if (!this.ToolTip && !this.ToolTipTemplate) return;

    // Yield unless this host is the pointer's nearest tooltip owner (so a nested tip takes over).
    const target = event.target as Element | null;
    if (target?.closest?.('[data-xaml-tooltip]') !== this._host.nativeElement) {
      this.Hide();
      return;
    }

    if (this._overlayRef || this._showTimer) return;
    this._showTimer = setTimeout(() => {
      this._showTimer = undefined;
      this.Show();
    }, ToolTipDirective.InitialShowDelay);
  }

  protected OnOut(event: PointerEvent | FocusEvent): void {
    // pointerout/focusout also fire when crossing between descendants — only dismiss on a real exit.
    const related = event.relatedTarget as Node | null;
    if (related && this._host.nativeElement.contains(related)) return;
    this.Hide();
  }

  private Show(): void {
    if ((!this.ToolTip && !this.ToolTipTemplate) || this._overlayRef) return;

    this._overlayRef = this._overlay.create(new OverlayConfig({
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._host)
        .withPositions(this.positions())
        .withPush(true),
      scrollStrategy: this._overlay.scrollStrategies.close()
    }));
    // The tip is presentation only — never let it capture the pointer or block what's beneath it.
    this._overlayRef.overlayElement.style.pointerEvents = 'none';

    this._tip = this._overlayRef.attach(new ComponentPortal(ToolTipComponent));
    const element = this._tip.location.nativeElement as HTMLElement;
    if (this.ToolTipTemplate) {
      this._tip.setInput('ContentTemplate', this.ToolTipTemplate);
    } else {
      this._tip.setInput('Content', this.ToolTip);
    }
    element.id = this._id;
    this.applyReveal(element);
    this._host.nativeElement.setAttribute('aria-describedby', this._id);

    // Commit the hidden/offset start state (force a reflow), then flip visible so the fade/slide
    // transition actually runs — reflow is reliable where a throttled rAF would not be.
    void element.offsetWidth;
    this._tip.setInput('IsOpen', true);

    this._hideTimer = setTimeout(() => this.Hide(), ToolTipDirective.ShowDuration);
  }

  Hide(): void {
    if (this._showTimer) {
      clearTimeout(this._showTimer);
      this._showTimer = undefined;
    }
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = undefined;
    }
    if (!this._overlayRef) return;

    this._host.nativeElement.removeAttribute('aria-describedby');
    this._tip?.setInput('IsOpen', false);

    // Dispose after the fade-out so it doesn't vanish mid-transition.
    const ref = this._overlayRef;
    this._overlayRef = undefined;
    this._tip = undefined;
    setTimeout(() => ref.dispose(), 200);
  }

  // Primary placement plus the opposite side as a fallback, so the tip flips when it would clip.
  private positions(): ConnectedPosition[] {
    const g = ToolTipDirective.Gap;
    const map: Record<string, [ConnectedPosition, ConnectedPosition]> = {
      Bottom: [
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: g },
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -g }
      ],
      Left: [
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -g },
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: g }
      ],
      Right: [
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: g },
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -g }
      ],
      Top: [
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -g },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: g }
      ]
    };
    return map[this.Placement] ?? map['Top'];
  }

  // The reveal slides the tip in from the target's direction; pick the axis/sign from the placement.
  private applyReveal(element: HTMLElement): void {
    const r = ToolTipDirective.Reveal;
    const offset = { x: '0', y: '0' };
    switch (this.Placement) {
      case 'Bottom': offset.y = `${-r}px`; break;
      case 'Left': offset.x = `${r}px`; break;
      case 'Right': offset.x = `${-r}px`; break;
      default: offset.y = `${r}px`; break; // Top
    }
    element.style.setProperty('--ToolTipOffsetX', offset.x);
    element.style.setProperty('--ToolTipOffsetY', offset.y);
  }

  ngOnDestroy(): void {
    if (this._showTimer) clearTimeout(this._showTimer);
    if (this._hideTimer) clearTimeout(this._hideTimer);
    this._overlayRef?.dispose();
  }
}

@NgModule({
  declarations: [ToolTipDirective],
  exports: [ToolTipDirective]
})
export class ToolTipServiceModule { }
