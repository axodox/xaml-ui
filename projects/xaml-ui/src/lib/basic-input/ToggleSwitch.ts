import { Component } from "@angular/core";
import { CheckBoxComponent } from "./CheckBox";

@Component({
  selector: 'ToggleSwitch',
  template: `<label class="container">
    <input #input type="checkbox" role="switch" [attr.tabindex]="IsTabStop ? null : -1" [attr.aria-label]="AutomationName" [checked]="IsChecked === true" (change)="onChange()" [disabled]="!IsEnabled">
    <div class="slider">
      <div class="thumb"></div>
    </div>
    <div class="content"><ng-content/></div>
  </label>`,
  styleUrl: 'ToggleSwitch.scss'
})
export class ToggleSwitchComponent extends CheckBoxComponent {
  
}