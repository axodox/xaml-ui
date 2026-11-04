# PasswordBox

> Source: [PasswordBox.ts](../../../projects/xaml-ui/src/lib/text/PasswordBox.ts)

Masked single-line input for passwords. Renders as `<input type="password">`, so browser password managers can fill it. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Password` | `string` | `''` | Current password |
| `PlaceholderText` | `string` | `''` | Placeholder text |
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `PasswordRevealMode` | `'Peek' \| 'Hidden' \| 'Visible'` | `'Peek'` | Peek = reveal button shows the password while held down, Hidden = always masked, Visible = never masked |
| `AutoComplete` | `string` | `'current-password'` | `autocomplete` hint for password managers, e.g. `'new-password'` |

| Output | Type | Description |
|---|---|---|
| `PasswordChange` | `EventEmitter<string>` | Emitted on every change |

## Methods

| Method | Description |
|---|---|
| `Focus()` | Programmatically focus the input |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Login form:**

```html
<TextBox [(Text)]="userName" PlaceholderText="User name" />
<PasswordBox [(Password)]="password" PlaceholderText="Password" (keydown.enter)="signIn()" />
```

**Sign-up form without a reveal button:**

```html
<PasswordBox [(Password)]="newPassword" PasswordRevealMode="Hidden" AutoComplete="new-password" />
```
