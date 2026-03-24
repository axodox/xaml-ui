# RepeatButton

> Source: [RepeatButton.ts](../../../projects/xaml-ui/src/lib/basic-input/RepeatButton.ts)

Button that emits Click events repeatedly while held down. Extends [Button](Button.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Delay` | `number` | `250` | Milliseconds before repeat starts |
| `Interval` | `number` | `250` | Milliseconds between repeated clicks |

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<RepeatButton Class="InlineButtonStyle" (Click)="onIncrement()" [Delay]="500" [Interval]="50">
  <FontIcon Glyph="&#xE70E;" />
</RepeatButton>
```
