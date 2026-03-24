> Source: [GridView.ts](../../../projects/xaml-ui/src/lib/collections/GridView.ts)

# GridView

Grid-based collection display with single selection and animations. Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `MaximumRowsOrColumns` | `number` | `2` | Maximum items per row (or column, depending on Orientation) |
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Flow direction |

## Inherited Properties

- From [Selector](../primitives/Selector.md): `ItemSource`, `SelectedIndex`, `SelectedValue`, `SelectedItem`, `DisplayMemberPath`, `SelectedValuePath`, `IsEnabled`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `ItemTemplate`
- Outputs: `SelectedIndexChange`, `SelectedValueChange`, `SelectedItemChange`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `MaxHeight`, `Margin`, `Padding`, etc.

## Example

```html
<GridView [ItemSource]="items()" [MaximumRowsOrColumns]="3" MaxHeight="400px">
  <ng-template let-item>
    <StackPanel Spacing="3px" Padding="6px">
      <Image [Source]="item.Thumbnail" Width="100px" Height="100px" />
      <TextBlock [Text]="item.Name" HorizontalAlignment="Center" />
    </StackPanel>
  </ng-template>
</GridView>
```
