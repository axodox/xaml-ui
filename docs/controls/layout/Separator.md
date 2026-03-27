# Separator

> Source: [Separator.ts](../../../projects/xaml-ui/src/lib/layout/Separator.ts)

A thin divider line used to visually separate content. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Direction of the line |

## Inherited Properties

- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Implementation

- Renders as a 2px line using `--DividerStrokeColorDefault` as the background color.
- Horizontal: 2px tall, stretches to available width.
- Vertical: 2px wide, stretches to available height.
- `Width` / `Height` inputs override the defaults when set.

## Examples

**Horizontal separator (default):**

```html
<StackPanel Spacing="6px">
  <TextBlock Text="Section A" />
  <Separator />
  <TextBlock Text="Section B" />
</StackPanel>
```

**Vertical separator:**

```html
<StackPanel Orientation="Horizontal" Spacing="6px">
  <TextBlock Text="Left" />
  <Separator Orientation="Vertical" />
  <TextBlock Text="Right" />
</StackPanel>
```
