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
| `Name` | `string` | — | Form field `name`, e.g. to read the value with `FormData` |

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

Chrome and Firefox offer to save the password only when a `<form>` is submitted, so wrap the fields in one. Chromium hides autofilled values from the page until the user interacts with it, so read them from the form on submit rather than enabling the button by content:

```html
<form #form (submit)="$event.preventDefault(); signIn(form)">
  <TextBox Name="userName" PlaceholderText="User name" AutoComplete="username" (keydown.enter)="form.requestSubmit()" />
  <PasswordBox Name="password" PlaceholderText="Password" (keydown.enter)="form.requestSubmit()" />
  <Button Content="Sign in" (Click)="form.requestSubmit()"></Button>
</form>
```

```typescript
signIn(form: HTMLFormElement) {
  const fields = new FormData(form);
  const userName = fields.get('userName') as string;
  const password = fields.get('password') as string;
}
```

**Sign-up form without a reveal button:**

```html
<PasswordBox [(Password)]="newPassword" PasswordRevealMode="Hidden" AutoComplete="new-password" />
```
