> Source: [StackPanel.ts](../../../projects/xaml-ui/src/lib/layout/StackPanel.ts)

# StackPanel

Arranges children sequentially in a row or column. Uses CSS Grid with auto-flow. Extends [Panel](Panel.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Vertical'` | Stack direction |
| `Spacing` | `string` | — | Gap between children (CSS gap) |

## Inherited Properties

- From [Panel](Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Implementation

- Vertical: `grid-auto-flow: row; grid-auto-rows: min-content`
- Horizontal: `grid-auto-flow: column; grid-auto-columns: min-content`
- All children are sized to their content by default.

## Examples

**Vertical stack (default):**

```html
<StackPanel Spacing="6px">
  <TextBlock Text="Title" Class="HeaderTextBlockStyle" />
  <TextBox [(Text)]="name" />
  <Button (Click)="onSave()">Save</Button>
</StackPanel>
```

**Horizontal stack:**

```html
<StackPanel Orientation="Horizontal" Spacing="6px">
  <TextBox PlaceholderText="Name" [(Text)]="name" Width="200px" />
  <Button [IsEnabled]="name !== ''" (Click)="onSave()">
    <FontIcon Glyph="&#xE74E;" />
  </Button>
</StackPanel>
```

**As a section with panel styling:**

```html
<StackPanel Padding="3px" CornerRadius="6px" Orientation="Horizontal" Background="var(--ControlFillColorDefault)">
  <FontIcon Glyph="&#xE8B2;" Foreground="Red" />
  <TextBlock [Text]="statusText" />
</StackPanel>
```
