> Source: [ListBox.ts](../../../projects/xaml-ui/src/lib/collections/ListBox.ts)

# ListBox

List with single selection but no built-in ScrollViewer (unlike ListView). Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

None beyond [Selector](../primitives/Selector.md).

## Inherited Properties

- From [Selector](../primitives/Selector.md): `ItemSource`, `SelectedIndex`, `SelectedValue`, `SelectedItem`, `DisplayMemberPath`, `SelectedValuePath`, `IsEnabled`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `ItemTemplate`
- Outputs: `SelectedIndexChange`, `SelectedValueChange`, `SelectedItemChange`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## When to Use

Use ListBox when you manage scrolling yourself (e.g. inside a ScrollViewer) or when the list content is short enough to not need scrolling. Use [ListView](ListView.md) for the common case with built-in scrolling.

## Example

```html
<ListBox [ItemSource]="items" [(SelectedValue)]="selected" DisplayMemberPath="Name" />
```
