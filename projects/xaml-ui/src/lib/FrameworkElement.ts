import { Component, HostBinding, Input } from "@angular/core";
import { HorizontalAlignment, toAlignment, toJustification, VerticalAlignment } from "./Common";

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
  protected get overflow() {
    return 'clip';
  }

  @HostBinding('style.min-width')
  protected get minWidth() {
    return this.minimumSize(this.MinWidth, this.MaxWidth, this.HorizontalAlignment);
  }

  @HostBinding('style.min-height')
  protected get minHeight() {
    return this.minimumSize(this.MinHeight, this.MaxHeight, this.VerticalAlignment);
  }

  //An explicit minimum always wins, otherwise a stretched element without a maximum gets a content
  //based minimum, so it is never squeezed below its content. Safari fails to scroll when that is set,
  //so there we leave the minimum at its initial value instead.
  private minimumSize(min: string | undefined, max: string | undefined, alignment: HorizontalAlignment | VerticalAlignment) {
    if (min !== undefined) return min;
    if (FrameworkElementComponent.IsSafari) return undefined;
    return max === undefined && alignment === 'Stretch' ? 'fit-content' : undefined;
  }

  @HostBinding('style.width')
  protected get width() {
    if (this.Width !== undefined) return this.Width;
    return this.HorizontalAlignment === 'Stretch' ? undefined : 'fit-content';
  }

  @HostBinding('style.height')
  protected get height() {
    if (this.Height !== undefined) return this.Height;
    return this.VerticalAlignment === 'Stretch' ? undefined : 'fit-content';
  }

  @HostBinding('style.justify-self')
  protected get justifySelf() {
    return toJustification(this.HorizontalAlignment);
  }

  @HostBinding('style.align-self')
  protected get alignSelf() {
    return toAlignment(this.VerticalAlignment);
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