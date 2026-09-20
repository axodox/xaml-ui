import { Component, HostBinding, Input } from "@angular/core";
import { HorizontalAlignment, ToAlignment, ToJustification, VerticalAlignment } from "./Common";

@Component({
  selector: 'FrameworkElement',
  template: `<ng-container/>`
})
export abstract class FrameworkElementComponent {
  @Input() Width?: string;
  @Input() MinWidth?: string;
  @Input() @HostBinding('style.max-width') MaxWidth?: string;

  @Input() Height?: string;
  @Input() MinHeight?: string;
  @Input() @HostBinding('style.max-height') MaxHeight?: string;

  @Input() HorizontalAlignment: HorizontalAlignment = 'Stretch';
  @Input() VerticalAlignment: VerticalAlignment = 'Stretch';
  @Input() @HostBinding('style.margin') Margin?: string;
  @Input() @HostBinding('style.padding') Padding?: string;
  @Input() @HostBinding('style.opacity') Opacity?: string | number;

  @HostBinding('style.overflow')
  protected get overflow() : string | undefined {
    return undefined;//'clip';
  }

  @HostBinding('style.min-width')
  protected get minWidth() {
    return this.MinWidth;
  }

  @HostBinding('style.min-height')
  protected get minHeight() {
    return this.MinHeight;
  }

  @HostBinding('style.width')
  protected get width() {
    return this.Width;
  }

  @HostBinding('style.height')
  protected get height() {
    return this.Height;
  }

  @HostBinding('style.justify-self')
  protected get justifySelf() {
    return ToJustification(this.HorizontalAlignment);
  }

  @HostBinding('style.align-self')
  protected get alignSelf() {
    return ToAlignment(this.VerticalAlignment);
  }

  private static _isSafari?: boolean;

  //True on Safari and on the other WebKit based browsers of Apple platforms, which share its layout
  //engine. Evaluated once, as host bindings are re-read on every change detection pass.
  static get IsSafari() {
    if (this._isSafari === undefined) {
      this._isSafari = typeof navigator !== 'undefined' && /apple/i.test(navigator.vendor ?? '');
    }
    return this._isSafari;
  }

  private static _nextId = 1;
  protected readonly _id = FrameworkElementComponent._nextId++;

  static readonly DefaultStyles = `:host {
    display: grid;
    position: relative;
  }`;
}