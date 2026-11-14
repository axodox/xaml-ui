# HyperlinkButton

> Source: [HyperlinkButton.ts](../../../projects/xaml-ui/src/lib/basic-input/HyperlinkButton.ts)

Button that opens a URL in a new window/tab. Extends [Button](Button.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `NavigateUri` | `string` | — | URL to open on click |

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Flyout`, `IsTabStop`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `Focus()`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<HyperlinkButton Content="Learn more" NavigateUri="https://example.com" />
```

The `HyperlinkButtonStyle` CSS class is applied automatically, giving it transparent background with accent-colored text.

## Keyboard and Accessibility

A custom-element button (see [Button](Button.md#keyboard-and-accessibility)): a tab stop, **Enter** / **Space** click it, and it shows the focus visual. Its role is `link` when `NavigateUri` is set, `button` otherwise.
