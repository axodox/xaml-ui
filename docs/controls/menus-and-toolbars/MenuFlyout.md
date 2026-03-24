> Source: [MenuFlyout.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/MenuFlyout.ts)

# MenuFlyout

Context menu flyout. Auto-closes when a menu item is clicked. Extends [Flyout](../dialogs-and-flyouts/Flyout.md).

## Own Properties

None beyond [Flyout](../dialogs-and-flyouts/Flyout.md). MenuFlyout adds auto-close behavior on item click.

## Inherited Properties

- From [Flyout](../dialogs-and-flyouts/Flyout.md): `Placement`, `Padding`, `HasBackdrop`, `IsOpen`, `IsOpenChange`
- Methods: `Show()`, `Hide()`

## Directives

| Directive | Selector | Description |
|---|---|---|
| `ContextFlyout` | `[ContextFlyout]` | Inside a Button — shows menu on click |
| `ItemFlyout` | `[ItemFlyout]` | Inside an `<ng-template let-item>` — shows menu on right-click of that list item |

## Children

- [MenuFlyoutItem](MenuFlyoutItem.md) — clickable menu option
- [ToggleMenuFlyoutItem](MenuFlyoutItem.md) — toggleable menu option
- [MenuFlyoutSeparator](MenuFlyoutItem.md) — horizontal divider

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
