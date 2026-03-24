# Slider

> Source: [Slider.ts](../../../projects/xaml-ui/src/lib/basic-input/Slider.ts)

Range input control for selecting a numeric value. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Minimum` | `number` | `0.0` | Minimum value |
| `Maximum` | `number` | `1.0` | Maximum value |
| `Value` | `number` | `0.0` | Current value |
| `StepFrequency` | `number` | `0` | Step increment (0 = continuous) |
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Slider direction |
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `ValueChange` | `EventEmitter<number>` | Emitted when value changes |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Horizontal slider:**

```html
<Slider [(Value)]="opacity" [Minimum]="0" [Maximum]="1" [StepFrequency]="0.05" />
```

**Vertical slider with surrounding icons:**

```html
<FontIcon Glyph="&#xE80A;" HorizontalAlignment="Center" Margin="12px" />
<Slider Height="200px" Orientation="Vertical" HorizontalAlignment="Center"
        [Minimum]="0" [Maximum]="100" [(Value)]="brightness" />
<FontIcon Glyph="&#xE809;" HorizontalAlignment="Center" Margin="12px" />
```

**With tooltip and pipe:**

```html
<Slider [Value]="elapsed() | ToSeconds" (ValueChange)="Seek($event)"
        [Maximum]="total() | ToSeconds" [IsEnabled]="CanSeek()"
        HorizontalAlignment="Stretch" Margin="6px"
        [ToolTipService-ToolTip]="elapsed() | FormatTime" />
```
