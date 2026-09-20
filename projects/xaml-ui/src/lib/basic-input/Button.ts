import { Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { HorizontalAlignment, ToAlignment, ToJustification, VerticalAlignment } from "../Common";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { CommonModule } from "@angular/common";
import { TextBlockComponent } from "../text/TextBlock";

export const ButtonTemplate = `<TextBlock *ngIf="Content !== undefined" [Text]="Content"/>
  <ng-content/>`;

@Component({
  selector: 'Button',
  imports: [CommonModule, TextBlockComponent],
  template: ButtonTemplate,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent {
  @Input() IsEnabled: boolean = true;
  @Input() Content?: string;

  @Output() Click = new EventEmitter();

  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  @HostBinding('style.align-content')
  private get alignContent() {
    return ToAlignment(this.VerticalContentAlignment);
  }

  @HostBinding('style.justify-content')
  private get justifyContent() {
    return ToJustification(this.HorizontalContentAlignment);
  }

  @HostBinding('attr.type')
  private readonly type = 'button';
  
  @HostBinding('class.pressed')
  protected isPressed = false;

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent) {
    if (this.IsEnabled && event.button === 0) this.isPressed = true;
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  @HostListener('pointerleave', ['$event'])
  protected onPointerUp(event: PointerEvent) {
    this.isPressed = false;
  }

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
  protected onClick(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit(event);
    this._flyout?.Show();
  }
}