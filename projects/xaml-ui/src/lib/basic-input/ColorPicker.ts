import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { Color, colorToRgb, rgbToHsl } from "../Color";
import { SliderComponent } from "./Slider";

type Rgb = { r: number, g: number, b: number };

@Component({
  selector: 'ColorPicker',
  imports: [CommonModule, SliderComponent],
  template: `<div #ring class="ring" (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)">
    <canvas #canvas></canvas>
    <div #selector class="selector"></div>
  </div>
  <Slider *ngIf="IsBrightnessEnabled" class="channel-slider brightness"
    [Minimum]="0" [Maximum]="1" [Value]="_brightness" (ValueChange)="onBrightnessChange($event)" />
  <Slider *ngIf="IsAlphaEnabled" class="channel-slider alpha"
    [Minimum]="0" [Maximum]="255" [StepFrequency]="1" [Value]="_alpha" (ValueChange)="onAlphaChange($event)" />`,
  styleUrl: 'ColorPicker.scss'
})
export class ColorPickerComponent extends FrameworkElementComponent implements AfterViewInit {

  @Input() IsAlphaEnabled: boolean = false;
  @Input() IsBrightnessEnabled: boolean = false;

  // Canonical state: the ring's hue+saturation at full brightness, plus the
  // brightness (0..1) and alpha (0..255) channels. The emitted Color combines
  // them as 0xAARRGGBB (alpha byte, RGB = ring color scaled by brightness).
  private _wheelRgb: Rgb = { r: 255, g: 255, b: 255 };
  protected _brightness: number = 1;
  protected _alpha: number = 255;

  private _color: Color = 0xffffffff;
  get Color() {
    return this._color;
  }
  @Input() set Color(value: Color) {
    // Ignore the echo from the two-way [(Color)] binding: when we emit a color,
    // it flows back into this setter. Re-decomposing our own (lossy 8-bit) output
    // would clobber the canonical _wheelRgb/_brightness state and lose hue and
    // saturation at low brightness. Only decompose genuinely external values.
    if (value === this._color) return;
    this.applyColor(value);
  }

  @Output() ColorChange = new EventEmitter<Color>();

  @ViewChild('ring')
  private _ring!: ElementRef<HTMLDivElement>;

  @ViewChild('canvas')
  private _canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('selector')
  private _selector!: ElementRef<HTMLDivElement>;

  private _context!: CanvasRenderingContext2D;

  // Pristine hue/saturation wheel, sampled when picking and used as the source
  // for the (possibly dimmed/faded) version shown on the visible canvas.
  private _wheelCanvas!: HTMLCanvasElement;
  private _wheelContext!: CanvasRenderingContext2D;
  // Scratch canvas holding the brightness-dimmed wheel before it is blitted
  // onto the visible canvas with alpha.
  private _dimCanvas!: HTMLCanvasElement;
  private _dimContext!: CanvasRenderingContext2D;

  constructor(private _host: ElementRef<HTMLElement>) {
    super();
  }

  // The wheel is drawn as a circle inset from the canvas edge by this many px.
  // The canvas itself fills the whole control and is fully clickable; the inset
  // band around the wheel is clickable too (clicks clamp to the rim) and gives
  // the selector room so it never spills outside the host's overflow:hidden.
  static _selectorInset = 8;

  // Canvas centre and wheel radius, derived from the (full-size) canvas.
  private get center() { return this._canvas.nativeElement.width / 2; }
  private get radius() { return this.center - ColorPickerComponent._selectorInset; }

  ngAfterViewInit(): void {
    let canvas = this._canvas.nativeElement;
    let width = canvas.width = parseInt(this.Width ?? '300');
    let height = canvas.height = parseInt(this.Height ?? '300');
    this._context = canvas.getContext('2d')!;

    // Build the pristine wheel on an offscreen canvas we can sample from.
    this._wheelCanvas = document.createElement('canvas');
    this._wheelCanvas.width = width;
    this._wheelCanvas.height = height;
    let wheel = this._wheelContext = this._wheelCanvas.getContext('2d', { willReadFrequently: true })!;
    let center = this.center;
    let radius = this.radius;

    // Confine every wheel paint to the inset circle; the surrounding band stays
    // transparent so the corners and rim margin are clear (no CSS clip needed).
    wheel.save();
    wheel.beginPath();
    wheel.arc(center, center, radius, 0, 2 * Math.PI);
    wheel.clip();

    // Draw hue circle
    for (let angle = 0; angle < 360; angle++) {
      let startAngle = (angle - 1) * (Math.PI / 180);
      let endAngle = (angle + 1) * (Math.PI / 180);
      wheel.beginPath();
      wheel.moveTo(center, center);
      wheel.arc(center, center, radius * 2, startAngle, endAngle);
      wheel.closePath();
      wheel.fillStyle = `hsl(${angle}, 100%, 50%)`;
      wheel.fill();
    }

    // Add radial gradient for saturation. The small fully-opaque white plateau
    // at the core guarantees the exact center samples as pure white (#ffffff)
    // instead of bleeding a sliver of the hue arcs that converge there.
    let gradient = wheel.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.03, 'white');
    gradient.addColorStop(1, 'transparent');
    wheel.fillStyle = gradient;
    wheel.fillRect(0, 0, width, height);

    wheel.restore();

    this._dimCanvas = document.createElement('canvas');
    this._dimCanvas.width = width;
    this._dimCanvas.height = height;
    this._dimContext = this._dimCanvas.getContext('2d')!;

    this.update();
    this.updateSelectorPosition();
  }

  protected onPointerDown(event: PointerEvent) {
    if (event.button !== 0) return; // left button only
    // Capture on the (unclipped, full-square) ring rather than the canvas: the
    // canvas' clip-path:circle() also clips hit-testing, so presses just outside
    // the circle never reach it. The ring receives them and we clamp to the rim.
    this._ring.nativeElement.setPointerCapture(event.pointerId);
    this.onPointerMove(event);
  }

  protected onPointerMove(event: PointerEvent) {
    if (!this._ring.nativeElement.hasPointerCapture(event.pointerId)) return;
    let width = this._canvas.nativeElement.width;
    let center = this.center;
    let radius = this.radius;
    let rawX = event.offsetX - center;
    let rawY = event.offsetY - center;
    let length = Math.sqrt(rawX * rawX + rawY * rawY);
    // Clamp anything outside the wheel (incl. the inset band and corners) to the rim.
    let scale = length < radius ? 1 : radius / length;
    let sampleX = center + rawX * scale;
    let sampleY = center + rawY * scale;

    this._selector.nativeElement.style.left = sampleX + 'px';
    this._selector.nativeElement.style.top = sampleY + 'px';

    // Sample the pristine (full-brightness) wheel; brightness/alpha are kept.
    // Read a hair inside the rim so a clamped edge pick doesn't land on the
    // antialiased clip boundary (transparent there → would read as black).
    let readScale = length < radius - 1 ? 1 : (radius - 1) / length;
    let readX = Math.min(Math.max(Math.round(center + rawX * readScale), 0), width - 1);
    let readY = Math.min(Math.max(Math.round(center + rawY * readScale), 0), width - 1);
    let [r, g, b] = this._wheelContext.getImageData(readX, readY, 1, 1).data;
    this._wheelRgb = { r, g, b };
    if (!this.IsBrightnessEnabled) this._brightness = 1;
    if (!this.IsAlphaEnabled) this._alpha = 255;
    this.update();
  }

  protected onBrightnessChange(value: number) {
    this._brightness = value;
    this.update();
  }

  protected onAlphaChange(value: number) {
    this._alpha = value;
    this.update();
  }

  // Decompose an incoming 0xAARRGGBB into ring color + brightness + alpha.
  private applyColor(value: Color) {
    let { r, g, b, a } = colorToRgb(value);
    this._alpha = a;

    if (this.IsBrightnessEnabled) {
      let brightness = Math.max(r, g, b) / 255;
      this._brightness = brightness;
      // Recover the full-brightness ring color; keep the previous hue when black.
      if (brightness > 0) this._wheelRgb = { r: r / brightness, g: g / brightness, b: b / brightness };
    } else {
      this._brightness = 1;
      this._wheelRgb = { r, g, b };
    }

    this.update();
    // Externally-set colors need the selector repositioned to match; interactive
    // picks position it directly from the pointer (see onPointerMove), so update()
    // itself deliberately leaves the selector alone.
    this.updateSelectorPosition();
  }

  // Recompose the canonical state into 0xAARRGGBB.
  private compose(): Color {
    let scale = (channel: number) => Math.min(255, Math.max(0, Math.round(channel * this._brightness)));
    let r = scale(this._wheelRgb.r);
    let g = scale(this._wheelRgb.g);
    let b = scale(this._wheelRgb.b);
    let a = Math.min(255, Math.max(0, Math.round(this._alpha)));
    return ((a << 24) + (r << 16) + (g << 8) + b) >>> 0;
  }

  // Recompose, refresh the visuals, and emit if the color actually changed.
  private update() {
    this.updateChannelColors();
    this.redraw();

    let color = this.compose();
    if (color === this._color) return;
    this._color = color;
    this.ColorChange.emit(color);
  }

  // Publish the ring color (full brightness and brightness-applied) as CSS
  // custom properties so the slider track gradients can read them.
  private updateChannelColors() {
    let round = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
    let full = `rgb(${round(this._wheelRgb.r)}, ${round(this._wheelRgb.g)}, ${round(this._wheelRgb.b)})`;
    let opaque = `rgb(${round(this._wheelRgb.r * this._brightness)}, ${round(this._wheelRgb.g * this._brightness)}, ${round(this._wheelRgb.b * this._brightness)})`;
    this._host.nativeElement.style.setProperty('--full-color', full);
    this._host.nativeElement.style.setProperty('--opaque-color', opaque);
  }

  // Render the ring dimmed by brightness and faded by alpha over a checkerboard,
  // so the exact selected color is visible. With brightness 1 and alpha 255 this
  // is pixel-identical to the pristine wheel.
  private redraw() {
    if (!this._context) return;

    let width = this._canvas.nativeElement.width;
    let height = this._canvas.nativeElement.height;

    let dim = this._dimContext;
    dim.globalCompositeOperation = 'source-over';
    dim.clearRect(0, 0, width, height);
    dim.drawImage(this._wheelCanvas, 0, 0);
    if (this._brightness < 1) {
      // Darken only where the wheel is painted so the transparent surround stays clear.
      dim.globalCompositeOperation = 'source-atop';
      dim.fillStyle = `rgba(0, 0, 0, ${1 - this._brightness})`;
      dim.fillRect(0, 0, width, height);
      dim.globalCompositeOperation = 'source-over';
    }

    let context = this._context;
    context.clearRect(0, 0, width, height);
    // Keep the checkerboard (and faded wheel) inside the wheel circle.
    context.save();
    context.beginPath();
    context.arc(this.center, this.center, this.radius, 0, 2 * Math.PI);
    context.clip();
    let alpha = this._alpha / 255;
    if (alpha < 1) this.drawCheckerboard(context, width, height);
    context.globalAlpha = alpha;
    context.drawImage(this._dimCanvas, 0, 0);
    context.globalAlpha = 1;
    context.restore();
  }

  private drawCheckerboard(context: CanvasRenderingContext2D, width: number, height: number) {
    const size = 8;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#cccccc';
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        if (((x / size) + (y / size)) % 2 === 0) context.fillRect(x, y, size, size);
      }
    }
  }

  private updateSelectorPosition() {
    if (!this._canvas) return;

    let hsl = rgbToHsl({ ...this._wheelRgb, a: 255 });

    let center = this.center;
    let angle = hsl.h / 180 * Math.PI;
    let length = hsl.s / 100 * this.radius;
    let x = center + Math.cos(angle) * length;
    let y = center + Math.sin(angle) * length;
    this._selector.nativeElement.style.left = x + 'px';
    this._selector.nativeElement.style.top = y + 'px';
  }
}
