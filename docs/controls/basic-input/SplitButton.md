# SplitButton

> Source: [SplitButton.ts](../../../projects/xaml-ui/src/lib/basic-input/SplitButton.ts)

Button split into a main clickable area and a dropdown section (the arrow). Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsEnabled` | `boolean` | `true` | Enabled state of both parts |
| `DropDownLabel` | `string` | `'More options'` | Accessible name (`aria-label`) of the arrow part (WinUI's *More options*) |
| `HorizontalContentAlignment` | `HorizontalAlignment` | `'Center'` | Horizontal alignment of the main part's content |
| `VerticalContentAlignment` | `VerticalAlignment` | `'Center'` | Vertical alignment of the main part's content |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | The main part was clicked |
| `DropDownClick` | `EventEmitter<Event>` | The arrow was clicked, with or without a flyout. The event's `currentTarget` is the arrow, so the owner can open a menu of its own at it. |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Behavior

- The main part is a [Button](Button.md); the arrow is a [DropDownButton](DropDownButton.md) that opens the `Flyout` or `MenuFlyout` placed inside the SplitButton and raises `DropDownClick`.
- Both parts are tab stops: **Enter** / **Space** on the arrow open the flyout. The arrow has `aria-haspopup` / `aria-expanded` when there is a flyout.

## Examples

**With a menu:**

```html
<SplitButton (Click)="onDefaultAction()" VerticalAlignment="Center">
  <FontIcon Glyph="&#xE710;" />
  <MenuFlyout>
    <MenuFlyoutItem Text="Action A" (Click)="onA()" />
    <MenuFlyoutItem Text="Action B" (Click)="onB()" />
  </MenuFlyout>
</SplitButton>
```

**Without a flyout (the owner reacts to the arrow):**

```html
<SplitButton DropDownLabel="Choose another role" (Click)="onApprove()" (DropDownClick)="openRoleMenu($event)">Approve</SplitButton>
```
