# CommandBar

> Source: [CommandBar.ts](../../../projects/xaml-ui/src/lib/menus-and-toolbars/CommandBar.ts)

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
| `IsTabStop` | `boolean` | `true` | Whether the button is in the tab order (WinUI's `IsTabStop`); it can still take the focus from code |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Emitted on click (only when enabled); a child `Flyout` / `MenuFlyout` opens too |

| Method | Description |
|---|---|
| `Focus()` | Moves the keyboard focus to the button. |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Keyboard and Accessibility

Like a custom-element [Button](../basic-input/Button.md#keyboard-and-accessibility): `role="button"`, a tab stop (`tabindex` `0`, `-1` with `IsTabStop` false, none when disabled), `aria-disabled` when disabled, **Enter** / **Space** click it, and keyboard focus shows WinUI's focus visual. The icon is `aria-hidden`, so `Text` is its name. With a flyout it has `aria-haspopup="true"` and `aria-expanded`.

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
