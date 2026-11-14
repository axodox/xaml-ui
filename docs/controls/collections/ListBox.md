# ListBox

> Source: [ListBox.ts](../../../projects/xaml-ui/src/lib/collections/ListBox.ts)

List with single selection but no built-in ScrollViewer (unlike ListView). Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

None beyond [Selector](../primitives/Selector.md).

## Inherited Properties

- From [Selector](../primitives/Selector.md): `ItemSource`, `SelectedIndex`, `SelectedValue`, `SelectedItem`, `DisplayMemberPath`, `SelectedValuePath`, `IsEnabled`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `ItemTemplate`
- Outputs: `SelectedIndexChange`, `SelectedValueChange`, `SelectedItemChange`, `ItemClick`
- Methods: `FocusItem(index)`, `GetElement(index)`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Features

- Click on item selects it and raises `ItemClick`
- Keyboard: the list is one tab stop (`listbox` role, rows have the `option` role and `aria-selected`); arrow keys, Home and End move the focus and the selection, Enter/Space click the row. See [Selector](../primitives/Selector.md#keyboard-and-accessibility). `FocusItem(index)` moves the focus to a row from code.

## When to Use

Use ListBox when you manage scrolling yourself (e.g. inside a ScrollViewer) or when the list content is short enough to not need scrolling. Use [ListView](ListView.md) for the common case with built-in scrolling.

## Example

```html
<ListBox [ItemSource]="items" [(SelectedValue)]="selected" DisplayMemberPath="Name" />
```
