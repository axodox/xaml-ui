import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { Color, ColorHsva, ColorRgba } from "../Color";
import { ColorSpectrumComponent } from "../primitives/ColorSpectrum";
import { SliderComponent } from "./Slider";

//A ColorSpectrum with sliders for the two channels the wheel itself cannot show
//a position for. The spectrum holds the color; this decides which channels the
//user can reach and publishes the result.
@Component({
  selector: 'ColorPicker',
  imports: [CommonModule, ColorSpectrumComponent, SliderComponent],
  template: `<ColorSpectrum #spectrum [Width]="Width" [Height]="Height"
    [(Color)]="Color"/>
  <Slider *ngIf="IsBrightnessEnabled" class="channel-slider brightness"
    [Minimum]="0" [Maximum]="1" [(Value)]="spectrum.Brightness"/>
  <Slider *ngIf="IsAlphaEnabled" class="channel-slider alpha"
    [Minimum]="0" [Maximum]="1" [(Value)]="spectrum.Alpha"/>`,
  styleUrl: 'ColorPicker.scss'
})
export class ColorPickerComponent extends FrameworkElementComponent implements AfterViewInit {

  @Input() IsAlphaEnabled: boolean = false;
  @Input() IsBrightnessEnabled: boolean = false;

  protected _color: Color = 0xffffffff;

  get Color(): Color {
    return this._color;
  }
  @Input() set Color(value: Color) {
    if (value === this.Color) return;

    this._color = value;
    this.updateChannelColors();

    this.ColorChange.emit(this.Color);
  }

  @Output() ColorChange = new EventEmitter<Color>();

  constructor(private _host: ElementRef<HTMLElement>) {
    super();
  }

  ngAfterViewInit(): void {
    //Seed the slider track gradients; nothing has changed yet to trigger an update.
    this.updateChannelColors();
  }

  //Publish the selected hue and saturation, at full brightness and at the
  //current one, as CSS custom properties for the slider track gradients.
  private updateChannelColors() {
    let hsva = ColorRgba.FromNumber(this._color).ToHsva();
    let full = new ColorHsva(hsva.H, hsva.S, 1, 1).ToRgba();
    let opaque = new ColorHsva(hsva.H, hsva.S, hsva.V, 1).ToRgba();
    this._host.nativeElement.style.setProperty('--full-color', full.ToString());
    this._host.nativeElement.style.setProperty('--opaque-color', opaque.ToString());
  }
}
