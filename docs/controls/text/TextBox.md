# TextBox

> Source: [TextBox.ts](../../../projects/xaml-ui/src/lib/text/TextBox.ts)

Text input control. Renders as `<input>` when `TextWrapping="NoWrap"` (default) or `<textarea>` when `TextWrapping="Wrap"`. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Text` | `string` | — | Current text value |
| `PlaceholderText` | `string` | `''` | Placeholder text |
| `IsPlaceholderEditable` | `boolean` | `false` | When true, placeholder becomes editable on focus |
| `IsEnabled` | `boolean` | `true` | Enabled state |
| `TextAlignment` | `'Left' \| 'Center' \| 'Right' \| 'Justify'` | `'Left'` | Text alignment |
| `TextWrapping` | `'NoWrap' \| 'Wrap'` | `'NoWrap'` | NoWrap = single-line `<input>`, Wrap = multi-line `<textarea>` |
| `UpdateTrigger` | `'PropertyChanged' \| 'LostFocus'` | `'PropertyChanged'` | When to emit changes |
| `Pattern` | `string` | — | Regex pattern for input validation |

| Output | Type | Description |
|---|---|---|
| `TextChange` | `EventEmitter<string>` | Emitted when text changes |

## Methods

| Method | Description |
|---|---|
| `Focus()` | Programmatically focus the input |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Simple text input:**

```html
<TextBox [(Text)]="name" PlaceholderText="Enter name" Width="200px" />
```

**With keydown handler:**

```html
<TextBox [(Text)]="searchTerm" PlaceholderText="Search..." (keydown)="onKeyDown($event)" #searchBox />
```

**Multi-line:**

```html
<TextBox [(Text)]="description" TextWrapping="Wrap" Height="100px" />
```

**With ViewChild focus:**

```typescript
@ViewChild('searchBox') private _searchBox!: TextBoxComponent;
protected onOpen() { this._searchBox.Focus(); }
```
