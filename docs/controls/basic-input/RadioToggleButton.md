# RadioToggleButton

> Source: [RadioToggleButton.ts](../../../projects/xaml-ui/src/lib/basic-input/RadioToggleButton.ts)

A RadioButton styled as a toggle button (like a toolbar segmented control). Extends [RadioButton](RadioButton.md).

## Own Properties

None beyond RadioButton. Same API, different visual appearance — styled as a button instead of a radio circle.

## Inherited Properties

- From [RadioButton](RadioButton.md): `Value`, `Group`, `IsEnabled`, `IsChecked`, `IsTabStop`, `IsCheckedChange`
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

Like [RadioButton](RadioButton.md#keyboard-and-accessibility), it keeps its native radio input reachable: it has the radio role, **Tab** enters the group, the **arrow keys** move the choice within it, and keyboard focus shows WinUI's focus visual around the button.
