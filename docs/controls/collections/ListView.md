# ListView

> Source: [ListView.ts](../../../projects/xaml-ui/src/lib/collections/ListView.ts)

Scrollable list with single selection, item templates, and enter/leave animations. Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

None beyond [Selector](../primitives/Selector.md). ListView adds a ScrollViewer and StackPanel internally.

## Inherited Properties

- From [Selector](../primitives/Selector.md): `ItemSource`, `SelectedIndex`, `SelectedValue`, `SelectedItem`, `DisplayMemberPath`, `SelectedValuePath`, `IsEnabled`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `ItemTemplate`
- Outputs: `SelectedIndexChange`, `SelectedValueChange`, `SelectedItemChange`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `MaxHeight`, `Margin`, `Padding`, etc.

## Features

- Built-in ScrollViewer for vertical scrolling
- Items animate in/out (500ms fade/slide)
- Selected item gets `.selected` CSS class with accent highlight
- Click on item selects it

## Examples

**Simple list:**

```html
<ListView [ItemSource]="items()" [(SelectedValue)]="selectedId"
          SelectedValuePath="Id" MaxHeight="300px" />
```

**With custom item template:**

```html
<ListView [ItemSource]="items()" SelectedValuePath="Id"
          [(SelectedValue)]="selectedId" MaxHeight="300px"
          HorizontalContentAlignment="Stretch">
  <ng-template let-item>
    <Grid ColumnDefinitions="1fr auto" ColumnSpacing="12px">
      <TextBlock [Text]="item.Name" />
      <TextBlock [Text]="item.Detail" Class="DetailTextBlockStyle" FontStyle="Italic" />
    </Grid>
  </ng-template>
</ListView>
```

**With context menu on items:**

```html
<ListView [ItemSource]="tasks()" SelectedValuePath="Id"
          [(SelectedValue)]="selectedTask" HorizontalContentAlignment="Stretch">
  <ng-template let-item>
    <CheckBox [IsChecked]="item.IsComplete" (IsCheckedChange)="ToggleTask(item.Id)">
      <Grid RowDefinitions="auto auto" ColumnDefinitions="1fr auto" Margin="0 0 0 6px" Orientation="Vertical">
        <TextBlock [Text]="item.Title" TextWrapping="NoWrap" TextTrimming="CharacterEllipsis" />
        <TextBlock [Text]="item.Description" Class="DetailTextBlockStyle" FontStyle="Italic" />
        <FontIcon Grid-RowSpan="2" [Glyph]="IconForPriority(item)" FontSize="15pt" VerticalAlignment="Center" />
      </Grid>
    </CheckBox>
    <MenuFlyout ItemFlyout>
      <MenuFlyoutItem Text="Edit" Icon="&#xE70F;" (Click)="OnEdit(item)" />
      <MenuFlyoutItem Text="Delete" Icon="&#xE74D;" (Click)="OnDelete(item.Id)" />
    </MenuFlyout>
  </ng-template>
</ListView>
```

**Empty state:**

```html
<Border Class="BorderedControlStyle">
  <ListView [ItemSource]="items()" ... />
  <TextBlock *ngIf="items().length === 0" Text="No items available."
             HorizontalAlignment="Center" Margin="36px" />
</Border>
```
