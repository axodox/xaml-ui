# ToggleSwitch

> Source: [ToggleSwitch.ts](../../../projects/xaml-ui/src/lib/basic-input/ToggleSwitch.ts)

Boolean toggle rendered as a switch. Extends [CheckBox](CheckBox.md).

## Own Properties

None beyond CheckBox. Same API, different visual appearance.

## Inherited Properties

- From [CheckBox](CheckBox.md): `IsEnabled`, `IsChecked`, `IsCheckedChange`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<ToggleSwitch [(IsChecked)]="isLinked" HorizontalAlignment="Center">
  <TextBlock>View {{isLinked ? 'linked' : 'unlinked'}}</TextBlock>
</ToggleSwitch>
```
