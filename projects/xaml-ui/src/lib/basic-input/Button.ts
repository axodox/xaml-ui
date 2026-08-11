import { Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { HorizontalAlignment, toAlignment, toJustification, VerticalAlignment } from "../Common";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { CommonModule } from "@angular/common";
import { TextBlockComponent } from "../text/TextBlock";

export const ButtonTemplate = `<ng-content *ngIf="Content === undefined"/>
  <TextBlock *ngIf="Content !== undefined">{{Content}}</TextBlock>`;

@Component({
  selector: 'Button',
  imports: [CommonModule, TextBlockComponent],
  template: ButtonTemplate,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent {
  @Input() IsEnabled: boolean = true;
  @Input() Content?: string;

  @Output() Click = new EventEmitter();
  /**
   * Right mouse button (WinUI `RightTapped`). `Click` is left-only, so this exposes the right button
   * separately — e.g. to copy the value or open a custom menu. The native `MouseEvent` is passed so a
   * handler can `preventDefault()` to suppress the browser context menu.
   */
  @Output() RightTapped = new EventEmitter<MouseEvent>();

  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  @HostBinding('style.align-content')
  private get alignContent() {
    return toAlignment(this.VerticalContentAlignment);
  }

  @HostBinding('style.justify-content')
  private get justifyContent() {
    return toJustification(this.HorizontalContentAlignment);
  }

  @HostBinding('attr.type')
  private readonly type = 'button';

  // Pressed visual (see Button.scss `.pressed`). Driven in JS so it engages on the LEFT button only —
  // CSS `:active` can't tell the buttons apart and would light up on a right/middle press too.
  @HostBinding('class.pressed')
  protected _pressed = false;

  @HostListener('pointerdown', ['$event'])
  protected onPressStart(event: PointerEvent) {
    if (this.IsEnabled && event.button === 0) this._pressed = true;
  }

  @HostListener('pointerup')
  @HostListener('pointercancel')
  @HostListener('pointerleave')
  protected onPressEnd() {
    this._pressed = false;
  }

  @HostBinding('attr.disabled')
  @HostBinding('class.disabled')
  private get disabled() {
    return this.IsEnabled ? undefined : true;
  }

  @HostBinding('class.flyout-open')
  private get flyoutOpen() {
    return this._flyout?.IsOpen;
  }

  @ContentChild('xaml-flyout')
  private _flyout?: FlyoutBaseComponent;

  @HostListener('click', ['$event'])
  protected onClick(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit(event);
    this._flyout?.Show();
  }

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent) {
    if (!this.IsEnabled) return;

    this.RightTapped.emit(event);
  }
}