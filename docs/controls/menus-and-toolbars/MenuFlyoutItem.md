# MenuFlyoutItem

> Source: [MenuFlyoutItem.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/MenuFlyoutItem.ts)

Clickable item inside a MenuFlyout. Extends MenuFlyoutItemBase → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Text` | `string` | `''` | Menu item text |
| `Icon` | `string` | — | Glyph code for icon (e.g. `"&#xE70F;"`) |
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Emitted on click |

## Example

```html
<MenuFlyoutItem Text="Delete" Icon="&#xE74D;" [IsEnabled]="canDelete" (Click)="onDelete()" />
```

# ToggleMenuFlyoutItem

Toggleable item inside a MenuFlyout. Extends MenuFlyoutItemBase → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Text` | `string` | `''` | Menu item text |
| `IsChecked` | `boolean` | `false` | Toggle state |
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter<boolean>` | Toggle state changed |

## Example

```html
<ToggleMenuFlyoutItem Text="Show labels" [(IsChecked)]="showLabels" />
```

# MenuFlyoutSeparator

Horizontal divider line between menu items. Extends MenuFlyoutItemBase.

## Example

```html
<MenuFlyout ContextFlyout>
  <MenuFlyoutItem Text="Edit" (Click)="onEdit()" />
  <MenuFlyoutSeparator />
  <MenuFlyoutItem Text="Delete" (Click)="onDelete()" />
</MenuFlyout>
```
