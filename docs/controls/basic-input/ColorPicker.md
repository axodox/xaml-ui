# ColorPicker

> Source: [ColorPicker.ts](../../../projects/xaml-ui/src/lib/basic-input/ColorPicker.ts)

Canvas-based color wheel for selecting colors. Uses HSL color space internally. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Color` | `Color` (number) | `0xffffffff` | ARGB color as 32-bit number |

| Output | Type | Description |
|---|---|---|
| `ColorChange` | `EventEmitter<Color>` | Emitted when color changes |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<ColorPicker Width="150px" Height="150px" HorizontalAlignment="Center"
             [(Color)]="selectedColor" />
```

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
