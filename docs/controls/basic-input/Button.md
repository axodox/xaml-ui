# Button

> Source: [Button.ts](../../../projects/xaml-ui/src/lib/basic-input/Button.ts)

Clickable button control. Supports text content, child content (icons, etc.), and embedded flyouts. Extends [Border](../layout/Border.md) → [Panel](../layout/Panel.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsEnabled` | `boolean` | `true` | Enabled state. When false, adds `.disabled` class and ignores clicks. |
| `Content` | `string` | — | Text content. When set, renders a TextBlock instead of `<ng-content>`. |
| `HorizontalContentAlignment` | `HorizontalAlignment` | `'Center'` | Horizontal content justify |
| `VerticalContentAlignment` | `VerticalAlignment` | `'Center'` | Vertical content align |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Emitted on click (only when enabled) |

## Inherited Properties

- From [Panel](../layout/Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## CSS Classes

Apply via `Class="..."` attribute:

| Class | Description |
|---|---|
| `AccentButtonStyle` | Accent-colored background (highlighted/primary action) |
| `InlineButtonStyle` | Transparent background, subtle hover effect (for toolbar icons) |
| `HyperlinkButtonStyle` | Transparent with accent-colored text (link style) |

## Flyout Integration

When a `<Flyout>` or `<MenuFlyout>` is placed as a child, it opens automatically on click:

```html
<Button Class="InlineButtonStyle" ToolTipService-ToolTip="Settings">
  <FontIcon Glyph="&#xE713;" />
  <Flyout Placement="Right">
    <SettingsPanel />
  </Flyout>
</Button>
```

While a flyout is open, the button gets the `.flyout-open` CSS class (which prevents hover/active style changes).

## Examples

**Simple text button:**

```html
<Button Content="Save" (Click)="onSave()" />
```

**Button with icon:**

```html
<Button (Click)="onAdd()" Class="InlineButtonStyle">
  <FontIcon Glyph="&#xE710;" />
</Button>
```

**Accent (primary) button:**

```html
<Button Class="AccentButtonStyle" (Click)="onConfirm()">Confirm</Button>
```

**Disabled button:**

```html
<Button [IsEnabled]="hasSelection" (Click)="onDelete()">Delete</Button>
```
