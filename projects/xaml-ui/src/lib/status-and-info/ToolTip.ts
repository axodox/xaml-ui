import { Component, HostBinding, Input, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

export type ToolTipAnimation = 'SlideUp' | 'SlideDown' | 'SlideLeft' | 'SlideRight';

/**
 * Presenter for {@link ToolTipDirective}. Rendered inside a CDK overlay at body level, so it carries
 * the `xaml-themed` class itself to pull in the theme tokens (the overlay sits outside any XamlRoot).
 * Shows either plain {@link Content} text or, for rich tips, a projected {@link ContentTemplate}
 * (mirrors `ToolTip.Content` accepting arbitrary content). The directive drives {@link IsOpen} for the
 * fade/slide reveal and picks the slide direction with {@link TransitionAnimation}.
 */
@Component({
  selector: 'ToolTip',
  imports: [NgTemplateOutlet],
  template: `@if (ContentTemplate) { <ng-container [ngTemplateOutlet]="ContentTemplate" /> } @else { {{ Content }} }`,
  styleUrl: 'ToolTip.scss',
  host: { 'role': 'tooltip' }
})
export class ToolTipComponent {
  @Input() Content?: string;
  @Input() ContentTemplate?: TemplateRef<unknown>;

  //Direction the tip slides in from; the directive derives it from the placement.
  @Input() TransitionAnimation: ToolTipAnimation = 'SlideUp';

  @Input() @HostBinding('class.visible') IsOpen = false;

  @HostBinding('class')
  private get transitionClass() {
    return 'xaml-themed transition-' + this.TransitionAnimation.toLowerCase();
  }
}
