# CheckBox

> Source: [CheckBox.ts](../../../projects/xaml-ui/src/lib/basic-input/CheckBox.ts)

Toggle with a checkbox indicator: checked, unchecked or (optionally) indeterminate. Extends [Border](../layout/Border.md) → [Panel](../layout/Panel.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `IsChecked` | `boolean \| null` | `false` | `true` checked, `false` unchecked, `null` indeterminate (shown as a dash). `undefined` is treated as `false`. |
| `IsThreeState` | `boolean` | `false` | Whether a click cycles through the indeterminate state too |
| `IsTabStop` | `boolean` | `true` | Whether the box is in the tab order (WinUI's `IsTabStop`); a list or tree that moves the focus itself turns it off |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter<boolean \| null>` | Emitted when the user toggles the box (a click, or Space on its input); setting `IsChecked` from a binding raises nothing |

## Inherited Properties

- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Behavior

- **Toggle order** (WinUI's `ToggleButton`): unchecked → checked; checked → indeterminate when `IsThreeState`, otherwise unchecked; indeterminate → unchecked. So `IsThreeState` cycles unchecked, checked, indeterminate; a box set to `null` from code without `IsThreeState` goes to unchecked on the next click.
- **Keyboard and accessibility:** the native `<input type="checkbox">` is kept in the layout (transparent, spanning the control) instead of being hidden, so it takes the focus, has the checkbox role, its `checked` / `indeterminate` state and the content as its name, and **Space** toggles it. Keyboard focus shows WinUI's focus visual around the control. The drawn box is `aria-hidden`.

## Examples

**Simple checkbox:**

```html
<CheckBox [(IsChecked)]="isEnabled">
  <TextBlock>Enable feature</TextBlock>
</CheckBox>
```

**Three-state ("select all"):**

```html
<CheckBox [IsThreeState]="true" [(IsChecked)]="allSelected">Select all</CheckBox>
```

**In a list item template (one-way binding with event):**

```html
<CheckBox [IsChecked]="item.IsEnabled" (IsCheckedChange)="setItemEnabled(item.Id, $event)">
  <Grid ColumnDefinitions="1fr auto" Margin="0 0 0 6px">
    <TextBlock [Text]="item.Name" />
    <FontIcon [Glyph]="item.Icon" />
  </Grid>
</CheckBox>
```

Use the event's value: from the indeterminate state a click unchecks the box (WinUI's order), so the new state is not always the opposite of the old one.
