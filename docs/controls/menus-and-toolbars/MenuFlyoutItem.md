# MenuFlyoutItem

> Source: [MenuFlyoutItem.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/MenuFlyoutItem.ts)

A command inside a [MenuFlyout](MenuFlyout.md). Shows an icon, its text and, on the right, a note and its keyboard accelerator; its cells line up with the other items' in the menu. Extends MenuFlyoutItemBase (not a [FrameworkElement](../FrameworkElement.md)).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Text` | `string` | `''` | Menu item text |
| `Icon` | `string` | — | Glyph code for icon (e.g. `"&#xE70F;"`) |
| `IsEnabled` | `boolean` | `true` | Enabled state. When false, the item is dimmed, has `aria-disabled="true"`, raises no `Click`, is skipped by the arrow keys and does not close the menu |
| `KeyboardAcceleratorTextOverride` | `string` | — | The keyboard accelerator's text, shown on the right (e.g. `"Ctrl+S"`), as in WinUI. Display only: it does not register the shortcut |
| `Note` | `string` | — | A dimmed, italic note on the right, before the accelerator (e.g. `".xlsx"`, or why the command is not available now) |
| `Foreground` | `string` | — | Colour of the item's icon and text (e.g. `"var(--SystemFillColorCritical)"` for a destructive command) |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Emitted on click, **Enter** or **Space** (only when enabled) |

| Method | Description |
|---|---|
| `Focus()` | Moves the keyboard focus to the item |

## Content Slots

| Attribute | Description |
|---|---|
| `Icon` | Content projected into the icon cell instead of a glyph (e.g. a coloured `FontIcon`) |
| `KeyboardAccelerator` | Content projected into the accelerator cell, after `Note` and `KeyboardAcceleratorTextOverride` |

## Accessibility

The item has the `menuitem` role and `tabindex="-1"`: it is reached with the menu's arrow keys, not with **Tab**. The icon cell is `aria-hidden`.

## Examples

```html
<MenuFlyoutItem Text="Save" Icon="&#xE74E;" KeyboardAcceleratorTextOverride="Ctrl+S" (Click)="onSave()" />
<MenuFlyoutItem Text="Export" Icon="&#xEDE1;" Note=".xlsx" (Click)="onExport()" />
<MenuFlyoutItem Text="Restore point" Note="nothing saved yet" [IsEnabled]="false" />
<MenuFlyoutItem Text="Delete" Icon="&#xE74D;" Foreground="var(--SystemFillColorCritical)" [IsEnabled]="canDelete" (Click)="onDelete()" />
```

**Custom icon and accelerator content:**

```html
<MenuFlyoutItem Text="Undo" (Click)="onUndo()">
  <FontIcon Icon Glyph="&#xE7A7;" Foreground="var(--SystemFillColorCaution)" />
  <TextBlock KeyboardAccelerator Text="⌃Z" />
</MenuFlyoutItem>
```

# ToggleMenuFlyoutItem

> Source: [ToggleMenuFlyoutItem.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/ToggleMenuFlyoutItem.ts)

A menu item that turns an option on or off; a check mark in the icon cell shows that it is on. Extends [MenuFlyoutItem](#menuflyoutitem), so it has `Text`, `IsEnabled`, `KeyboardAcceleratorTextOverride`, `Note`, `Foreground`, the `KeyboardAccelerator` slot and `Click` (its icon cell holds the check mark, so `Icon` is not shown).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsChecked` | `boolean` | `false` | Toggle state |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter<boolean>` | Toggle state changed |

A click, **Enter** or **Space** toggles `IsChecked`, then raises `Click` and the menu closes. The item has the `menuitemcheckbox` role and `aria-checked`.

## Example

```html
<ToggleMenuFlyoutItem Text="Show labels" [(IsChecked)]="showLabels" />
```

# RadioMenuFlyoutItem

> Source: [RadioMenuFlyoutItem.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/RadioMenuFlyoutItem.ts)

One of a group of mutually exclusive options in a menu (WinUI's `RadioMenuFlyoutItem`); a bullet in the icon cell shows the checked one. Extends [MenuFlyoutItem](#menuflyoutitem) like ToggleMenuFlyoutItem.

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `GroupName` | `string` | `''` | The group it belongs to. Checking an item unchecks the other items with the same `GroupName` (in any menu that exists at the time) |
| `IsChecked` | `boolean` | `false` | Checked state |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter<boolean>` | Checked state changed (also when another item of the group unchecks it) |

A click, **Enter** or **Space** checks the item (a checked item stays checked), then raises `Click` and the menu closes. The item has the `menuitemradio` role and `aria-checked`.

## Example

```html
<MenuFlyout>
  @for (size of sizes; track size) {
    <RadioMenuFlyoutItem GroupName="Size" [Text]="size" [IsChecked]="selectedSize === size" (Click)="selectedSize = size" />
  }
</MenuFlyout>
```

# MenuFlyoutSeparator

Horizontal divider line between menu items. Extends MenuFlyoutItemBase. A click on it leaves the menu open.

## Example

```html
<MenuFlyout ContextFlyout>
  <MenuFlyoutItem Text="Edit" (Click)="onEdit()" />
  <MenuFlyoutSeparator />
  <MenuFlyoutItem Text="Delete" (Click)="onDelete()" />
</MenuFlyout>
```
