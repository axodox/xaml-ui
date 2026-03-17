import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { ButtonComponent, ButtonTemplate } from "./Button";

@Component({
  selector: 'ToggleButton',
  template: ButtonTemplate,
  styleUrl: 'Button.scss'
})
export class ToggleButtonComponent extends ButtonComponent {
  @Input() @HostBinding('class.checked') IsChecked: boolean = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  protected override onClick(event: Event): void {
    super.onClick(event);

    if (!this.IsEnabled) return;
    this.IsChecked = !this.IsChecked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}