# ProgressBar

> Source: [ProgressBar.ts](../../../projects/xaml-ui/src/lib/status-and-info/ProgressBar.ts)

Horizontal progress indicator: a 3px accent indicator over a 1px track (WinUI's look). Extends [FrameworkElement](../FrameworkElement.md). For the circular variant see [ProgressRing](ProgressRing.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Minimum` | `number` | `0` | Minimum value |
| `Maximum` | `number` | `1` | Maximum value |
| `Value` | `number` | `0` | Current progress value (the indicator is clamped to the range) |
| `IsIndeterminate` | `boolean` | `false` | When true, shows an animated indeterminate state (no track) |
| `ShowPaused` | `boolean` | `false` | Colours the indicator with `--SystemFillColorCaution` (adds `.paused`) |
| `ShowError` | `boolean` | `false` | Colours the indicator with `--SystemFillColorCritical` (adds `.error`) |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Accessibility

The host has the `progressbar` role. While determinate it has `aria-valuemin`, `aria-valuemax` and `aria-valuenow` (the value clamped to the range); while indeterminate it has `aria-busy="true"` and no values. Give it a name with `aria-label` when nearby text does not describe it.

## Examples

**Determinate:**

```html
<ProgressBar [Value]="0.5" />
<ProgressBar [Value]="progress" [Maximum]="totalItems" />
```

**Paused or failed:**

```html
<ProgressBar [Value]="progress" [ShowPaused]="isPaused" [ShowError]="hasFailed" />
```

**Indeterminate (loading):**

```html
<ProgressBar [IsIndeterminate]="true" />
```
