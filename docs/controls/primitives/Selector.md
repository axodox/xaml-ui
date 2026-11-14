# Selector

> Source: [Selector.ts](../../../projects/xaml-ui/src/lib/primitives/Selector.ts)

Abstract base class for collection controls (ListView, ListBox, GridView, ComboBox). Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `ItemSource` | `any[]` | — | Array of data items |
| `SelectedIndex` | `number` | `-1` | Index of selected item |
| `SelectedValue` | `any` | — | Selected value (matched via SelectedValuePath, with `==`) |
| `SelectedItem` | `any` | — | Selected item, matched by reference (`indexOf`) |
| `DisplayMemberPath` | `string` | — | Property name to display as text |
| `SelectedValuePath` | `string` | — | Property name to use as the value for selection |
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `HorizontalContentAlignment` | `HorizontalAlignment` | `'Left'` | Horizontal content alignment |
| `VerticalContentAlignment` | `VerticalAlignment` | `'Center'` | Vertical content alignment |
| `ItemTemplate` | `TemplateRef<any>` | — | Custom template for rendering items |

| Output | Type | Description |
|---|---|---|
| `SelectedIndexChange` | `EventEmitter<number>` | Index changed |
| `SelectedValueChange` | `EventEmitter<any>` | Value changed |
| `SelectedItemChange` | `EventEmitter<any>` | Item object changed |
| `ItemClick` | `EventEmitter<number>` | Index of a row that was clicked (or activated with Enter/Space), also when it was already selected |

| Method | Description |
|---|---|
| `FocusItem(index)` | Moves the keyboard focus to a row and scrolls it into view |
| `GetElement(index)` | The row element at `index`, or `null` |

## Selection and Binding Updates

- When `ItemSource` changes, the selection is kept if the new list has an item with the same value; otherwise it is cleared.
- A list and a value changing in the same binding update keep the choice, in either order: a `SelectedValue` the current list lacks waits for the list. If the list still lacks it once the update is done, the selection is cleared.
- Within such an update the change outputs are raised once, right after the update (a microtask), outside change detection, so a two-way binding may feed the new value back into the bindings that set the list. Other selection changes (a click, a value the list has) are raised at once.

```html
<!-- Picking a category sets category (new Rules list) and rule (its first rule) together; the rule box keeps it. -->
<ComboBox [ItemSource]="categories" DisplayMemberPath="Name" SelectedValuePath="Id"
          [SelectedValue]="category.Id" (SelectedValueChange)="onCategory($event)" />
<ComboBox [ItemSource]="category.Rules" [(SelectedValue)]="rule" DisplayMemberPath="Name" SelectedValuePath="Id" />
```

## Keyboard and Accessibility

ListView, ListBox and GridView:

- The host has the `listbox` role, each row the `option` role with `aria-selected`.
- The list is one tab stop: the focused row (else the selected one, else the first) has `tabindex="0"`, the others `-1`.
- Arrow keys (Down/Right, Up/Left), Home and End move the focus and the selection with it, as in WinUI's ListView.
- Enter and Space click the focused row (select it and raise `ItemClick`).
- A keyboard-focused row shows the focus visual. A disabled list has no tab stop and ignores keys.

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Item Templates

Use `<ng-template let-item>` to define custom item rendering:

```html
<ListView [ItemSource]="items">
  <ng-template let-item>
    <TextBlock [Text]="item.Name" />
  </ng-template>
</ListView>
```

When no template is provided, items are displayed using `DisplayMemberPath` or `toString()`.

## Subclasses

- [ListView](../collections/ListView.md) — scrollable list
- [ListBox](../collections/ListBox.md) — list without scroll
- [GridView](../collections/GridView.md) — grid layout
- [ComboBox](../basic-input/ComboBox.md) — dropdown
