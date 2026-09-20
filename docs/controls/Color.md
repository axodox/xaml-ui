# Color

> Source: [Color.ts](../../projects/xaml-ui/src/lib/Color.ts)

Colour type and conversions. `Color` is the form controls publish; the three classes are the unpacked forms you convert to in order to work on individual channels.

## Color

```typescript
export type Color = number;
```

A packed `0xAARRGGBB` value — alpha, red, green, blue, one byte each. `0xffffffff` is opaque white, `0xff000000` opaque black. Always unsigned; the conversions keep it that way, so `0xff000000` does not come back as a negative number.

Being a primitive is what makes it the bindable form: `[(Color)]` compares by value, where a class-typed property would compare by reference.

| Function | Description |
|---|---|
| `FormatColor(color)` | To `#aarrggbb`. |
| `ParseColor(text)` | From `#aarrggbb` or `aarrggbb`. |

Both keep the value unsigned, so a colour with the top alpha bit set does not format as its negative.

## ColorRgba

Channels `0..255`.

| Member | Description |
|---|---|
| `new ColorRgba(r, g, b, a)` | Construct from four channels. |
| `ColorRgba.FromNumber(color)` | Unpack a `Color`. |
| `ToNumber()` | Pack back to a `Color`. |
| `ToHsla()` / `ToHsva()` | Convert to the other forms. |
| `ToString()` | CSS `rgba(r, g, b, a)`, with alpha scaled to `0..1`. |
| `Clone()` | Copy. |
| `ColorRgba.AreNearEqual(a, b)` | Value comparison — see [Comparing colours](#comparing-colours). |

## ColorHsva

Hue, saturation, value and alpha, **every channel `0..1`** — hue included, so a hue of `0.5` is 180°.

| Member | Description |
|---|---|
| `new ColorHsva(h, s, v, a)` | Construct from four channels. |
| `ColorHsva.FromRgba(rgba)` | Convert from RGBA. |
| `ToRgba()` | Convert back. |
| `ToString()` | CSS `rgba(...)` — there is no `hsva()` in CSS. |
| `Clone()` | Copy. |
| `ColorHsva.AreNearEqual(a, b)` | Value comparison, hue treated as an angle. |

`RGB → HSVA → RGB` round-trips exactly for all 16,777,216 colours, so converting to work on a channel and back does not shift the others.

## ColorHsla

Hue, saturation, lightness and alpha, every channel `0..1`. Same members as `ColorHsva`, with `L` in place of `V`, and a `ToString()` that emits CSS `hsla(h, s%, l%, a)`.

### Choosing between HSL and HSV

They are not interchangeable, and the difference is easy to miss:

- **HSV** is the model of a colour wheel — white at the centre, full hue at the rim, value as a separate dimming channel. Saturation there is the distance from the centre. Use `ColorHsva` for anything positional.
- **HSL** is the model CSS speaks (`hsl()`), with lightness running black → colour → white.

A colour blended from white towards a pure hue has an HSL saturation of **1 everywhere along that blend**, so HSL saturation says nothing about how far out on a wheel a colour sits. Use `ColorHsva` when the answer should mean a position, and `ColorHsla` when you need a CSS `hsl()` string.

## Comparing colours

`===` on a class instance compares references, not channels, so it is false for two separate instances however equal they are. Every colour class provides a static value comparison instead:

```typescript
ColorHsva.AreNearEqual(a, b)   //not a === b
```

"Near" is half a step of the 8-bit form the colour ends up in — below that, two colours round to the same bytes and cannot be told apart once rendered. Hue is compared as an angle, so `0.999` and `0.001` count as the same place on the wheel.

A packed `Color` is a number, so plain `===` is correct for it.

## Example

```typescript
import { Color, ColorRgba, ColorHsva, FormatColor, ParseColor } from 'xaml-ui';

//To and from text
let text = FormatColor(color);          //"#ff3366cc"
let parsed: Color = ParseColor(text);

//Unpack, rotate the hue, repack
let hsva = ColorRgba.FromNumber(color).ToHsva();
hsva.H = (hsva.H + 0.5) % 1;
let opposite: Color = hsva.ToRgba().ToNumber();

//As a CSS colour
element.style.background = ColorRgba.FromNumber(color).ToString();
```

See [ColorSpectrum](primitives/ColorSpectrum.md) and [ColorPicker](basic-input/ColorPicker.md) for the controls that produce these values.
