# DropDownButton

> Source: [DropDownButton.ts](../../../projects/xaml-ui/src/lib/basic-input/DropDownButton.ts)

Button with a dropdown chevron indicator. Place a `Flyout` or `MenuFlyout` as child (or set the `Flyout` input). Extends [Button](Button.md).

## Own Properties

None beyond Button. The chevron is added visually.

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Flyout`, `IsTabStop`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `Focus()`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Keyboard and Accessibility

A custom-element button (see [Button](Button.md#keyboard-and-accessibility)): a tab stop with `role="button"`, **Enter** / **Space** click it and open its flyout, and it shows the focus visual. With a flyout it has `aria-haspopup="true"` and `aria-expanded`.

## Example

```html
<DropDownButton Content="Options">
  <MenuFlyout>
    <MenuFlyoutItem Text="Option A" (Click)="onA()" />
    <MenuFlyoutItem Text="Option B" (Click)="onB()" />
  </MenuFlyout>
</DropDownButton>
```
