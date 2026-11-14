import { Component, HostBinding } from "@angular/core";
import { RadioButtonComponent } from "./RadioButton";

@Component({
  selector: 'RadioToggleButton',
  template: `<label>
    <input type="radio" [attr.tabindex]="IsTabStop ? null : -1" [attr.aria-label]="AutomationName" [name]="Group" [value]="Value" [checked]="IsChecked" (change)="onChange($event)" [disabled]="!IsEnabled">
    <ng-content/>
  </label>`,
  styleUrls: ['Button.scss', 'RadioToggleButton.scss']
})
export class RadioToggleButtonComponent extends RadioButtonComponent {
  @HostBinding('class.checked')
  protected get checked() {
    return this.IsChecked;
  }
}