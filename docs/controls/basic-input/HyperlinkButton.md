> Source: [HyperlinkButton.ts](../../../projects/xaml-ui/src/lib/basic-input/HyperlinkButton.ts)

# HyperlinkButton

Button that opens a URL in a new window/tab. Extends [Button](Button.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `NavigateUri` | `string` | — | URL to open on click |

## Inherited Properties

- From [Button](Button.md): `IsEnabled`, `Content`, `Click`, `HorizontalContentAlignment`, `VerticalContentAlignment`
- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<HyperlinkButton Content="Learn more" NavigateUri="https://example.com" />
```

The `HyperlinkButtonStyle` CSS class is applied automatically, giving it transparent background with accent-colored text.
