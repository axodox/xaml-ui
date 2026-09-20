# ColorPicker

> Source: [ColorPicker.ts](../../../projects/xaml-ui/src/lib/basic-input/ColorPicker.ts)

Colour wheel with optional brightness and alpha sliders. Built on [ColorSpectrum](../primitives/ColorSpectrum.md), which holds the selection; this control adds the two channel sliders and publishes the combined result. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Color` | `Color` (number) | `0xffffffff` | Selected colour as `0xAARRGGBB`, brightness and alpha included |
| `IsBrightnessEnabled` | `boolean` | `false` | Show a brightness slider below the wheel |
| `IsAlphaEnabled` | `boolean` | `false` | Show an alpha slider below the wheel |

| Output | Type | Description |
|---|---|---|
| `ColorChange` | `EventEmitter<Color>` | Emitted when the colour changes, however it changed |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

`Width` and `Height` are passed through to the wheel, which is always square — it takes `Width`, falling back to `Height`, falling back to `300px`.

## Behavior

The wheel picks hue and saturation from the pointer position. The two sliders supply the remaining channels, and all three combine into `Color`.

Both sliders run `0..1`, matching `ColorHsva`'s channels rather than the packed byte. They appear below the wheel only when enabled; the wheel itself always shows the full selection, dimmed by brightness and faded by alpha over a checkerboard, so what is drawn is the colour that would be picked.

Hue and saturation are held in floating point by the spectrum rather than being read back out of `Color`, so turning the brightness down to zero and back up returns the hue you started with.

## Examples

**Plain hue/saturation wheel:**

```html
<ColorPicker Width="150px" HorizontalAlignment="Center" [(Color)]="SelectedColor" />
```

**With brightness and alpha:**

```html
<ColorPicker Width="150px" [IsBrightnessEnabled]="true" [IsAlphaEnabled]="true"
             [(Color)]="SelectedColor" />
```

**Reading the result:**

```typescript
import { Color, ColorRgba } from 'xaml-ui';

protected SelectedColor: Color = 0xff3366cc;

protected OnColorChange(value: Color) {
  console.log(ColorRgba.FromNumber(value).ToString());   //rgba(51, 102, 204, 1)
}
```

## Color Utilities

`Color` is a packed `0xAARRGGBB` number. To work on individual channels, convert to one of the colour classes — see [Color](../Color.md) for the full reference.
