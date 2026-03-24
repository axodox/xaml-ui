# Grid

> Source: [Grid.ts](../../../projects/xaml-ui/src/lib/layout/Grid.ts)

CSS Grid layout container with XAML-style row and column definitions. Extends [Panel](Panel.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `ColumnDefinitions` | `string` | — | Maps to CSS `grid-template-columns` (e.g. `"auto 1fr auto"`, `"200px 1fr"`) |
| `RowDefinitions` | `string` | — | Maps to CSS `grid-template-rows` (e.g. `"auto auto 1fr"`) |
| `AutoColumnDefinition` | `string` | — | Maps to CSS `grid-auto-columns` (e.g. `"minmax(0, 1fr)"`) |
| `AutoRowDefinition` | `string` | — | Maps to CSS `grid-auto-rows` |
| `ColumnSpacing` | `string` | — | Maps to CSS `column-gap` (e.g. `"6px"`, `"12px"`) |
| `RowSpacing` | `string` | — | Maps to CSS `row-gap` |
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Controls grid auto-flow direction |

## Inherited Properties

- From [Panel](Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Grid Placement Directives

Place children in specific cells using these directives. **Indices are 0-based** (converted internally to 1-based CSS grid).

| Directive | Type | Example |
|---|---|---|
| `Grid-Row` | `string` | `Grid-Row="0"` |
| `Grid-Column` | `string` | `Grid-Column="1"` |
| `Grid-RowSpan` | `string` | `Grid-RowSpan="2"` |
| `Grid-ColumnSpan` | `string` | `Grid-ColumnSpan="3"` |

There is also a combined `[Grid]` directive that accepts an object:

```html
<TextBlock [Grid]="{ Row: 0, Column: 1, ColumnSpan: 2 }">Text</TextBlock>
```

## Auto-flow Behavior

When **neither** `ColumnDefinitions` nor `RowDefinitions` are set, Grid behaves like a StackPanel:
- `Orientation="Horizontal"` → auto-flow: column
- `Orientation="Vertical"` → auto-flow: row

When definitions **are** set:
- `Orientation="Horizontal"` → auto-flow: row (fills rows left-to-right, then wraps)
- `Orientation="Vertical"` → auto-flow: column

## Import

Grid is an NgModule (not standalone). Import `GridModule`:

```typescript
import { GridModule } from 'xaml-ui';

@Component({
  imports: [GridModule, ...]
})
```

## Examples

### Implicit row-by-row filling (no Grid-Row/Grid-Column needed)

When you define `RowDefinitions` and `ColumnDefinitions`, children fill cells left-to-right, top-to-bottom automatically. You only need `Grid-Row`/`Grid-Column` when a child must skip cells or span multiple cells.

**Two-column form — children fill row by row:**

```html
<Grid RowDefinitions="auto auto" ColumnDefinitions="auto 1fr" ColumnSpacing="6px" RowSpacing="6px">
  <!-- Row 0 -->
  <TextBlock VerticalAlignment="Center">Name</TextBlock>
  <TextBox [(Text)]="name" />
  <!-- Row 1 (auto-placed, no Grid-Row needed) -->
  <TextBlock VerticalAlignment="Center">Email</TextBlock>
  <TextBox [(Text)]="email" />
</Grid>
```

### Explicit placement (only where needed)

Use `Grid-Row`, `Grid-Column`, `Grid-RowSpan`, `Grid-ColumnSpan` only for elements that span cells or need specific placement. Other children continue filling automatically.

```html
<Grid RowDefinitions="auto auto" ColumnDefinitions="auto 1fr auto" RowSpacing="6px" ColumnSpacing="6px">
  <TextBlock Text="Width" VerticalAlignment="Center" />
  <NumberBox [(Value)]="width" />
  <Button Grid-RowSpan="2" (Click)="OnApply()">Apply</Button>  <!-- spans 2 rows, needs explicit placement -->
  <TextBlock Text="Height" VerticalAlignment="Center" />
  <NumberBox [(Value)]="height" />
</Grid>
```

### Header with right-aligned action buttons

```html
<Grid ColumnDefinitions="1fr auto auto" ColumnSpacing="6px">
  <TextBlock Text="Notes" Class="HeaderTextBlockStyle" />
  <Button ToolTipService-ToolTip="Clear all" (Click)="OnClear()">
    <FontIcon Glyph="&#xED62;" />
  </Button>
  <Button ToolTipService-ToolTip="Pin" (Click)="OnPin()">
    <FontIcon Glyph="&#xE840;" />
  </Button>
</Grid>
```

### Equal-width button row (no definitions = auto-flow)

When **neither** `ColumnDefinitions` nor `RowDefinitions` are set, Grid acts like a StackPanel with auto-flow:

```html
<Grid Orientation="Horizontal" ColumnSpacing="6px" AutoColumnDefinition="minmax(0, 1fr)">
  <Button>Cancel</Button>
  <Button Class="AccentButtonStyle">Confirm</Button>
</Grid>
```

### Nested grid for complex layouts

```html
<Grid *ngIf="hasPreview" Grid-ColumnSpan="2" RowDefinitions="auto 1fr auto"
      ColumnDefinitions="auto 1fr auto" ColumnSpacing="6px" RowSpacing="6px" Margin="6px 0">
  <StackPanel Orientation="Vertical" Grid-Row="0" Grid-Column="1" Spacing="6px">
    <TextBlock HorizontalAlignment="Center">Top</TextBlock>
    <NumberBox [(Value)]="bounds.Top" />
  </StackPanel>
  <Border Grid-Row="1" Grid-Column="1" Class="BorderedControlStyle">
    <Image [Source]="previewUrl" Stretch="Uniform" Width="400px" Height="400px" />
  </Border>
  <StackPanel Orientation="Vertical" Grid-Row="2" Grid-Column="1" Spacing="6px">
    <TextBlock HorizontalAlignment="Center">Bottom</TextBlock>
    <NumberBox [(Value)]="bounds.Bottom" />
  </StackPanel>
</Grid>
```
