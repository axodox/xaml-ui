import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { Orientation } from "../Common";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'Slider',
  template: `<div #track [ngClass]="getClasses('track')" [ngStyle]="getStyle()">
    <div class="usable-range">
      <div #thumb [ngClass]="getClasses('thumb')">
        <div class="handle"></div>
      </div>
    </div>
  </div>`,
  imports: [CommonModule],
  styleUrl: 'Slider.scss'
})
export class SliderComponent extends FrameworkElementComponent {
  static _thumbRadius = 8;

  @Input() Minimum: number = 0.0;
  @Input() Maximum: number = 1.0;
  @Input() StepFrequency: number = 0;
  @Input() Value: number = 0.0;
  @Output() ValueChange = new EventEmitter<number>();
  @Input() IsEnabled = true;
  @Input() Orientation: Orientation = 'Horizontal';

  @ViewChild('track')
  private _track!: ElementRef<HTMLElement>;

  @ViewChild('thumb')
  private _thumb!: ElementRef<HTMLElement>;

  private _thumbPointerMoveEventSubscription?: () => void;

  constructor(private _renderer: Renderer2) {
    super();
  }

  protected getStyle() {
    let style: { [key: string]: string } = {};
    let minimum = this.Minimum ?? 0;
    let maximum = this.Maximum ?? 1;
    let range = maximum - minimum;
    let progress = range > 0 ? (this.Value - minimum) / range : 1;
    progress = Math.min(Math.max(progress, 0), 1);

    let progressText = (progress * 100).toFixed(4);
    style['--progress-size'] = progressText + (this.Orientation == 'Horizontal' ? 'cqw' : 'cqh');
    style['--progress-percent'] = progressText + '%';
    return style;
  }

  protected getClasses(value: string): string[] {
    var results = [value];
    results.push(this.Orientation.toLowerCase());
    if (this.IsEnabled !== true) results.push('disabled');
    return results;
  }


  @HostListener('pointerdown', ['$event'])
  private onThumbPointerDown(event: PointerEvent) {
    if (!this.IsEnabled) return;
    if (event.button !== 0) return; // left button only

    this._thumb.nativeElement.setPointerCapture(event.pointerId);
    this._thumbPointerMoveEventSubscription = this._renderer.listen(this._track.nativeElement, 'pointermove', p => this.onThumbPointerMove(p));

    this.onThumbPointerMove(event);
  }

  private onThumbPointerMove(event: PointerEvent) {

    let trackRectangle = this._track.nativeElement.getBoundingClientRect();

    let position: number;
    switch (this.Orientation) {
      case "Horizontal":
        position = (event.clientX - trackRectangle.left - SliderComponent._thumbRadius) / (trackRectangle.width - 2 * SliderComponent._thumbRadius);
        break;
      case "Vertical":
        position = 1 - (event.clientY - trackRectangle.top - SliderComponent._thumbRadius) / (trackRectangle.height - 2 * SliderComponent._thumbRadius);
        break;
    }

    //Apply range
    let value = position * (this.Maximum - this.Minimum) + this.Minimum;

    //Apply step frequency
    if (this.StepFrequency !== 0) value = Math.trunc(value / this.StepFrequency) * this.StepFrequency;

    //Apply min-max
    value = Math.min(this.Maximum, Math.max(this.Minimum, value));

    //Update value
    this.Value = value;
    this.ValueChange.emit(this.Value);
  }

  @HostListener('pointerup', ['$event'])
  private onThumbPointerUp(event: PointerEvent) {
    if (event.button !== 0) return; // left button only — pairs with the pointerdown guard

    this.onThumbPointerMove(event);

    this._thumb.nativeElement.releasePointerCapture(event.pointerId);
    if (this._thumbPointerMoveEventSubscription) this._thumbPointerMoveEventSubscription();
  }
}