# MenuFlyout

> Source: [MenuFlyout.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/MenuFlyout.ts)

A menu of commands and options, opened from a button or as a context menu. Closes when an enabled item is chosen. Extends [Flyout](../dialogs-and-flyouts/Flyout.md).

## Own Properties

None beyond [Flyout](../dialogs-and-flyouts/Flyout.md). MenuFlyout adds the menu's keyboard, focus and close behavior below, and always uses the default (non-sliding) transition.

## Inherited Properties

- From [Flyout](../dialogs-and-flyouts/Flyout.md): `Placement` (with its fallback order), `ShowMode`, `Padding`, `HasBackdrop`, `Target`, `IsOpen`, `IsOpenChange`
- Methods: `Show()`, `Hide()`

## Directives

| Directive | Selector | Description |
|---|---|---|
| `ContextFlyout` | `[ContextFlyout]` | Shows the menu on right-click of its parent element, at the pointer (`BottomEdgeAlignedLeft`); a second right-click closes it. Inside a Button, a click opens it too |
| `ItemFlyout` | `[ItemFlyout]` | Inside an `<ng-template let-item>` — shows menu on right-click of that list item |

## Children

- [MenuFlyoutItem](MenuFlyoutItem.md) — clickable menu option
- [ToggleMenuFlyoutItem](MenuFlyoutItem.md#togglemenuflyoutitem) — option turned on or off (check mark)
- [RadioMenuFlyoutItem](MenuFlyoutItem.md#radiomenuflyoutitem) — one of a group of exclusive options (bullet)
- [MenuFlyoutSeparator](MenuFlyoutItem.md) — horizontal divider

## Keyboard and focus

The presenter has the `menu` role and takes the focus when the menu opens. Opened from the keyboard (the element that opened it had the keyboard focus, `:focus-visible`), the first enabled item takes it instead. Keys as in WinUI:

| Key | Action |
|---|---|
| **↓** / **↑** | Next / previous enabled item, wrapping around |
| **Home** / **End** | First / last enabled item |
| **Enter** / **Space** | Chooses the focused item (clicks it) |
| **Esc** | Closes the menu |
| **Tab** | Closes the menu |

When the menu closes, the focus goes back to the element that had it when it opened (see [Flyout](../dialogs-and-flyouts/Flyout.md#focus-and-keyboard)). With the mouse, the focus follows the pointer over the enabled items.

## Closing

Choosing an enabled item (click, **Enter** or **Space**) closes the menu. A click on a disabled item, a header, a separator or the menu's padding leaves it open. Items are found by their role (`menuitem`, `menuitemcheckbox`, `menuitemradio`) and `aria-disabled`, so custom items that set them behave the same.

## Examples

**Context menu inside a Button:**

```html
<Button Class="InlineButtonStyle" ToolTipService-ToolTip="Filter">
  <FontIcon Glyph="&#xE71C;" />
  <MenuFlyout ContextFlyout>
    <ToggleMenuFlyoutItem Text="Active items" [(IsChecked)]="showActive" />
    <ToggleMenuFlyoutItem Text="Archived items" [(IsChecked)]="showArchived" />
    <MenuFlyoutSeparator />
    <MenuFlyoutItem Text="Reset filters" (Click)="OnResetFilters()" />
  </MenuFlyout>
</Button>
```

**Context menu on list items (right-click):**

```html
<ListView [ItemSource]="items()" SelectedValuePath="Id">
  <ng-template let-item>
    <TextBlock [Text]="item.Name" />
    <MenuFlyout ItemFlyout>
      <MenuFlyoutItem Text="Edit" Icon="&#xE70F;" (Click)="onEdit(item)" />
      <MenuFlyoutItem Text="Delete" Icon="&#xE74D;" [IsEnabled]="canDelete(item)" (Click)="onDelete(item.Id)" />
    </MenuFlyout>
  </ng-template>
</ListView>
```

**With explicit placement:**

```html
<MenuFlyout Placement="RightEdgeAlignedTop">
  <MenuFlyoutItem Text="Option A" (Click)="onA()" />
  <MenuFlyoutItem Text="Option B" (Click)="onB()" />
</MenuFlyout>
```
