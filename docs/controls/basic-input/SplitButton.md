# SplitButton

> Source: [SplitButton.ts](../../../projects/xaml-ui/src/lib/basic-input/SplitButton.ts)

Button split into a main clickable area and a dropdown section. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Main button click |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<SplitButton (Click)="onDefaultAction()" VerticalAlignment="Center">
  <FontIcon Glyph="&#xE710;" />
  <MenuFlyout>
    <MenuFlyoutItem Text="Action A" (Click)="onA()" />
    <MenuFlyoutItem Text="Action B" (Click)="onB()" />
  </MenuFlyout>
</SplitButton>
```
