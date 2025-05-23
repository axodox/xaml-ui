import { Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { HorizontalAlignment, toAlignment, toJustification, VerticalAlignment } from "../Common";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";

@Component({
  selector: 'Button',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent {
  @Input() IsEnabled: boolean = true;

  @Output() Click = new EventEmitter();

  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  @HostBinding('style.align-content')
  private get alignContent() {
    return toAlignment(this.VerticalContentAlignment);
  }

  @HostBinding('style.justify-content')
  private get justifyContent() {
    return toJustification(this.HorizontalContentAlignment);
  }

  @HostBinding('attr.type')
  private readonly type = 'button';

  @HostBinding('attr.disabled')
  @HostBinding('class.disabled')
  private get disabled() {
    return this.IsEnabled ? undefined : true;
  }

  @HostBinding('class.flyout-open')
  private get flyoutOpen() {
    return this._flyout?.IsOpen;
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