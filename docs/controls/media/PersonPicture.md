# PersonPicture

> Source: [PersonPicture.ts](../../../projects/xaml-ui/src/lib/media/PersonPicture.ts)

Avatar display with initials fallback and optional badge. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `DisplayName` | `string` | — | Full name (used for generating initials if Initials not set) |
| `ProfilePicture` | `string` | — | Image URL for avatar photo |
| `Initials` | `string` | — | Explicit initials text |
| `Foreground` | `string` | — | Text/initials color |
| `Background` | `string` | — | Circle background color |
| `BadgeText` | `string` | — | Badge text |
| `BadgeGlyph` | `string` | — | Badge icon glyph |
| `BadgeImageSource` | `string` | — | Badge image URL |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

```html
<PersonPicture [Initials]="userInitials" [Foreground]="userColor" Width="40px" Height="40px" />
```
