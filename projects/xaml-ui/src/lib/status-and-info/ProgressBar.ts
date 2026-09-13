import { Component, Input, HostBinding } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'ProgressBar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="indicator" [ngStyle]="indicatorStyle"></div>`,
  styleUrls: ['ProgressBar.scss']
})
export class ProgressBarComponent extends FrameworkElementComponent {
  @Input() Minimum: number = 0;
  @Input() Maximum: number = 1;
  @Input() Value: number = 0;
  @HostBinding('class.indeterminate') @Input() IsIndeterminate: boolean = false;

  get indicatorStyle() {
    if (this.IsIndeterminate) {
      return {};
    }
    else {
      let width = ((this.Value - this.Minimum) / (this.Maximum - this.Minimum)) * 100
      return {
        width: width + '%'
      };
    }
  }
} 