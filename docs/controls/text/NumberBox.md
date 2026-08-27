# NumberBox

> Source: [NumberBox.ts](../../../projects/xaml-ui/src/lib/text/NumberBox.ts)

Numeric input control with increment/decrement spin buttons, keyboard support, and value clamping. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Value` | `number` | `NaN` | Current numeric value |
| `InputMode` | `'Float' \| 'Integer'` | `'Float'` | Parse mode for text input |
| `Minimum` | `number` | `-Infinity` | Minimum allowed value |
| `Maximum` | `number` | `Infinity` | Maximum allowed value |
| `SmallChange` | `number` | `1` | Increment for ArrowUp/Down and spin buttons |
| `LargeChange` | `number` | `10` | Increment for PageUp/Down |
| `Unit` | `string` | — | Suffix text (e.g. `"°"`, `"px"`, `"%"`) |
| `NumberFormatter` | `(value: number) => string` | `toString` | Custom display formatter |
| `SpinButtonPlacementMode` | `'None' \| 'Compact'` | `'Compact'` | Spin button placement (see [Spin Buttons](#spin-buttons)) |
| `PlaceholderText` | `string` | `''` | Placeholder when value is NaN |
| `IsPlaceholderEditable` | `boolean` | `false` | When true, placeholder becomes the value on focus |
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `TextAlignment` | `TextAlignment` | `'Right'` | Text alignment (defaults to right for numbers) |

| Output | Type | Description |
|---|---|---|
| `ValueChange` | `EventEmitter<number>` | Emitted when value changes |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Keyboard Support

| Key | Action |
|---|---|
| ArrowUp | +SmallChange |
| ArrowDown | -SmallChange |
| PageUp | +LargeChange |
| PageDown | -LargeChange |

## Spin Buttons

`SpinButtonPlacementMode` controls how increment/decrement controls are exposed:

- `'Compact'` (default) — a single icon-button on the left of the input acts as the trigger; focusing the input opens a flyout containing the increment/decrement [RepeatButton](../basic-input/RepeatButton.md)s. The flyout dismisses when focus leaves the input.
- `'None'` — no spin UI is rendered. Use this when a separate interaction (e.g. a dragger) drives the value. Keyboard support (`ArrowUp`/`Down`, `PageUp`/`Down`) is unaffected.

Inline placement (spin buttons always visible next to the input) is intentionally not implemented.

## Examples

**Float input with unit and formatter:**

```html
<NumberBox [(Value)]="temperature" InputMode="Float" [Minimum]="-40" [Maximum]="120"
           [SmallChange]="0.5" [LargeChange]="10" Unit="°C" [NumberFormatter]="FormatDecimal" />
```

```typescript
protected FormatDecimal(value: number) {
  return value.toFixed(2);
}
```

**With placeholder from computed signal:**

```html
<NumberBox [(Value)]="customPrice" [PlaceholderText]="defaultPrice()" [IsPlaceholderEditable]="true"
           InputMode="Float" [Minimum]="0" [Maximum]="9999" Unit="$" />
```

**Integer input:**

```html
<NumberBox [(Value)]="quantity" InputMode="Integer" [Minimum]="0" [Maximum]="100" />
```

**Precise decimal input:**

```html
<NumberBox InputMode="Float" [NumberFormatter]="FormatDecimal" [Minimum]="0" [Maximum]="100"
           [(Value)]="opacity" [SmallChange]="0.1" MinWidth="110px" Unit="%" />
```
