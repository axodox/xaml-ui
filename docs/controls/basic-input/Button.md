# Button

> Source: [Button.ts](../../../projects/xaml-ui/src/lib/basic-input/Button.ts)

Clickable button control. Supports text content, child content (icons, etc.), and embedded flyouts. Extends [Border](../layout/Border.md) → [Panel](../layout/Panel.md) → [FrameworkElement](../FrameworkElement.md).

Selectors: `Button` and `XamlButton`. `<Button>` is a native `<button>` element (HTML tag names are case-insensitive), which cannot be self-closed in an Angular template; `<XamlButton>` is the same control as a custom element, for where a self-closed tag is wanted:

```html
<XamlButton Content="OK" (Click)="onOk()" />
```

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsEnabled` | `boolean` | `true` | Enabled state. When false, adds `.disabled` class and ignores clicks. |
| `Content` | `string` | — | Text content. When set, renders a TextBlock before the `<ng-content>`. |
| `Flyout` | `FlyoutBaseComponent` | — | A `Flyout` or `MenuFlyout` to open on click when it is not inside the button (WinUI's `Button.Flyout`). Takes precedence over a child flyout. |
| `IsTabStop` | `boolean` | `true` | Whether the button is in the tab order (WinUI's `IsTabStop`). When false it gets `tabindex="-1"`: it can still take the focus from code. |
| `HorizontalContentAlignment` | `HorizontalAlignment` | `'Center'` | Horizontal content justify |
| `VerticalContentAlignment` | `VerticalAlignment` | `'Center'` | Vertical content align |

| Output | Type | Description |
|---|---|---|
| `Click` | `EventEmitter` | Emitted on click (only when enabled) |

| Method | Description |
|---|---|
| `Focus()` | Moves the keyboard focus to the button. |

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

## Keyboard and Accessibility

- A native `<Button>` gets `type="button"` and keeps the browser's own focus, role and keys.
- Buttons that are custom elements (`XamlButton` and the derived [DropDownButton](DropDownButton.md), [ToggleButton](ToggleButton.md), [HyperlinkButton](HyperlinkButton.md), [RepeatButton](RepeatButton.md)) behave like the native one: `role="button"`, `tabindex="0"` (`-1` with `IsTabStop` false, none when disabled), `aria-disabled="true"` when disabled. **Enter** clicks at once, **Space** when it is released.
- Keyboard focus shows WinUI's focus visual (a 2px `--FocusStrokeColorOuter` outline around a 1px `--FocusStrokeColorInner` ring), only for `:focus-visible`, not for a pointer click.
- With a flyout (child or `Flyout` input) the button has `aria-haspopup="true"` and `aria-expanded` following the flyout's `IsOpen`.

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

A flyout declared elsewhere can be attached with the `Flyout` input. It is positioned against its own host element unless its `Target` is set:

```html
<XamlButton Content="Filter" [Flyout]="filterFlyout" />
<Flyout #filterFlyout>...</Flyout>
```

While a flyout is open, the button gets the `.flyout-open` CSS class (which prevents hover/active style changes).

## Examples

**Simple text button:**

```html
<Button (Click)="onSave()">Save</Button>
<XamlButton Content="Save" (Click)="onSave()" />
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

**Not in the tab order:**

```html
<Button [IsTabStop]="false" (Click)="onHelp()">Help</Button>
```
