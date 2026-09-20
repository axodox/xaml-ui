import { AreNearEqual } from "./Math";

export type Color = number;

//A Color as #aarrggbb. Unsigned first, or a colour with the top alpha bit set
//would format as its negative.
export function FormatColor(value: Color): string {
  return '#' + (value >>> 0).toString(16).padStart(8, '0');
}

export function ParseColor(value: string): Color {
  return parseInt(value.replace('#', ''), 16) >>> 0;
}

//Half a step of the 8 bit form every color ends up in: two colors closer than
//this round to the same bytes and so cannot be told apart once rendered.
const ColorTolerance = 0.5;
const HueTolerance = ColorTolerance / 255;

//Hue is an angle, so 0.999 and 0.001 are all but the same place on the wheel.
function AreHueNearEqual(a: number, b: number): boolean {
  let difference = Math.abs(a - b) % 1;
  return Math.min(difference, 1 - difference) < HueTolerance;
}

//Color with 0..255 channels, the unpacked form of a 0xAARRGGBB Color.
export class ColorRgba {
  constructor(
    public R: number,
    public G: number,
    public B: number,
    public A: number
  ) { }

  ToNumber(): Color {
    //Unsigned: a top bit set in the alpha byte would otherwise make this negative.
    return ((this.A << 24) | (this.R << 16) | (this.G << 8) | this.B) >>> 0;
  }

  static FromNumber(value: Color): ColorRgba {
    let a = (value >> 24) & 0xff;
    let r = (value >> 16) & 0xff;
    let g = (value >> 8) & 0xff;
    let b = value & 0xff;
    return new ColorRgba(r, g, b, a);
  }

  Clone(): ColorRgba {
    return new ColorRgba(this.R, this.G, this.B, this.A);
  }

  static AreNearEqual(a: ColorRgba, b: ColorRgba): boolean {
    return AreNearEqual(a.R, b.R, ColorTolerance)
      && AreNearEqual(a.G, b.G, ColorTolerance)
      && AreNearEqual(a.B, b.B, ColorTolerance)
      && AreNearEqual(a.A, b.A, ColorTolerance);
  }

  ToHsla(): ColorHsla {
    return ColorHsla.FromRgba(this);
  }

  ToHsva(): ColorHsva {
    return ColorHsva.FromRgba(this);
  }

  ToString(): string {
    return `rgba(${this.R}, ${this.G}, ${this.B}, ${this.A / 255})`;
  }
}

//Color in hue/saturation/lightness form; every channel, hue included, is 0..1.
export class ColorHsla {
  constructor(
    public H: number,
    public S: number,
    public L: number,
    public A: number
  ) { }

  static FromRgba(rgba: ColorRgba): ColorHsla {
    let r = rgba.R / 255;
    let g = rgba.G / 255;
    let b = rgba.B / 255;
    let a = rgba.A / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return new ColorHsla(h, s, l, a);
  }

  ToRgba(): ColorRgba {
    let h = this.H;
    let s = this.S;
    let l = this.L;
    let a = this.A;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; //achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return new ColorRgba(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), Math.round(a * 255));
  }

  Clone(): ColorHsla {
    return new ColorHsla(this.H, this.S, this.L, this.A);
  }

  //Use this rather than ===; see ColorRgba.AreNearEqual.
  static AreNearEqual(a: ColorHsla, b: ColorHsla): boolean {
    return AreHueNearEqual(a.H, b.H)
      && AreNearEqual(a.S, b.S, HueTolerance)
      && AreNearEqual(a.L, b.L, HueTolerance)
      && AreNearEqual(a.A, b.A, HueTolerance);
  }

  ToString(): string {
    return `hsla(${this.H * 360}, ${this.S * 100}%, ${this.L * 100}%, ${this.A})`;
  }
}

//Color in hue/saturation/value form; every channel, hue included, is 0..1.
export class ColorHsva {
  constructor(
    public H: number,
    public S: number,
    public V: number,
    public A: number
  ) { }

  static FromRgba(rgba: ColorRgba): ColorHsva {
    let r = rgba.R / 255;
    let g = rgba.G / 255;
    let b = rgba.B / 255;
    let a = rgba.A / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h = 0;

    if (d !== 0) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return new ColorHsva(h, max === 0 ? 0 : d / max, max, a);
  }

  ToRgba(): ColorRgba {
    let sector = this.H * 6;
    //Wrap so a hue of exactly 1 lands back on sector 0 rather than off the end.
    let index = Math.floor(sector) % 6;
    let offset = sector - Math.floor(sector);

    let v = this.V;
    let p = v * (1 - this.S);
    let q = v * (1 - offset * this.S);
    let t = v * (1 - (1 - offset) * this.S);

    let rgb = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][index];
    return new ColorRgba(
      Math.round(rgb[0] * 255),
      Math.round(rgb[1] * 255),
      Math.round(rgb[2] * 255),
      Math.round(this.A * 255));
  }

  Clone(): ColorHsva {
    return new ColorHsva(this.H, this.S, this.V, this.A);
  }

  static AreNearEqual(a: ColorHsva, b: ColorHsva): boolean {
    return AreHueNearEqual(a.H, b.H)
      && AreNearEqual(a.S, b.S, HueTolerance)
      && AreNearEqual(a.V, b.V, HueTolerance)
      && AreNearEqual(a.A, b.A, HueTolerance);
  }

  ToString(): string {
    return this.ToRgba().ToString();
  }
}
