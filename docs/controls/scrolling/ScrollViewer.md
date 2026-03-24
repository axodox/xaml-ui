# ScrollViewer

> Source: [ScrollViewer.ts](../../../projects/xaml-ui/src/lib/scrolling/ScrollViewer.ts)

Scrollable container with custom ScrollBars. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `HorizontalScrollMode` | `'Disabled' \| 'Enabled' \| 'Auto'` | `'Auto'` | Horizontal scroll behavior |
| `VerticalScrollMode` | `'Disabled' \| 'Enabled' \| 'Auto'` | `'Auto'` | Vertical scroll behavior |

## ScrollMode Values

| Value | Description |
|---|---|
| `Disabled` | No scrolling in this axis |
| `Enabled` | Always show scrollbar |
| `Auto` | Show scrollbar only when content overflows |

## Read-only Properties

| Property | Type | Description |
|---|---|---|
| `ExtentWidth` | `number` | Total content width |
| `ExtentHeight` | `number` | Total content height |
| `ViewportWidth` | `number` | Visible area width |
| `ViewportHeight` | `number` | Visible area height |
| `HorizontalOffset` | `number` | Current horizontal scroll position |
| `VerticalOffset` | `number` | Current vertical scroll position |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<ScrollViewer HorizontalScrollMode="Disabled" VerticalScrollMode="Auto" MaxHeight="400px">
  <StackPanel Spacing="6px">
    <!-- long content -->
  </StackPanel>
</ScrollViewer>
```

# ScrollBar

Low-level scrollbar control. Usually used internally by ScrollViewer. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Vertical'` | Scrollbar direction |
| `ViewportSize` | `number` | `0` | Visible area size |
| `ScrollSize` | `number` | `0` | Total scrollable area size |
| `StepSize` | `number` | `5` | Increment per step button click |
| `Value` | `number` | — | Current scroll position |
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `ValueChange` | `EventEmitter<number>` | Scroll position changed |
