import { Component, HostBinding, HostListener, Input } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'HyperlinkButton',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-container>
    <ng-content *ngIf="Content === undefined"/>
    <ng-container *ngIf="Content !== undefined">{{Content}}</ng-container>
  </ng-container>`,
  styleUrl: 'HyperlinkButton.scss'
})
export class HyperlinkButtonComponent extends FrameworkElementComponent {

  @Input() NavigateUri?: string;
  @Input() Content?: string;
  @Input() IsEnabled: boolean = true;

  @HostBinding('style.cursor')
  protected get cursor() {
    return this.IsEnabled ? 'pointer' : 'default';
  }

  @HostBinding('class.disabled')
  @HostBinding('attr.disabled')
  protected get disabled() {
    return !this.IsEnabled ? true : undefined;
  }

  @HostBinding('style.pointer-events')
  protected get pointerEvents() {
    return this.IsEnabled ? 'auto' : 'none';
  }

  @HostListener('click')
  protected onClick() {
    if (this.IsEnabled && this.NavigateUri) {
      window.open(this.NavigateUri, '_blank', 'noopener,noreferrer');
    }
  }
}
