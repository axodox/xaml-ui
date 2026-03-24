> Source: [DropDownButton.ts](../../../projects/xaml-ui/src/lib/basic-input/DropDownButton.ts)

# DropDownButton

Button with a dropdown chevron indicator. Place a `Flyout` or `MenuFlyout` as child. Extends [Button](Button.md).

## Own Properties

None beyond Button. The chevron is added visually.

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<DropDownButton Content="Options">
  <MenuFlyout>
    <MenuFlyoutItem Text="Option A" (Click)="onA()" />
    <MenuFlyoutItem Text="Option B" (Click)="onB()" />
  </MenuFlyout>
</DropDownButton>
```
