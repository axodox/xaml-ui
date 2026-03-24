> Source: [ComboBox.ts](../../../projects/xaml-ui/src/lib/basic-input/ComboBox.ts)

# ComboBox

Dropdown selection control. Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

Inherits all from [Selector](../primitives/Selector.md). No additional own properties.

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
