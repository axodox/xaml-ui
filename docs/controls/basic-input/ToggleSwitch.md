# ToggleSwitch

> Source: [ToggleSwitch.ts](../../../projects/xaml-ui/src/lib/basic-input/ToggleSwitch.ts)

Boolean toggle rendered as a switch. Extends [CheckBox](CheckBox.md).

## Own Properties

None beyond CheckBox. Same API, different visual appearance. It has no indeterminate look: `IsChecked` `null` shows as off, so leave `IsThreeState` off.

## Inherited Properties

- From [CheckBox](CheckBox.md): `IsEnabled`, `IsChecked`, `IsTabStop`, `IsCheckedChange`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Keyboard and Accessibility

The native checkbox input is kept reachable as in [CheckBox](CheckBox.md#behavior), with `role="switch"`: it takes the focus, the content is its name, and **Space** toggles it. Keyboard focus shows WinUI's focus visual.

## Example

```html
<ToggleSwitch [(IsChecked)]="isLinked" HorizontalAlignment="Center">
  <TextBlock>View {{isLinked ? 'linked' : 'unlinked'}}</TextBlock>
</ToggleSwitch>
```
