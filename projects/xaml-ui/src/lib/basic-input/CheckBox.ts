import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { BorderComponent } from "../layout/Border";

@Component({
  selector: 'CheckBox',
  template: `<label class="container">
    <input #input type="checkbox" [attr.tabindex]="IsTabStop ? null : -1" [attr.aria-label]="AutomationName" [checked]="IsChecked === true" [indeterminate]="IsChecked === null" (change)="onChange()" [disabled]="!IsEnabled">
    <div class="checkBox" aria-hidden="true">
      <div class="checkMark"></div>
    </div>
    <div class="content">
      <ng-content/>
    </div>
  </label>`,
  styleUrl: 'CheckBox.scss'
})
export class CheckBoxComponent extends BorderComponent {
  @Input() IsEnabled = true;

  /** Whether the box is in the tab order (WinUI's `IsTabStop`); a list or tree that moves the focus itself turns it off. */
  @Input() IsTabStop = true;

  /** The accessible name of the box (WinUI's `AutomationProperties.Name`), when it has no content to name it. */
  @Input('AutomationProperties-Name') AutomationName?: string;

  /** Whether a click cycles through the indeterminate state too (unchecked, checked, indeterminate). */
  @Input() IsThreeState = false;

  private _isChecked: boolean | null = false;
  /** True when checked, false when not, null when indeterminate (shown as a dash). */
  get IsChecked(): boolean | null {
    return this._isChecked;
  }
  @Input() set IsChecked(value: boolean | null) {
    this._isChecked = value === undefined ? false : value;
  }
  /** The user toggled the box (as in 1.0.35, a binding that sets `IsChecked` raises nothing). */
  @Output() IsCheckedChange = new EventEmitter<boolean | null>();

  @ViewChild('input')
  private _input?: ElementRef<HTMLInputElement>;

  //The native input has already toggled itself; the next state follows WinUI's ToggleButton instead: checked goes
  //to indeterminate (three-state) or unchecked, unchecked to checked, and indeterminate to unchecked.
  protected onChange() {
    let next: boolean | null;
    if (this.IsChecked === true) next = this.IsThreeState ? null : false;
    else next = this.IsChecked === false;

    if (next !== this.IsChecked) {
      this.IsChecked = next;
      this.IsCheckedChange.emit(next);
    }

    //Keep the native input in line, also when the value did not change for a binding
    let input = this._input?.nativeElement;
    if (input) {
      input.checked = this.IsChecked === true;
      input.indeterminate = this.IsChecked === null;
    }
  }
}
