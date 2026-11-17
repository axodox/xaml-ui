import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";

@Component({
  selector: 'CheckBox',
  template: `<label class="container">
    <input type="checkbox" [attr.name]="Name" [checked]="IsChecked" (change)="onChange($event)" [disabled]="!IsEnabled">
    <div class="checkBox">
      <div class="checkMark">&#xE73E;</div>
    </div>
    <div class="content">
      <ng-content/>
    </div>
  </label>`,
  styleUrl: 'CheckBox.scss'
})
export class CheckBoxComponent extends BorderComponent {
  @Input() IsEnabled = true;
  @Input() IsChecked = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  protected onChange(event: Event) {
    this.IsChecked = ((event.target) as HTMLInputElement).checked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}