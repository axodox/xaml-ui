# TreeView

> Source: [TreeView.ts](../../../projects/xaml-ui/src/lib/collections/TreeView.ts)

A hierarchical list with nodes that expand and collapse, as WinUI's `TreeView` used with an items source. Extends [FrameworkElement](../FrameworkElement.md). Each item's children are read from `ChildrenMemberPath`; an item with no (or an empty) children array is a leaf.

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `ItemsSource` | `any[]` | `[]` | The root items |
| `ChildrenMemberPath` | `string` | `'Children'` | The property holding an item's children |
| `ItemTemplate` | `TemplateRef` | — | The template of an item's content; a `<ng-template let-item>` inside the TreeView does the same |
| `DisplayMemberPath` | `string` | — | The property shown as text when there is no template |
| `SelectionMode` | `'None' \| 'Single' \| 'Multiple'` | `'Single'` | How items are selected |
| `SelectedItem` | `any` | `null` | The selected item in `Single` mode (two-way) |
| `SelectedItems` | `any[]` | `[]` | The checked items in `Multiple` mode (two-way) |
| `ExpandedItems` | `any[]` | `[]` | The expanded nodes (two-way), so an owner can expand e.g. the matches of a search |
| `IsEnabled` | `boolean` | `true` | Enables or disables the tree |

| Output | Payload | Description |
|---|---|---|
| `SelectedItemChange` | `any` | `SelectedItem` changed |
| `SelectedItemsChange` | `any[]` | `SelectedItems` changed (a new array each time) |
| `ExpandedItemsChange` | `any[]` | `ExpandedItems` changed (a new array each time) |
| `ItemInvoked` | `any` | An item was clicked, or Enter pressed on it |
| `Expanding` | `any` | A node is being expanded by the user (chevron, →) or by `Expand()` |
| `Collapsed` | `any` | A node was collapsed by the user (chevron, ←) or by `Collapse()` |

`Expanding` and `Collapsed` are not raised when the owner sets `ExpandedItems`; watch `ExpandedItemsChange` for every change.

| Method | Description |
|---|---|
| `Expand(item)` | Expands a node, raising `Expanding` |
| `Collapse(item)` | Collapses a node, raising `Collapsed` |

Arrays are compared item by item, so setting an equal array is a no-op. The tree reads children when it is checked; to change the tree, give it a new `ItemsSource` array (the check states of `Multiple` mode are cached per `ItemsSource` and `SelectedItems`).

## Selection

- **Single:** a click or Space selects the item (the accent pill and the selected fill mark it).
- **Multiple:** every row has a [CheckBox](../basic-input/CheckBox.md); a click or Space toggles it, as WinUI: checking a node (unchecked or partly checked) selects its whole subtree, unchecking it clears the subtree; a node whose subtree is partly selected shows a dash. `SelectedItems` holds every checked node, in tree order: the leaves and the fully selected parents (with all their descendants). A node put in `SelectedItems` by its owner counts as fully selected, subtree included.
- **None:** items are only invoked.

## Accessibility and keyboard

The tree is a `tree` (with `aria-multiselectable` in Multiple mode), each node a `treeitem` with `aria-level`, `aria-expanded` (nodes with children) and `aria-selected` (Single) or `aria-checked` (`true`/`false`/`mixed`, Multiple); children are in a `group`. The tree is one tab stop (roving tabindex: the focused row, else the selected one, else the first). As WinUI: **↑/↓** move, **→** expands or moves to the first child, **←** collapses or moves to the parent, **Home/End** go to the first and last visible row, **Space** selects (Single) or toggles the check box (Multiple), **Enter** invokes. The check boxes are not tab stops and are hidden from assistive technology (the row carries the state).

## Look

Rows as [ListView](ListView.md)'s (28px, hover and selected fills, accent pill in Single mode), 16px indent per level, chevrons `\uE76C` (collapsed) / `\uE70D` (expanded).

## Examples

**Single selection with a template, expanded from a search:**

```html
<TextBox PlaceholderText="Search" (TextChange)="OnSearch($event)" />
<TreeView [ItemsSource]="orbat" [(SelectedItem)]="unit" [(ExpandedItems)]="expanded"
          (ItemInvoked)="OnOpen($event)">
  <ng-template let-item>
    <Grid ColumnDefinitions="auto 1fr" ColumnSpacing="8px">
      <FontIcon [Glyph]="item.Children ? groupGlyph : unitGlyph" />
      <TextBlock [Text]="item.Name" />
    </Grid>
  </ng-template>
</TreeView>
```

**Check boxes:**

```html
<TreeView [ItemsSource]="orbat" SelectionMode="Multiple" DisplayMemberPath="Name"
          [(SelectedItems)]="selectedUnits" />
```
