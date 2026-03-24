# CheckBox

> Source: [CheckBox.ts](../../../projects/xaml-ui/src/lib/basic-input/CheckBox.ts)

Boolean toggle with a checkbox indicator. Extends [Border](../layout/Border.md) → [Panel](../layout/Panel.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `IsChecked` | `boolean` | `false` | Checked state |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter` | Emitted when checked state changes |

## Inherited Properties

- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Simple checkbox:**

```html
<CheckBox [(IsChecked)]="isEnabled">
  <TextBlock>Enable feature</TextBlock>
</CheckBox>
```

**In a list item template (one-way binding with event):**

```html
<CheckBox [IsChecked]="item.IsEnabled" (IsCheckedChange)="toggleItem(item.Id)">
  <Grid ColumnDefinitions="1fr auto" Margin="0 0 0 6px">
    <TextBlock [Text]="item.Name" />
    <FontIcon [Glyph]="item.Icon" />
  </Grid>
</CheckBox>
```
