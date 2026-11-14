import { Component, Input, HostBinding } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

/**
 * Shows that an operation is running (`IsIndeterminate`: a spinning arc), or how far it has got: an arc over a track
 * ring (`Background`, by default a subtle stroke colour; WinUI's `ProgressRing.Background`). Its size follows `Width`
 * and `Height` (40px by default). It has the `progressbar` role, with its range and value while determinate.
 */
@Component({
  selector: 'ProgressRing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="progress-ring-svg" [attr.viewBox]="'0 0 ' + _size + ' ' + _size" [style.width]="Width" [style.height]="Height" aria-hidden="true">
      <circle class="progress-ring-track"
        [attr.cx]="_size/2"
        [attr.cy]="_size/2"
        [attr.r]="_radius"
        fill="none"
        [style.stroke]="IsIndeterminate ? null : Background"
        [attr.stroke-width]="_strokeWidth"
      />
      <circle class="progress-ring-indicator"
        [attr.cx]="_size/2"
        [attr.cy]="_size/2"
        [attr.r]="_radius"
        fill="none"
        [attr.stroke-width]="_strokeWidth"
        [attr.stroke-dasharray]="_circumference"
        [attr.stroke-dashoffset]="IsIndeterminate ? null : dashOffset"
      />
    </svg>
  `,
  styleUrls: ['ProgressRing.scss'],
  host: { 'role': 'progressbar' }
})
export class ProgressRingComponent extends FrameworkElementComponent {
  @Input() Minimum: number = 0;
  @Input() Maximum: number = 1;
  @Input() Value: number = 0;
  @Input() IsIndeterminate: boolean = false;

  /** The colour of the track ring under the arc. */
  @Input() Background?: string;

  @HostBinding('class.indeterminate')
  get indeterminateClass() {
    return this.IsIndeterminate;
  }

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

  protected readonly _size = 40;
  protected readonly _radius = 16;
  protected readonly _strokeWidth = 4;
  protected readonly _circumference = 2 * Math.PI * this._radius;

  constructor() {
    super();
    this.Width = this._size + 'px';
    this.Height = this._size + 'px';
  }

  get dashOffset() {
    let range = this.Maximum - this.Minimum;
    let progress = range > 0 ? Math.min(Math.max((this.Value - this.Minimum) / range, 0), 1) : 0;
    return this._circumference * (1 - progress);
  }
}
