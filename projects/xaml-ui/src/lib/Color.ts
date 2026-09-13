export type Color = number;
export function colorToString(value: Color): string {
  return '#' + value.toString(16).padStart(8, '0');
}

export function stringToColor(value: string): Color {
  return parseInt(value.replace('#', ''), 16);
}

export type ColorRGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type ColorHSLA = {
  h: number;
  s: number;
  l: number;
  a: number;
};

export function colorToRgb(value: Color): ColorRGBA {
  return {
    r: value >> 16 & 0xff,
    g: value >> 8 & 0xff,
    b: value & 0xff,
    a: value >> 24 & 0xff
  };
}

export function rgbToHsl(rgb: ColorRGBA): ColorHSLA {
  const { r: r255, g: g255, b: b255, a: a255 } = rgb;

  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;
  const a = a255 / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    //Achromatic
    return { h: 0, s: 0, l: l * 100, a: a * 100 };
  }

  const d = max - min;
  s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
  switch (max) {
    case r:
      h = ((g - b) / d + 0) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    case b:
      h = ((r - g) / d + 4) * 60;
      break;
  }

  return { h, s: s * 100, l: l * 100, a: a * 100 };
}