import { Component, Input, HostBinding } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

/**
 * Shows how far an operation has got, on a thin track (WinUI's `ProgressBar`), or that it is running when that is not
 * known (`IsIndeterminate`). `ShowPaused` and `ShowError` colour it with the caution and the critical colour. It has
 * the `progressbar` role, with its range and value while determinate.
 */
@Component({
  selector: 'ProgressBar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="track"></div><div class="indicator" [ngStyle]="indicatorStyle"></div>`,
  styleUrls: ['ProgressBar.scss'],
  host: { 'role': 'progressbar' }
})
export class ProgressBarComponent extends FrameworkElementComponent {
  @Input() Minimum: number = 0;
  @Input() Maximum: number = 1;
  @Input() Value: number = 0;
  @HostBinding('class.indeterminate') @Input() IsIndeterminate: boolean = false;
  @HostBinding('class.paused') @Input() ShowPaused: boolean = false;
  @HostBinding('class.error') @Input() ShowError: boolean = false;

  @HostBinding('attr.aria-valuemin')
  protected get ariaValueMin() {
    return this.IsIndeterminate ? null : this.Minimum;
  }

  @HostBinding('attr.aria-valuemax')
  protected get ariaValueMax() {
    return this.IsIndeterminate ? null : this.Maximum;
  }

  @HostBinding('attr.aria-valuenow')
  protected get ariaValueNow() {
    return this.IsIndeterminate ? null : Math.min(Math.max(this.Value, this.Minimum), this.Maximum);
  }

  @HostBinding('attr.aria-busy')
  protected get ariaBusy() {
    return this.IsIndeterminate ? 'true' : null;
  }

  get indicatorStyle() {
    if (this.IsIndeterminate) {
      return {};
    }
    else {
      let range = this.Maximum - this.Minimum;
      let progress = range > 0 ? (this.Value - this.Minimum) / range : 0;
      return {
        width: Math.min(Math.max(progress, 0), 1) * 100 + '%'
      };
    }
  }
}
