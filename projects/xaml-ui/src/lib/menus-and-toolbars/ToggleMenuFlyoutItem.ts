import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { MenuFlyoutItemAcceleratorTemplate, MenuFlyoutItemComponent } from "./MenuFlyoutItem";

/** A menu item that turns an option on or off; a check mark shows that it is on. */
@Component({
  selector: 'ToggleMenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon" aria-hidden="true" [class.hidden]="!IsChecked"></div>
  <div class="text">{{Text}}</div>
  ${MenuFlyoutItemAcceleratorTemplate}
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class ToggleMenuFlyoutItemComponent extends MenuFlyoutItemComponent {
  private _isChecked = false;
  get IsChecked() {
    return this._isChecked;
  }
  @Input() set IsChecked(value: boolean) {
    if (value === this._isChecked) return;

    this._isChecked = value;
    this.IsCheckedChange.emit(value);
  }
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  @HostBinding('class.checked')
  private get checked() {
    return this.IsChecked;
  }

  @HostBinding('attr.aria-checked')
  private get ariaChecked() {
    return this.IsChecked;
  }

  protected override get role() {
    return 'menuitemcheckbox';
  }

  //A click, Enter or Space toggles it; then the menu closes
  protected override onClick() {
    if (!this.IsEnabled) return;

    this.IsChecked = !this.IsChecked;
    this.Click.emit();
  }
}
