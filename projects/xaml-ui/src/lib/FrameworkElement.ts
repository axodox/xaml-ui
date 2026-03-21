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
    return 'hidden';
  }

  @HostBinding('style.min-width')
  protected get minWidth() {
    if (this.MinWidth !== undefined) return this.MinWidth;
    return this.MaxWidth === undefined && this.HorizontalAlignment === 'Stretch' ? 'fit-content' : undefined;
  }

  @HostBinding('style.min-height')
  protected get minHeight() {
    if (this.MinHeight !== undefined) return this.MinHeight;
    return this.MaxHeight === undefined && this.VerticalAlignment === 'Stretch' ? 'fit-content' : undefined;
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

  private static _nextId = 1;
  protected readonly _id = FrameworkElementComponent._nextId++;

  static readonly DefaultStyles = `:host {
    display: grid;
    position: relative;
  }`;
}