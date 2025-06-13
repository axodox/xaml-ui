import { Component, ContentChild, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";

@Component({
  selector: 'AppBarButton',
  template: `<div [style.color]="Foreground" class="icon">{{Icon}}</div><div class="text">{{Text}}</div><ng-content/>`,
  styleUrl: 'AppBarButton.scss'
})
export class AppBarButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled = true;
  @Input() Text?: string;
  @Input() Icon?: string;
  @Input() Foreground?: string;
  @Output() Click = new EventEmitter();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @ContentChild('xaml-flyout')
  private _flyout?: FlyoutBaseComponent;

  @HostListener('click', ['$event'])
  protected onHostPointerEvent(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit(event);
    this._flyout?.Show();
  }
}