import { Component } from "@angular/core";
import { CheckBoxComponent } from "./CheckBox";

@Component({
  selector: 'ToggleSwitch',
  template: `<label class="container">
    <input type="checkbox" [attr.name]="Name" [checked]="IsChecked" (change)="onChange($event)" [disabled]="!IsEnabled">
    <div class="slider">
      <div class="thumb"></div>
    </div>
    <div class="content"><ng-content/></div>
  </label>`,
  styleUrl: 'ToggleSwitch.scss'
})
export class ToggleSwitchComponent extends CheckBoxComponent {
  
}