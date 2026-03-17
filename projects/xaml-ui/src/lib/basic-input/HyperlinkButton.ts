import { Component, HostBinding, HostListener, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBlockComponent } from "../text/TextBlock";
import { ButtonComponent, ButtonTemplate } from "./Button";

@Component({
  selector: 'HyperlinkButton',
  standalone: true,
  imports: [CommonModule, TextBlockComponent],
  template: ButtonTemplate,
  styleUrl: 'Button.scss',
  host: {
    'class': 'HyperlinkButtonStyle'
  }
})
export class HyperlinkButtonComponent extends ButtonComponent {

  @Input() NavigateUri?: string;

  protected override onClick(event: Event): void {
    super.onClick(event);

    if (this.IsEnabled &&this.NavigateUri) {
      window.open(this.NavigateUri, '_blank', 'noopener,noreferrer');
    }
  }
}