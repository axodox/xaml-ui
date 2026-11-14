import { Component, ElementRef, HostBinding, Input, inject } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { HorizontalAlignment, VerticalAlignment } from "../Common";

/** What an InfoBadge shows: a number, a glyph or, with neither, a dot. */
export type InfoBadgeKind = 'Value' | 'Icon' | 'Dot';

//WinUI's InfoBadge styles which bring their own icon (an IconSource setter) for when the owner sets none
const StyleIcons: [string, string][] = [
  ['AttentionIconInfoBadgeStyle', '\uEA38'],
  ['InformationalIconInfoBadgeStyle', '\uF13F'],
  ['SuccessIconInfoBadgeStyle', '\uE8FB'],
  ['CautionIconInfoBadgeStyle', '\uE8C9'],
  ['CriticalIconInfoBadgeStyle', '\uE711']
];

/**
 * A small badge for notifications or status, as WinUI's `InfoBadge`: a number when `Value` is 0 or more, else a
 * glyph when there is an `Icon`, else a dot. Its colour comes from WinUI's style classes
 * (`Class="CriticalValueInfoBadgeStyle"` and the like); without one it is filled with the accent colour.
 */
@Component({
  selector: 'InfoBadge',
  template: `@switch (Kind) {
    @case ('Value') { <span class="text">{{Value}}</span> }
    @case ('Icon') { <span class="glyph" aria-hidden="true">{{glyph}}</span> }
  }`,
  styleUrl: 'InfoBadge.scss'
})
export class InfoBadgeComponent extends FrameworkElementComponent {
  /** The number to show; -1 (the default) shows none. */
  @Input() Value = -1;

  /** A Segoe Fluent Icons glyph to show when there is no value (WinUI's `IconSource`). */
  @Input() Icon?: string;

  /** A name for assistive technology; without one the badge is read as its number, or not at all. */
  @Input('aria-label') AriaLabel?: string;

  override HorizontalAlignment: HorizontalAlignment = 'Left';
  override VerticalAlignment: VerticalAlignment = 'Center';

  private readonly _element: ElementRef<HTMLElement> = inject(ElementRef);

  /** What the badge shows, from `Value` and `Icon` (and the icon a style class brings). */
  get Kind(): InfoBadgeKind {
    if (this.Value >= 0) return 'Value';
    if (this.glyph !== undefined) return 'Icon';
    return 'Dot';
  }

  protected get glyph() {
    if (this.Icon) return this.Icon;

    let classes = this._element.nativeElement.classList;
    return StyleIcons.find(p => classes.contains(p[0]))?.[1];
  }

  @HostBinding('class.value-badge')
  private get isValue() {
    return this.Kind === 'Value';
  }

  @HostBinding('class.icon-badge')
  private get isIcon() {
    return this.Kind === 'Icon';
  }

  @HostBinding('class.dot-badge')
  private get isDot() {
    return this.Kind === 'Dot';
  }

  @HostBinding('attr.aria-label')
  private get ariaLabel() {
    return this.AriaLabel ?? null;
  }

  //A label alone is not read on a plain element; with one, the badge is an image of what the label says
  @HostBinding('attr.role')
  private get role() {
    return this.AriaLabel ? 'img' : null;
  }
}
