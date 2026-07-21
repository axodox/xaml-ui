# ColorPicker

> Source: [ColorPicker.ts](../../../projects/xaml-ui/src/lib/basic-input/ColorPicker.ts)

Canvas-based color wheel for selecting colors. Uses HSL color space internally. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Color` | `Color` (number) | `0xffffffff` | ARGB color as 32-bit number |
| `IsBrightnessEnabled` | `boolean` | `false` | Show a brightness slider below the ring (sets the value of the picked hue/saturation) |
| `IsAlphaEnabled` | `boolean` | `false` | Show an alpha slider below the ring (sets the alpha byte) |

| Output | Type | Description |
|---|---|---|
| `ColorChange` | `EventEmitter<Color>` | Emitted when color changes |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<ColorPicker Width="150px" Height="150px" HorizontalAlignment="Center"
             [(Color)]="selectedColor" />

<!-- With brightness and alpha sliders; the ring reflects both -->
<ColorPicker Width="150px" [IsBrightnessEnabled]="true" [IsAlphaEnabled]="true"
             [(Color)]="selectedColor" />
```

When `IsBrightnessEnabled`/`IsAlphaEnabled` are `true`, sliders appear below the
ring. The emitted `Color` carries the alpha byte and the RGB scaled by
brightness; the ring is dimmed by brightness and faded by alpha (over a
checkerboard) so the exact selected color is shown.

## Color Utilities

Import color conversion helpers:

```typescript
import { Color, colorToString, stringToColor, colorToRgb, rgbToHsl } from 'xaml-ui';
```

- `Color` — 32-bit ARGB number (e.g. `0xffffffff` for white)
- `colorToString(color)` — converts to CSS hex string
- `stringToColor(str)` — parses CSS color string to number
- `colorToRgb(color)` — returns `{ r, g, b, a }` (0-255)
- `rgbToHsl(rgb)` — returns `{ h, s, l, a }` (h: 0-360, s/l: 0-1)
