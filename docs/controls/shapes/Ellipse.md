# Ellipse

> Source: [Ellipse.ts](../../../projects/xaml-ui/src/lib/shapes/Ellipse.ts)

Circular/elliptical shape. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Fill` | `string` | — | CSS background-color |
| `Stroke` | `string` | — | CSS border-color |
| `StrokeThickness` | `string` | — | CSS border-width |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, etc.

## Examples

**Status indicator:**

```html
<Ellipse Width="12px" Height="12px" [Fill]="statusColor" />
```

**Circle with stroke:**

```html
<Ellipse Width="24px" Height="24px" Fill="transparent" Stroke="var(--AccentFillColorDefault)" StrokeThickness="2px" />
```
