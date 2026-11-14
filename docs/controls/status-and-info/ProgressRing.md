# ProgressRing

> Source: [ProgressRing.ts](../../../projects/xaml-ui/src/lib/status-and-info/ProgressRing.ts)

Circular progress indicator (SVG): an accent arc over a track ring, or a spinning arc while indeterminate. Same range API as [ProgressBar](ProgressBar.md). Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Minimum` | `number` | `0` | Minimum value |
| `Maximum` | `number` | `1` | Maximum value |
| `Value` | `number` | `0` | Current progress value (the arc is clamped to the range) |
| `IsIndeterminate` | `boolean` | `false` | When true, shows a spinning arc |
| `Background` | `string` | `var(--ControlStrongStrokeColorDisabled)` | Colour of the track ring under a determinate arc (WinUI's `ProgressRing.Background`); none while indeterminate |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width` and `Height` (both `40px` by default; the SVG scales to them), `Margin`, etc.

## Accessibility

The host has the `progressbar` role. While determinate it has `aria-valuemin`, `aria-valuemax` and `aria-valuenow` (the value clamped to the range); while indeterminate it has `aria-busy="true"` and no values. The SVG is `aria-hidden`.

## Examples

```html
<ProgressRing [IsIndeterminate]="isLoading" Width="32px" Height="32px" />
<ProgressRing [Value]="progress" Background="var(--AccentFillColorDisabled)" />
```
