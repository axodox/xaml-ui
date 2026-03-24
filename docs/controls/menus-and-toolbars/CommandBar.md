> Source: [CommandBar.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/CommandBar.ts)

# CommandBar

Horizontal toolbar container for AppBarButton children. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

None beyond FrameworkElement.

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, etc.

## Example

```html
<CommandBar HorizontalAlignment="Center">
  <AppBarButton Text="Import" Icon="&#xE710;" (Click)="onImport()" />
  <AppBarButton Text="Create" Icon="&#xE909;" (Click)="onCreate()" />
  <AppBarButton Text="Delete" Icon="&#xE74D;" [IsEnabled]="hasSelection" (Click)="onDelete()" />
</CommandBar>
```

# AppBarButton

Toolbar button with icon and text label. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Text` | `string` | — | Button label text (displayed below icon) |
| `Icon` | `string` | — | Glyph code (e.g. `"&#xE710;"`) |
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Emitted on click |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Simple toolbar button:**

```html
<AppBarButton Text="Import" Icon="&#xE710;" (Click)="onImport()" />
```

**With tooltip:**

```html
<AppBarButton Text="Remove" Icon="&#xE74D;" [IsEnabled]="selectedId !== null"
              (Click)="onRemove()" ToolTipService-ToolTip="Remove the selected item" />
```

**With flyout:**

```html
<AppBarButton Text="Add" Icon="&#xE710;" (Click)="onAddClick()">
  <Flyout #addFlyout>
    <StackPanel Orientation="Horizontal" Spacing="6px">
      <TextBox PlaceholderText="Name" [(Text)]="newName" Width="200px" />
      <Button [IsEnabled]="newName !== ''" (Click)="onSave()">
        <FontIcon Glyph="&#xE74E;" />
      </Button>
    </StackPanel>
  </Flyout>
</AppBarButton>
```
