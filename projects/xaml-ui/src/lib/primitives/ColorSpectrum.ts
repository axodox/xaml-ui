import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { Color, ColorHsva, ColorRgba } from "../Color";

@Component({
  selector: 'ColorSpectrum',
  template: `<div #ring class="ring" [style.width]="ringSize" [style.height]="ringSize"
    (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)">
    <div class="checkerboard" [style.inset.px]="selectorInset"></div>
    <div class="wheel" [style.inset.px]="selectorInset"
      [style.opacity]="Alpha" [style.filter]="'brightness(' + Brightness + ')'"></div>
    <div #selector class="selector"></div>
  </div>`,
  styleUrl: 'ColorSpectrum.scss'
})
export class ColorSpectrumComponent extends FrameworkElementComponent implements AfterViewInit {

  private _color = new ColorHsva(0, 0, 1, 1);

  //The selected color in HSV color space, full precision floating point.
  get HsvColor(): ColorHsva {
    return this._color.Clone();
  }
  set HsvColor(value: ColorHsva) {
    if (ColorHsva.AreNearEqual(value, this._color)) return;

    let previousColor = this.Color;
    //Cloned in both directions, so a caller cannot reach in and change the stored
    //color afterwards without coming back through here.
    this._color = value.Clone();
    this.updateSelectorPosition();
    this.HsvColorChange.emit(this.HsvColor);

    //Color moves less often than HsvColor, because many HSVA states share one
    //Color: at zero brightness every hue is black, so a drag there moves the
    //selector and reports HsvColor, but leaves Color exactly where it was.
    let color = this.Color;
    if (color === previousColor) return;
    this.ColorChange.emit(color);
  }

  @Output() HsvColorChange = new EventEmitter<ColorHsva>();

  //The selected color as 0xAARRGGBB, brightness and alpha included.
  get Color(): Color {
    return this._color.ToRgba().ToNumber();
  }
  @Input() set Color(value: Color) {
    if (value === this.Color) return;
    this.HsvColor = ColorRgba.FromNumber(value).ToHsva();
  }

  @Output() ColorChange = new EventEmitter<Color>();

  //The value channel, 0..1. Dims the wheel, and darkens Color with it.
  get Brightness() {
    return this._color.V;
  }
  @Input() set Brightness(value: number) {
    let color = this.HsvColor;
    color.V = value;
    this.HsvColor = color;
  }

  //The alpha channel, 0..1. Fades the wheel over the checkerboard, and Color with it.
  get Alpha() {
    return this._color.A;
  }
  @Input() set Alpha(value: number) {
    let color = this.HsvColor;
    color.A = value;
    this.HsvColor = color;
  }

  @ViewChild('ring')
  private _ring!: ElementRef<HTMLDivElement>;

  @ViewChild('selector')
  private _selector!: ElementRef<HTMLDivElement>;

  //The wheel is inset from the control's edge by this many px. The whole square
  //is clickable (clicks outside the wheel clamp to the rim) and the inset gives
  //the selector room so it never spills outside the host's overflow:hidden.
  static _selectorInset = 8;

  protected get selectorInset() { return ColorSpectrumComponent._selectorInset; }

  protected get ringSize() { return this.Width ?? this.Height ?? '300px'; }

  private get center() { return this._ring.nativeElement.clientWidth / 2; }
  private get radius() { return this.center - ColorSpectrumComponent._selectorInset; }

  ngAfterViewInit(): void {
    this.updateSelectorPosition();
  }

  protected onPointerDown(event: PointerEvent) {
    if (event.button !== 0) return; //left button only
    this._ring.nativeElement.setPointerCapture(event.pointerId);
    this.onPointerMove(event);
  }

  protected onPointerMove(event: PointerEvent) {
    if (!this._ring.nativeElement.hasPointerCapture(event.pointerId)) return;

    let center = this.center;
    let x = event.offsetX - center;
    let y = event.offsetY - center;

    let color = this.HsvColor;
    color.H = (Math.atan2(y, x) / (2 * Math.PI) + 1) % 1;
    color.S = Math.min(Math.sqrt(x * x + y * y) / this.radius, 1);
    this.HsvColor = color;
  }

  private updateSelectorPosition() {
    if (!this._ring) return;

    let center = this.center;
    let angle = this._color.H * 2 * Math.PI;
    let length = this._color.S * this.radius;

    this._selector.nativeElement.style.left = center + Math.cos(angle) * length + 'px';
    this._selector.nativeElement.style.top = center + Math.sin(angle) * length + 'px';
  }
}
