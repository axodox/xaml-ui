# xaml-ui — Getting Started

xaml-ui is an Angular component library that brings WinUI / XAML-style controls to the web. It implements Fluent Design with automatic light/dark theming via CSS custom properties, uses CSS Grid for all layout, and follows PascalCase naming conventions inspired by XAML/WinUI.

## Installation

```bash
npm install xaml-ui
```

## Setup

### 1. Import global styles

In your root `styles.scss`:

```scss
@use 'xaml-ui/styles/XamlGlobals.css';
```

This provides all CSS custom properties for theming (colors, fonts, borders, animations) and overlay/backdrop styles. The theme auto-switches between dark and light mode via `prefers-color-scheme`.

### 2. Wrap your app in XamlRoot

Every app template must have `<XamlRoot>` as the outermost element:

```html
<XamlRoot>
  <Grid ColumnDefinitions="auto 1fr">
    <!-- your app layout -->
  </Grid>
</XamlRoot>
```

`XamlRoot` blocks the browser context menu (right-click is reserved for `ContextFlyout`), sets the background color, and disables user selection.

### 3. Import components

All components are standalone (except `GridModule` which is an NgModule). Import them directly in your component's `imports` array:

```typescript
import {
  GridModule, StackPanelComponent, ButtonComponent,
  TextBlockComponent, FontIconComponent
} from 'xaml-ui';

@Component({
  selector: 'MyView',
  templateUrl: 'MyView.html',
  imports: [GridModule, StackPanelComponent, ButtonComponent, TextBlockComponent, FontIconComponent]
})
export class MyView extends FrameworkElementComponent { }
```

## Key Concepts

### FrameworkElement base class

All visual components extend `FrameworkElementComponent`. This provides common layout inputs: `Width`, `Height`, `MinWidth`, `MaxWidth`, `MinHeight`, `MaxHeight`, `HorizontalAlignment`, `VerticalAlignment`, `Margin`, `Padding`, `Opacity`.

All components use `display: grid; position: relative` as their default host style.

### Layout model

- **Grid** — CSS Grid with XAML-style `RowDefinitions` / `ColumnDefinitions`. Indices are 0-based.
- **StackPanel** — CSS Grid with auto-flow (vertical or horizontal).
- **Border** — Single-cell grid that overlays all children. Provides panel styling (background, corner radius, border).

### Theming

Everything is themed through CSS custom properties defined in `XamlGlobals.css`. The key variable families:

- `--AccentFillColor*` — accent/highlight colors
- `--ControlFillColor*` — control backgrounds (Default, Secondary, Tertiary, Disabled)
- `--TextFillColor*` — text colors (Primary, Secondary, Disabled)
- `--ControlStrokeColor*` — border colors
- `--SystemFontFamily`, `--SystemFontSize` — base typography
- `--SymbolFontFamily` — icon font (Segoe Fluent Icons)
- `--ControlCornerRadius` — default border radius (4px)
- `--ControlBorderThickness` — default border width (1px)

Override any variable in your app's `:root` to customize the theme.

### Two-way binding

xaml-ui follows the Angular `[(Banana)]` convention. Most interactive properties support two-way binding:

```html
[(Value)]="myNumber"
[(Text)]="myString"
[(SelectedValue)]="mySelection"
[(IsChecked)]="myBoolean"
[(Color)]="myColor"
```

### Flyout pattern

Buttons can host flyouts as child elements. The flyout opens when the button is clicked:

```html
<Button>
  <FontIcon Glyph="&#xE713;" />
  <Flyout Placement="Right">
    <MyPanel />
  </Flyout>
</Button>
```

### Dialog pattern

Modal dialogs are created programmatically:

```typescript
let dialog = Dialog.Create(MyDialog, this._viewContainerRef);
dialog.SomeProperty = initialValue;
let result = await dialog.ShowAsync();
if (result === ContentDialogResult.Secondary) {
  // user confirmed
}
```

## Component Categories

| Category | Components |
|---|---|
| **Layout** | Grid, StackPanel, Border |
| **Basic Input** | Button, ToggleButton, CheckBox, ToggleSwitch, RadioButton, RadioButtonGroup, RadioToggleButton, Slider, ComboBox, ColorPicker, DropDownButton, SplitButton, RepeatButton, HyperlinkButton |
| **Text** | TextBlock, TextBox, NumberBox |
| **Icons** | FontIcon |
| **Collections** | ListView, ListBox, GridView |
| **Dialogs & Flyouts** | Flyout, ContentDialog, MenuFlyout, OpenFilePicker |
| **Menus & Toolbars** | CommandBar, AppBarButton, MenuFlyoutItem, ToggleMenuFlyoutItem, MenuFlyoutSeparator |
| **Media** | Image, PersonPicture |
| **Shapes** | Ellipse |
| **Scrolling** | ScrollViewer, ScrollBar |
| **Status & Info** | ProgressBar, ProgressRing, ToolTipService |

See `controls/` directory for per-control documentation.
