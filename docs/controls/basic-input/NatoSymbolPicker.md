# NatoSymbolPicker

> Source: [NatoSymbolPicker.ts](../../../projects/xaml-ui/src/lib/basic-input/NatoSymbolPicker.ts)

A NATO military-symbol picker (a "unit generator") for **MIL-STD-2525C** SIDC codes,
built on [milsymbol](https://github.com/spatialillusions/milsymbol). It renders a live
symbol preview and edits the code through dropdowns for the basic fields, plus a manual
code field. The code and the dropdowns stay in two-way sync, and the preview reflects
validity. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Code` | `string` | `SFGP-----------` | The 15-character SIDC (padded with `-`). Two-way bindable. |
| `Size` | `number` | `40` | Preview symbol size passed to milsymbol. |

| Output | Type | Description |
|---|---|---|
| `CodeChange` | `EventEmitter<string>` | Emitted when the code changes (dropdown edit, manual code edit, or set). |

## Behaviour

- **Basic fields only** (matching the plan's scope): Coding scheme, Affiliation, Battle
  dimension, Status, Function (main icon, filtered by scheme + dimension), Modifier 1,
  Modifier 2. Style/amplifier settings are intentionally omitted.
- **Two-way sync**: editing a dropdown rebuilds the code; editing the manual code field (or
  setting `[Code]`) re-parses it into the dropdowns. Changing scheme/dimension resets the
  function to generic; setting a code preserves its function even if it isn't in the curated
  list (it's added as an ad-hoc entry so arbitrary codes round-trip).
- **Validation**: the code is validated with milsymbol's `isValid()`; invalid codes show a
  red preview border and an "Invalid symbol code" message.

## Data

The function-icon options live in [NatoSymbolData.ts](../../../projects/xaml-ui/src/lib/basic-input/NatoSymbolData.ts)
as a curated (not exhaustive) subset, keyed by coding scheme then battle dimension, and
validated against milsymbol. Extend `FUNCTION_ICONS` there as needed — any scheme/dimension
without curated entries falls back to a single generic icon.

## Example

```html
<NatoSymbolPicker Width="260px" [(Code)]="symbolCode"
                  (CodeChange)="onSymbolChange($event)" />
```

## Dependency

Requires the `milsymbol` package (declared as a dependency of `xaml-ui`).
