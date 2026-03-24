> Source: [Image.ts](../../../projects/xaml-ui/src/lib/media/Image.ts)

# Image

Image display control with stretch modes. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Source` | `string` | — | Image URL or data URI |
| `Stretch` | `'None' \| 'Fill' \| 'Uniform' \| 'UniformToFill'` | `'Uniform'` | How the image fills its bounds |

## Stretch Modes

| Value | Description |
|---|---|
| `None` | Original size, no scaling |
| `Fill` | Stretches to fill, ignoring aspect ratio |
| `Uniform` | Scales to fit within bounds, preserving aspect ratio (may letterbox) |
| `UniformToFill` | Scales to fill bounds, preserving aspect ratio (may crop) |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, etc.

## Examples

```html
<Image [Source]="imageUrl" Stretch="Uniform" Width="400px" Height="400px" />
```

```html
<Image [Source]="thumbnailUrl" Stretch="UniformToFill" Width="100px" Height="100px" />
```
