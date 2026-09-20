# ColorSpectrum

> Source: [ColorSpectrum.ts](../../../projects/xaml-ui/src/lib/primitives/ColorSpectrum.ts)

Hue/saturation colour wheel. The wheel picks hue and saturation from the pointer position; `Brightness` and `Alpha` supply the remaining two channels, and `Color` is all four together. It is the primitive [ColorPicker](../basic-input/ColorPicker.md) is built from, and is usable on its own where the extra channels are not wanted. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Color` | `Color` (number) | `0xffffffff` | Selected colour as `0xAARRGGBB`, brightness and alpha included |
| `Brightness` | `number` | `1` | Value channel, `0..1`. Dims the wheel and darkens `Color` with it |
| `Alpha` | `number` | `1` | Alpha channel, `0..1`. Fades the wheel over a checkerboard and `Color` with it |

| Output | Type | Description |
|---|---|---|
| `ColorChange` | `EventEmitter<Color>` | Emitted when the published colour changes |
| `HsvColorChange` | `EventEmitter<ColorHsva>` | Emitted whenever the selection changes, including where `Color` cannot show it |

| Property | Type | Description |
|---|---|---|
| `HsvColor` | `ColorHsva` | The selection in hue/saturation/value form, every channel `0..1`. Readable and settable from code, but not an `@Input()` — see [Binding HsvColor](#binding-hsvcolor) |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

The wheel is always square: it takes `Width`, falling back to `Height`, falling back to `300px`.

## Behavior

**Both events are raised however the selection moved** — a pointer drag, `Color`, `Brightness` or `Alpha` — not only from the gesture.

**They do not always fire together**, because many HSVA states share one `Color`. At `Brightness` 0 every hue is black, so dragging the wheel there raises `HsvColorChange` and moves the selector while `Color` stays `0xff000000` and `ColorChange` stays silent. The same applies at zero saturation, where every hue is white. Anything that depends on hue or saturation alone — a gradient, a readout — should follow `HsvColorChange`. Neither fires for a change too small to survive 8 bits.

**The wheel is a pair of CSS gradients**, not a drawn image: a conic gradient for hue and a white radial gradient for saturation. Nothing is rasterized, so it stays clean at any size or zoom, and no redraw is needed when a channel moves — `Brightness` is a `filter: brightness()` and `Alpha` an `opacity` over a checkerboard.

**Picking is arithmetic, not sampling.** Every point on the wheel is exactly `HSV(hue = angle, saturation = distance from centre, value = 1)`, so a pointer position converts straight to a colour and the selector position is the exact inverse. Hue 0 (red) sits at 3 o'clock and runs clockwise.

**The selection is stored as floating-point HSVA**, not as the packed `Color`. This is what lets hue survive the third channel: an 8-bit colour at low brightness has almost no hue left in it, so a control that re-read its own `Color` would return a different hue after the brightness went down and back up.

**The whole square is clickable.** The wheel is inset 8px from the control's edge, and presses in that band or in the corners clamp to the rim rather than being ignored. The inset also gives the selector room so it never spills outside the control.

## Examples

**On its own, as a plain hue/saturation picker:**

```html
<ColorSpectrum Width="200px" (ColorChange)="OnColorSelected($event)" />
```

**With a third channel supplied by the host** — the arrangement [ColorPicker](../basic-input/ColorPicker.md) uses:

```html
<ColorSpectrum #spectrum Width="200px" [(Color)]="SelectedColor" />
<Slider [Minimum]="0" [Maximum]="1" [(Value)]="spectrum.Brightness" />
<Slider [Minimum]="0" [Maximum]="1" [(Value)]="spectrum.Alpha" />
```

Setting `Brightness` or `Alpha` keeps the hue and saturation the wheel holds, so the sliders can be moved freely without the selection drifting.

### Binding HsvColor

`HsvColor` can be read, set and listened to, but it cannot be used as an input binding — `[HsvColor]` and `[(HsvColor)]` are not available. Its getter returns a copy, so change detection would see a new reference on every check, and a two-way binding would assign one back mid-check and trip `ExpressionChangedAfterItHasBeenChecked`. Bind `Color`, `Brightness` and `Alpha`, which are numbers, and use `HsvColor` from code:

```typescript
protected OnHsvColorChange(value: ColorHsva) {
  this.Hue = value.H * 360;
}
```

See [Color](../Color.md) for the colour types, and [Control Properties](../../conventions.md#control-properties) for the reasoning behind this property design.

## Import

```typescript
import { ColorSpectrumComponent } from 'xaml-ui';

@Component({
  imports: [ColorSpectrumComponent, ...]
})
```
