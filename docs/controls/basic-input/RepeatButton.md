# RepeatButton

> Source: [RepeatButton.ts](../../../projects/xaml-ui/src/lib/basic-input/RepeatButton.ts)

Button that emits Click events repeatedly while held down. Extends [Button](Button.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Delay` | `number` | `250` | Milliseconds before repeat starts |
| `Interval` | `number` | `250` | Milliseconds between repeated clicks |

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Flyout`, `IsTabStop`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `Focus()`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Behavior

- **Pointer:** pressing the primary button emits `Click` at once, again after `Delay`, then every `Interval` until the pointer is released (the pointer is captured, so leaving the button does not stop it).
- **Keyboard:** a tab stop with `role="button"` and the focus visual. Each **Enter** or **Space** key-down emits `Click` once; a held key repeats at the keyboard's own auto-repeat rate (`Delay` and `Interval` do not apply).
- A `Flyout` is not opened: the button handles clicks itself.

## Example

```html
<RepeatButton Class="InlineButtonStyle" (Click)="onIncrement()" [Delay]="500" [Interval]="50">
  <FontIcon Glyph="&#xE70E;" />
</RepeatButton>
```
