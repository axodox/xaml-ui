import { Component, HostBinding, Input, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

/**
 * Presenter for {@link ToolTipDirective}. Rendered inside a CDK overlay at body level, so it carries
 * the `xaml-themed` class itself to pull in the theme tokens (the overlay sits outside any XamlRoot).
 * Shows either plain {@link Content} text or, for rich tips, a projected {@link ContentTemplate}
 * (mirrors `ToolTip.Content` accepting arbitrary content). The directive drives {@link IsOpen} for the
 * fade/offset reveal and sets the offset direction via the `--ToolTipOffset*` custom properties.
 */
@Component({
  selector: 'ToolTip',
  imports: [NgTemplateOutlet],
  template: `@if (ContentTemplate) { <ng-container [ngTemplateOutlet]="ContentTemplate" /> } @else { {{ Content }} }`,
  styleUrl: 'ToolTip.scss',
  host: { 'class': 'xaml-themed', 'role': 'tooltip' }
})
export class ToolTipComponent {
  @Input() Content?: string;
  @Input() ContentTemplate?: TemplateRef<unknown>;

  @Input() @HostBinding('class.visible') IsOpen = false;
}
