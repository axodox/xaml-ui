import { Component, HostBinding, Input, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { XamlRootComponent } from "../XamlRoot";

/**
 * Presenter for {@link ToolTipDirective}. Rendered inside a CDK overlay at body level, so it carries
 * the `xaml-themed` class itself to pull in the theme tokens, and wraps its content in its own
 * `XamlRoot` — like a flyout does — so the host app's cascade cannot reach the tip.
 * Shows either plain {@link Content} text or, for rich tips, a projected {@link ContentTemplate}
 * (mirrors `ToolTip.Content` accepting arbitrary content). The directive drives {@link IsVisible} for the
 * fade reveal.
 */
@Component({
  selector: 'ToolTip',
  imports: [NgTemplateOutlet, XamlRootComponent],
  template: `<XamlRoot>@if (ContentTemplate) { <ng-container [ngTemplateOutlet]="ContentTemplate" /> } @else { {{ Content }} }</XamlRoot>`,
  styleUrl: 'ToolTip.scss',
  host: { 'class': 'xaml-themed', 'role': 'tooltip' }
})
export class ToolTipComponent {
  //Matches the `--ControlFastAnimationDuration` fade in the styles (ms).
  static TransitionDuration = 167;

  @Input() Content?: string;
  @Input() ContentTemplate?: TemplateRef<unknown>;

  @Input() @HostBinding('class.visible') IsVisible = false;
}
