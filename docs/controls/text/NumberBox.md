# NumberBox

> Source: [NumberBox.ts](../../../projects/xaml-ui/src/lib/text/NumberBox.ts)

Numeric input control with increment/decrement spin buttons, keyboard support, and value clamping. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Value` | `number` | `NaN` | Current numeric value, clamped to `Minimum`..`Maximum`. `NaN` means no value (empty box) |
| `InputMode` | `'Float' \| 'Integer'` | `'Float'` | `'Integer'` rounds typed values; also sets the input's `inputmode` (`numeric` / `decimal`) |
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
| `AutomationProperties-Name` | `string` | — | Accessible name of the input (`aria-label`), as WinUI's `AutomationProperties.Name`; use it when no visible label names the box |

| Output | Type | Description |
|---|---|---|
| `ValueChange` | `EventEmitter<number>` | Emitted when value changes |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Text Input

The typed text is committed on `change` (Enter or leaving the box), as WinUI's NumberBox with `ValidationMode` `InvalidInputOverwritten`:

- Text that is not a number (`abc`, `12abc`, `1,000.5`) puts the last value back; `Value` does not change.
- Empty text clears the value to `NaN`.
- A decimal comma is read as a point when the text has no point (`2,5` → `2.5`). Leading and trailing spaces are ignored.
- The committed value is shown clamped and formatted (`500` with `Maximum` 120 shows `120`), also when `Value` did not change.

`NumberBoxComponent.parse(text)` exposes the parsing: a number, `NaN` for empty text, `undefined` for text that is not a number.

## Accessibility

The input has the `spinbutton` role with `aria-valuenow` (omitted while the value is `NaN`), `aria-valuemin` and `aria-valuemax` (omitted for infinite bounds), and `aria-label` from `AutomationProperties-Name`.

## Keyboard Support

| Key | Action |
|---|---|
| ArrowUp | +SmallChange |
| ArrowDown | -SmallChange |
| PageUp | +LargeChange |
| PageDown | -LargeChange |

## Spin Buttons

`SpinButtonPlacementMode` controls how increment/decrement controls are exposed:

- `'Compact'` (default) — a single icon-button on the left of the input acts as the trigger; focusing the input opens a `Transient` [Flyout](../dialogs-and-flyouts/Flyout.md) containing the increment/decrement [RepeatButton](../basic-input/RepeatButton.md)s. The focus and the keys stay in the input (the spin buttons are not tab stops). The flyout dismisses when focus leaves the input.
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

**Named box without a visible label:**

```html
<NumberBox [(Value)]="minutes" [Minimum]="0" [Maximum]="120" Unit="min" AutomationProperties-Name="Time budget" />
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
