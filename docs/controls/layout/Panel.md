> Source: [Panel.ts](../../../projects/xaml-ui/src/lib/layout/Panel.ts)

# Panel

Abstract base class for container components (Grid, StackPanel, Border). Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Background` | `string` | — | CSS background-color |
| `CornerRadius` | `string` | — | CSS border-radius (e.g. `"6px"`, `"4px 4px 0 0"`) |
| `BorderThickness` | `string` | — | CSS border-width. When set, also applies `border-style: solid`. |
| `BorderBrush` | `string` | — | CSS border-color |

## Inherited Properties

All [FrameworkElement](../FrameworkElement.md) properties: `Width`, `Height`, `MinWidth`, `MaxWidth`, `MinHeight`, `MaxHeight`, `HorizontalAlignment`, `VerticalAlignment`, `Margin`, `Padding`, `Opacity`.

## Subclasses

- [Grid](Grid.md)
- [StackPanel](StackPanel.md)
- [Border](Border.md)
