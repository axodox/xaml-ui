# DataGrid

> Source: [DataGrid.ts](../../../projects/xaml-ui/src/lib/collections/DataGrid.ts)

A table of items in rows and columns, like the Windows Community Toolkit's `DataGrid` (WinUI has none built in). Extends [FrameworkElement](../FrameworkElement.md). Columns are child components; all rows are laid out in one CSS grid (each row a subgrid), so cells line up whatever their content. The grid sits in a [ScrollViewer](../scrolling/ScrollViewer.md): it scrolls sideways when it is wider than its container, and down when it is given a `Height` or `MaxHeight` (the header row stays at the top).

Import the DataGrid and its columns together with `DataGridComponents`.

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `ItemsSource` | `any[]` | `[]` | The items, one per row |
| `HeadersVisibility` | `'Column' \| 'None'` | `'Column'` | Whether the column header row shows (there are no row headers) |
| `GridLinesVisibility` | `'None' \| 'Horizontal' \| 'Vertical' \| 'All'` | `'None'` | Lines between rows and/or columns (`--DividerStrokeColorDefault`) |
| `SelectionMode` | `'None' \| 'Single'` | `'Single'` | Whether a row can be selected (the Toolkit's `Extended` is not supported) |
| `SelectedItem` | `any` | `null` | The selected item (two-way) |
| `SelectedIndex` | `number` | `-1` | Its index (two-way) |
| `FrozenColumnCount` | `number` | `0` | 0 or 1: the first column stays in place when the grid scrolls sideways |
| `IsEnabled` | `boolean` | `true` | Enables or disables selection |

| Output | Payload | Description |
|---|---|---|
| `SelectedItemChange` | `any` | The selected item changed |
| `SelectedIndexChange` | `number` | Its index changed (also when the item moved in a new `ItemsSource`) |

The selection is stored as the item; the index is found from it. A selected item which is not in a new `ItemsSource` is deselected. Bind one of `SelectedItem` and `SelectedIndex` two-way, not both (each changes the other while the bindings are being checked).

## Columns

Common inputs (`DataGridColumn`):

| Input | Type | Default | Description |
|---|---|---|---|
| `Header` | `string` | — | The header text |
| `Width` | `string` | `'auto'` | A CSS grid track (`1fr`, `120px`, `minmax(80px, 1fr)`) or the Toolkit's forms: `Auto` / `auto` (as wide as the header and cells), `*` / `2*` (a share of the free width), a number of pixels |

A rich header is a template marked `DataGridColumnHeader` inside the column: `<ng-template DataGridColumnHeader>…</ng-template>`.

**`DataGridTextColumn`**

| Input | Type | Default | Description |
|---|---|---|---|
| `Binding` | `string` | — | The property shown; a dotted path reads nested properties (`Commander.Name`) |
| `TextWrapping` | `'NoWrap' \| 'Wrap'` | `'NoWrap'` | As in the Toolkit, text does not wrap by default; text which does not fit is clipped with an ellipsis |

**`DataGridTemplateColumn`**: the cell is the column's `<ng-template let-item>`.

## Accessibility and keyboard

The grid has the `grid` role with `aria-rowcount` and `aria-colcount`; rows are `row`s with `aria-rowindex` (and `aria-selected` when selectable), headers `columnheader`s and cells `gridcell`s with `aria-colindex`. When selectable, the rows are one tab stop (the selected row, else the first) and **↑/↓**, **Home/End** move the selection and the focus. Focus is on rows, not on cells as in the Toolkit.

## Look

A header row on a subtle fill with semibold text and a divider below; rows as [ListView](ListView.md)'s (hover and selected fills, an accent pill on the selected row's first cell); 32px rows with 12px cell padding. The sticky header and a frozen column are drawn over `--SolidBackgroundFillColorBase`, as they cover what scrolls under them; a grid placed on another surface may want that token overridden around it.

## Example

```html
<DataGrid MaxHeight="300px" [ItemsSource]="units" GridLinesVisibility="Horizontal" [FrozenColumnCount]="1"
          [(SelectedItem)]="selectedUnit">
  <DataGridTextColumn Header="Unit" Binding="Name" Width="200px" />
  <DataGridTextColumn Header="Commander" Binding="Commander.Name" />
  @for (phase of phases; track phase; let index = $index) {
    <DataGridTemplateColumn [Header]="phase" Width="120px">
      <ng-template let-item>
        <InfoBadge [class]="ReadinessClass(item.Phases[index])" />
      </ng-template>
    </DataGridTemplateColumn>
  }
  <DataGridTextColumn Binding="Remarks" Width="1fr" TextWrapping="Wrap">
    <ng-template DataGridColumnHeader><TextBlock Text="Remarks" FontStyle="Italic" /></ng-template>
  </DataGridTextColumn>
</DataGrid>
```
