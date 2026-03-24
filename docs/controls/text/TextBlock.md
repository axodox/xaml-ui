> Source: [TextBlock.ts](../../../projects/xaml-ui/src/lib/text/TextBlock.ts)

# TextBlock

Read-only text display control. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Text` | `string` | — | Text content |
| `FontFamily` | `string` | — | CSS font-family |
| `FontSize` | `string` | — | CSS font-size (e.g. `"16pt"`, `"12px"`) |
| `FontStyle` | `'Normal' \| 'Oblique' \| 'Italic'` | — | CSS font-style |
| `FontWeight` | `FontWeights` | `'Normal'` | Font weight (see values below) |
| `Foreground` | `string` | — | CSS color |
| `TextAlignment` | `'Left' \| 'Center' \| 'Right' \| 'Justify'` | `'Left'` | Text alignment |
| `TextWrapping` | `'NoWrap' \| 'Wrap'` | `'NoWrap'` | Whether text wraps |
| `TextTrimming` | `'None' \| 'CharacterEllipsis' \| 'Clip'` | `'None'` | Overflow behavior (ellipsis or clip) |
| `TextDecorations` | `'None' \| 'Underline' \| 'Strikethrough'` | — | Text decoration |
| `IsTextSelectionEnabled` | `'True' \| 'False'` | — | Whether text is selectable (note: string type) |

## FontWeights

`Thin` (100), `ExtraLight` (200), `Light` (300), `SemiLight` (350), `Normal` (400), `Medium` (500), `SemiBold` (600), `Bold` (700), `ExtraBold` (800), `Black` (900), `ExtraBlack` (950)

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, `Opacity`.

## Sizing Behavior

When `TextTrimming` is set to `CharacterEllipsis` or `Clip`, the width is constrained (not `fit-content`) to allow truncation to work.

## Examples

**Simple text:**

```html
<TextBlock Text="Hello World" />
```

**Styled header (via class):**

```html
<TextBlock Text="Section Title" Class="HeaderTextBlockStyle" />
```

**Inline text with interpolation:**

```html
<TextBlock>View {{isLinked ? 'linked' : 'unlinked'}}</TextBlock>
```

**Truncated text with tooltip:**

```html
<TextBlock [Text]="item.Name" TextWrapping="NoWrap" TextTrimming="CharacterEllipsis"
           [ToolTipService-ToolTip]="item.Name" />
```

**Detail/secondary text:**

```html
<TextBlock [Text]="item.Description" Class="DetailTextBlockStyle" FontStyle="Italic"
           TextWrapping="NoWrap" TextTrimming="CharacterEllipsis" />
```

**Formatted value with pipe:**

```html
<TextBlock [Text]="position() | DurationToString" VerticalAlignment="Center" FontSize="12pt" />
```
