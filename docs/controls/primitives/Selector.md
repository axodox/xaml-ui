> Source: [Selector.ts](../../../projects/xaml-ui/src/lib/primitives/Selector.ts)

# Selector

Abstract base class for collection controls (ListView, ListBox, GridView, ComboBox). Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `ItemSource` | `any[]` | — | Array of data items |
| `SelectedIndex` | `number` | `-1` | Index of selected item |
| `SelectedValue` | `any` | — | Selected value (matched via SelectedValuePath) |
| `SelectedItem` | `any` | — | Selected item object reference |
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
