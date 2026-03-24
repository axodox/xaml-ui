> Source: [FontIcon.ts](../../../projects/xaml-ui/src/lib/icons/FontIcon.ts)

# FontIcon

Displays a glyph from the Segoe Fluent Icons / Segoe MDL2 Assets icon font. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Glyph` | `string` | — | Unicode glyph character |
| `FontFamily` | `string` | `'Segoe Fluent Icons', 'Segoe MDL2 Assets'` | Icon font family |
| `FontSize` | `string` | — | CSS font-size (e.g. `"20pt"`, `"15pt"`) |
| `FontWeight` | `FontWeights` | `'Normal'` | CSS font-weight |
| `FontStyle` | `FontStyle` | — | CSS font-style |
| `Foreground` | `string` | — | CSS color (e.g. `"Red"`, `"Yellow"`, `"var(--AccentFillColorDefault)"`) |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, `Opacity`.

## Glyph Syntax

Use `&#xCODE;` in templates or `'\uCODE'` in TypeScript bindings:

```html
<!-- Static glyph in template -->
<FontIcon Glyph="&#xE710;" />

<!-- Dynamic glyph from TypeScript -->
<FontIcon [Glyph]="isPlaying ? '\uE769' : '\uE768'" />
```

Glyph codes are from [Segoe Fluent Icons](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-fluent-icons-font).

## Common Glyphs

| Code | Description |
|---|---|
| `E710` | Add (+) |
| `E74D` | Delete |
| `E70F` | Edit |
| `E713` | Settings |
| `E74E` | Save/Checkmark |
| `E768` | Play |
| `E769` | Pause |
| `E71B` | Link |
| `E8C8` | Copy |
| `E740` | Full screen |
| `E73F` | Exit full screen |
| `E707` | Pin / location |
| `E80A` / `E809` | Chevron up / down |
| `E70E` / `E70D` | Chevron up small / down small |

## Examples

**Simple icon:**

```html
<FontIcon Glyph="&#xE710;" />
```

**Colored icon with size:**

```html
<FontIcon Glyph="&#xE8B2;" Foreground="Red" FontSize="15pt" VerticalAlignment="Center" />
```

**Conditional icon:**

```html
<FontIcon [Glyph]="isLooping ? '\uE8EE' : '\uF5E7'" />
```
