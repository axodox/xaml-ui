> Source: [RadioToggleButton.ts](../../../projects/xaml-ui/src/lib/basic-input/RadioToggleButton.ts)

# RadioToggleButton

A RadioButton styled as a toggle button (like a toolbar segmented control). Extends [RadioButton](RadioButton.md).

## Own Properties

None beyond RadioButton. Same API, different visual appearance — styled as a button instead of a radio circle.

## Inherited Properties

- From [RadioButton](RadioButton.md): `Value`, `Group`, `IsEnabled`, `IsChecked`, `IsCheckedChange`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<RadioButtonGroup [(Value)]="viewMode">
  <RadioToggleButton ToolTipService-ToolTip="List view" Value="List">
    <FontIcon Glyph="&#xE8FD;" />
  </RadioToggleButton>
  <RadioToggleButton ToolTipService-ToolTip="Grid view" Value="Grid">
    <FontIcon Glyph="&#xF0E2;" />
  </RadioToggleButton>
  <RadioToggleButton ToolTipService-ToolTip="Details view" Value="Details">
    <FontIcon Glyph="&#xE7B5;" />
  </RadioToggleButton>
</RadioButtonGroup>
```

When checked, the button displays with the accent highlight style.
