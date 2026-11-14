# ToggleButton

> Source: [ToggleButton.ts](../../../projects/xaml-ui/src/lib/basic-input/ToggleButton.ts)

Button with a checked/unchecked toggle state. Extends [Button](Button.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsChecked` | `boolean` | `false` | Toggle state |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter<boolean>` | Emitted when toggle state changes |

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Flyout`, `IsTabStop`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `Focus()`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Behavior

When checked, the button gets the `.checked` CSS class which applies the accent highlight style (same as `AccentButtonStyle`). A click (or **Enter** / **Space**) toggles `IsChecked` and emits `IsCheckedChange` after `Click`.

It is a custom-element button (see [Button](Button.md#keyboard-and-accessibility)): a tab stop with `role="button"` and the focus visual, and `aria-pressed` reflects `IsChecked`.

## Example

```html
<ToggleButton [(IsChecked)]="isBold">
  <FontIcon Glyph="&#xE8DD;" />
</ToggleButton>
```
