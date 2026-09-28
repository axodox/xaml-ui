import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from "@angular/core";
import { Orientation } from "../Common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'ScrollBar',
  imports: [CommonModule],
  template: `<div class="buttons" (pointerdown)="onButtonDown($event, false)" (pointerup)="onButtonUp($event)">{{decreaseGlyph}}</div>
    <div #track class="track" (pointerdown)="onTrackDown($event)" (pointerup)="onTrackUp($event)">
      <div #thumb class="thumb" [ngStyle]="thumbStyle" (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)" (pointerup)="onPointerUp($event)"></div>
    </div>
    <div class="buttons" (pointerdown)="onButtonDown($event, true)" (pointerup)="onButtonUp($event)">{{increaseGlyph}}</div>`,
  styleUrl: 'ScrollBar.scss'
})
export class ScrollBarComponent extends FrameworkElementComponent {  
  @Input() Orientation: Orientation = 'Vertical';

  @Input() ViewportSize: number = 0;
  @Input() ScrollSize: number = 0;
  @Input() StepSize: number = 5;

  private _value = 0;
  get Value() {
    return this._value;
  };
  @Input() set Value(value: number) {
    let scrollRange = this.ScrollSize - this.ViewportSize;

    if (value > scrollRange) value = scrollRange;
    if (value < 0) value = 0;

    this._value = value;
    this.ValueChange.emit(value);
  }
  @Output() ValueChange = new EventEmitter<number>();

  @Input() IsEnabled = true;

  @ViewChild('track')
  private _track!: ElementRef<HTMLDivElement>;

  @ViewChild('thumb')
  private _thumb!: ElementRef<HTMLDivElement>;

  private _isScrolling = false;
  private _startPointerPosition = 0;
  private _startScrollPosition = 0;

  protected get decreaseGlyph() {
    return this.Orientation === 'Vertical' ? '\ueddb' : '\uedd9';
  }

  protected get increaseGlyph() {
    return this.Orientation === 'Vertical' ? '\ueddc' : '\uedda';
  }

  @HostBinding('class')
  private get class() {
    return this.Orientation.toLowerCase();
  }

  private getElementSize(element: HTMLElement) {
    return this.Orientation === 'Vertical' ? element.offsetHeight : element.offsetWidth;
  }

  private getPointerPosition(event: PointerEvent) {
    return this.Orientation === 'Vertical' ? event.clientY : event.clientX;
  }
  
  protected get thumbStyle() {
    let scrollRange = this.ScrollSize - this.ViewportSize;
    let size = this.ScrollSize > 0 ? Math.min(this.ViewportSize / this.ScrollSize, 1) : 1;
    let position = scrollRange > 0 ? Math.min(Math.max(this.Value / scrollRange, 0), 1) : 0;

    return {
      '--thumb-size': size * 100 + '%',
      '--thumb-position': position
    };
  }

  private _interval?: any;

  protected onButtonDown(event: PointerEvent, direction: boolean) {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    this._interval = setInterval(() => {
      this.Value += direction ? this.StepSize : -this.StepSize;
    }, 50);
  }

  protected onButtonUp(event: PointerEvent) {
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);

    clearInterval(this._interval);
  }

  protected onTrackDown(event: PointerEvent) {
    let direction: boolean | undefined;

    if (this.Orientation === 'Vertical') {
      if (event.offsetY < this._thumb.nativeElement.offsetTop) {
        direction = false;
      }

      if (this._thumb.nativeElement.offsetTop + this._thumb.nativeElement.offsetHeight < event.offsetY) {
        direction = true;
      }
    }
    else {
      if (event.offsetX < this._thumb.nativeElement.offsetLeft) {
        direction = false;
      }

      if (this._thumb.nativeElement.offsetLeft + this._thumb.nativeElement.offsetWidth < event.offsetX) {
        direction = true;
      }
    }

    if (direction === undefined) return;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    this.Value += direction ? this.ViewportSize : -this.ViewportSize;
    this._interval = setInterval(() => {
      this.Value += direction ? this.ViewportSize : -this.ViewportSize;
    }, 250);
  }

  protected onTrackUp(event: PointerEvent) {
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);

    clearInterval(this._interval);
  }

  protected onPointerDown(event: PointerEvent) {
    if (event.buttons !== 1) return;

    this._thumb.nativeElement.setPointerCapture(event.pointerId);
    this._isScrolling = true;
    this._startPointerPosition = this.getPointerPosition(event);
    this._startScrollPosition = this.Value;
    event.stopPropagation();
  }

  protected onPointerMove(event: PointerEvent) {
    if (!this._isScrolling) return;
    if (event.buttons !== 1) {
      this._isScrolling = false;
      return;
    }

    let delta = this.getPointerPosition(event) - this._startPointerPosition;
    let trackLength = this.getElementSize(this._track.nativeElement);
    let thumbLength = this.getElementSize(this._thumb.nativeElement);

    let scrollPercent = delta / (trackLength - thumbLength);
    this.Value = this._startScrollPosition + scrollPercent * (this.ScrollSize - this.ViewportSize);
    event.stopPropagation();
  }

  protected onPointerUp(event: PointerEvent) {
    if (event.buttons !== 1) return;

    this._isScrolling = false;
    this._thumb.nativeElement.releasePointerCapture(event.pointerId);
    event.stopPropagation();
  }
}