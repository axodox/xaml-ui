# RadioButton / RadioButtonGroup

> Source: [RadioButton.ts](../../../projects/xaml-ui/src/lib/basic-input/RadioButton.ts)

Mutually exclusive selection controls. RadioButton extends [Border](../layout/Border.md). RadioButtonGroup extends [StackPanel](../layout/StackPanel.md).

## RadioButtonGroup

Container that manages single-selection among its RadioButton children.

| Input | Type | Default | Description |
|---|---|---|---|
| `Value` | `any` | — | Currently selected value |

| Output | Type | Description |
|---|---|---|
| `ValueChange` | `EventEmitter<any>` | Emitted when selection changes |

Inherits [StackPanel](../layout/StackPanel.md) properties: `Orientation`, `Spacing`, etc.

## RadioButton

Individual radio option within a group.

| Input | Type | Default | Description |
|---|---|---|---|
| `Value` | `any` | — | The value this option represents |
| `Group` | `string` | `""` | Radio group name (for HTML grouping) |
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `IsChecked` | `boolean` | `false` | Checked state |

| Output | Type | Description |
|---|---|---|
| `IsCheckedChange` | `EventEmitter` | Emitted when checked state changes |

Inherits [Panel](../layout/Panel.md) and [FrameworkElement](../FrameworkElement.md) properties.

## Example

```html
<RadioButtonGroup [(Value)]="selectedMode" Spacing="6px">
  <RadioButton [Value]="'Option1'">Option 1</RadioButton>
  <RadioButton [Value]="'Option2'">Option 2</RadioButton>
  <RadioButton [Value]="'Option3'" [IsEnabled]="false">Option 3 (disabled)</RadioButton>
</RadioButtonGroup>
```
