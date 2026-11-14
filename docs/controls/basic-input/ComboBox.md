# ComboBox

> Source: [ComboBox.ts](../../../projects/xaml-ui/src/lib/basic-input/ComboBox.ts)

Dropdown selection control. Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsTextSearchEnabled` | `boolean` | `true` | Type-ahead selection |
| `PlaceholderText` | `string` | `''` | Text shown while no item is selected |

Inherits all from [Selector](../primitives/Selector.md).

## Inherited Properties (from Selector)

| Input | Type | Default | Description |
|---|---|---|---|
| `ItemSource` | `any[]` | — | Array of items to display |
| `SelectedIndex` | `number` | `-1` | Index of selected item |
| `SelectedValue` | `any` | — | Selected value (via SelectedValuePath) |
| `SelectedItem` | `any` | — | Selected item object |
| `DisplayMemberPath` | `string` | — | Property name to display as text |
| `SelectedValuePath` | `string` | — | Property name to use as value |
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `HorizontalContentAlignment` | `HorizontalAlignment` | `'Left'` | Content horizontal alignment |
| `VerticalContentAlignment` | `VerticalAlignment` | `'Center'` | Content vertical alignment |
| `ItemTemplate` | `TemplateRef` | — | Custom template for items |

| Output | Type | Description |
|---|---|---|
| `SelectedIndexChange` | `EventEmitter<number>` | Index changed |
| `SelectedValueChange` | `EventEmitter<any>` | Value changed |
| `SelectedItemChange` | `EventEmitter<any>` | Item changed |

## Behavior

- The ComboBox itself is the tab stop (its inner DropDownButton is not). Typed characters select the first item whose display text contains them (a pause of 1 s starts a new search); Enter and Esc close the open list.
- The list opens in a `Transient` [Flyout](../dialogs-and-flyouts/Flyout.md): the focus and the keys stay with the ComboBox. Clicking an item selects it and closes the list.
- Selection follows [Selector](../primitives/Selector.md#selection-and-binding-updates): when `ItemSource` and `SelectedValue` change in the same binding update, in either order, the new value is kept; the change outputs are raised right after the update. `SelectedItem` matches by reference.

## Inherited from FrameworkElement

`Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, etc.

## Examples

**Simple enum selector:**

```html
<ComboBox [ItemSource]="enumValues" [(SelectedValue)]="unitMode" HorizontalAlignment="Stretch" />
```

**With display/value paths:**

```html
<ComboBox [ItemSource]="countries" [(SelectedValue)]="selectedCountryId"
          DisplayMemberPath="Name" SelectedValuePath="Id" />
```

**List and value changing together** (picking a category replaces the rule list and picks its first rule; the rule box shows it):

```html
<ComboBox [ItemSource]="categories" DisplayMemberPath="Name" SelectedValuePath="Id"
          [SelectedValue]="category.Id" (SelectedValueChange)="onCategory($event)" />
<ComboBox [ItemSource]="category.Rules" [(SelectedValue)]="rule" DisplayMemberPath="Name" SelectedValuePath="Id" />
```

**With custom template:**

```html
<ComboBox [ItemSource]="items" [(SelectedItem)]="selectedItem">
  <ng-template let-item>
    <StackPanel Orientation="Horizontal" Spacing="6px">
      <FontIcon [Glyph]="item.Icon" />
      <TextBlock [Text]="item.Name" />
    </StackPanel>
  </ng-template>
</ComboBox>
```
