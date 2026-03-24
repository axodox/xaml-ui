# ProgressBar

> Source: [ProgressBar.ts](../../../projects/xaml-ui/src/lib/status-and-info/ProgressBar.ts)

Horizontal progress indicator. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Minimum` | `number` | `0` | Minimum value |
| `Maximum` | `number` | `1` | Maximum value |
| `Value` | `number` | `0` | Current progress value |
| `IsIndeterminate` | `boolean` | `false` | When true, shows an animated indeterminate state |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Determinate:**

```html
<ProgressBar [Value]="0.5" />
<ProgressBar [Value]="progress" [Maximum]="totalItems" />
```

**Indeterminate (loading):**

```html
<ProgressBar [IsIndeterminate]="true" />
```

# ProgressRing

Circular progress indicator (SVG-based). Same API as ProgressBar. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

Same as ProgressBar: `Minimum`, `Maximum`, `Value`, `IsIndeterminate`.

## Example

```html
<ProgressRing [IsIndeterminate]="isLoading" Width="32px" Height="32px" />
```
