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
  @Input() DisableAnimation: boolean = false;
  @HostBinding('class.indeterminate') @Input() IsIndeterminate: boolean = false;

  get indicatorStyle() {
    let indicatorStyle: any = {};
    if (!this.IsIndeterminate) {
      let width = ((this.Value - this.Minimum) / (this.Maximum - this.Minimum)) * 100
      indicatorStyle.width = width + '%';
    };
    if (this.DisableAnimation)
      indicatorStyle.transition = 'unset';

    return indicatorStyle;
  }
} 