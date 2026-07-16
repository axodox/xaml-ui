# Controls Reference

Complete index of all xaml-ui controls, organized by category.

## Common

| Control | Description |
|---|---|
| [FrameworkElement](FrameworkElement.md) | Abstract base class for all controls. Provides sizing, alignment, margin, padding, opacity. |
| [XamlRoot](XamlRoot.md) | Root container that must wrap the entire application. Sets theme, blocks context menu. |

## Layout

| Control | Description |
|---|---|
| [Panel](layout/Panel.md) | Abstract base for containers. Provides background, corner radius, border. |
| [Grid](layout/Grid.md) | CSS Grid layout with XAML-style row/column definitions and 0-based placement directives. |
| [StackPanel](layout/StackPanel.md) | Arranges children sequentially in a row or column with spacing. |
| [Border](layout/Border.md) | Single-child container with panel styling. Children overlay in one cell. |

## Basic Input

| Control | Description |
|---|---|
| [Button](basic-input/Button.md) | Clickable button with text or child content. Supports flyouts and style classes (Accent, Inline, Hyperlink). |
| [ToggleButton](basic-input/ToggleButton.md) | Button with checked/unchecked toggle state. |
| [CheckBox](basic-input/CheckBox.md) | Boolean toggle with checkbox indicator. |
| [ToggleSwitch](basic-input/ToggleSwitch.md) | Boolean toggle rendered as a switch. |
| [RadioButton](basic-input/RadioButton.md) | Mutually exclusive radio option. Used inside RadioButtonGroup. |
| [RadioToggleButton](basic-input/RadioToggleButton.md) | RadioButton styled as a toggle button (for toolbar segmented controls). |
| [Slider](basic-input/Slider.md) | Range input for selecting a numeric value. Horizontal or vertical. |
| [ComboBox](basic-input/ComboBox.md) | Dropdown selection with item templates and value/display paths. |
| [ColorPicker](basic-input/ColorPicker.md) | Canvas-based color wheel for HSL color selection. |
| [DropDownButton](basic-input/DropDownButton.md) | Button with dropdown chevron. Hosts a Flyout or MenuFlyout. |
| [SplitButton](basic-input/SplitButton.md) | Button split into a main action area and a dropdown section. |
| [RepeatButton](basic-input/RepeatButton.md) | Button that emits Click events repeatedly while held down. |
| [HyperlinkButton](basic-input/HyperlinkButton.md) | Button that opens a URL in a new window. |

## Text

| Control | Description |
|---|---|
| [TextBlock](text/TextBlock.md) | Read-only text display with font, alignment, wrapping, and trimming options. |
| [TextBox](text/TextBox.md) | Single-line or multi-line text input with placeholder and validation. |
| [NumberBox](text/NumberBox.md) | Numeric input with spin buttons, keyboard support, unit suffix, and value clamping. |

## Icons

| Control | Description |
|---|---|
| [FontIcon](icons/FontIcon.md) | Displays a glyph from Segoe Fluent Icons / Segoe MDL2 Assets. |

## Collections

| Control | Description |
|---|---|
| [Selector](primitives/Selector.md) | Abstract base for collection controls. Provides item source, selection, and templates. |
| [ListView](collections/ListView.md) | Scrollable list with single selection, item templates, and animations. |
| [ListBox](collections/ListBox.md) | List without built-in scrolling. |
| [GridView](collections/GridView.md) | Grid-based collection display with configurable rows/columns. |

## Dialogs and Flyouts

| Control | Description |
|---|---|
| [Flyout](dialogs-and-flyouts/Flyout.md) | Lightweight popup anchored to parent. Supports placement and backdrop. |
| [ContentDialog](dialogs-and-flyouts/ContentDialog.md) | Modal dialog with title, body, and up to three buttons. Created programmatically. |
| [OpenFilePicker](dialogs-and-flyouts/OpenFilePicker.md) | Utility class for picking files via File System Access API. |

## Menus and Toolbars

| Control | Description |
|---|---|
| [CommandBar](menus-and-toolbars/CommandBar.md) | Horizontal toolbar container for AppBarButton children. |
| [MenuFlyout](menus-and-toolbars/MenuFlyout.md) | Context menu flyout. Auto-closes on item click. Supports ItemFlyout and ContextFlyout directives. |
| [MenuFlyoutItem](menus-and-toolbars/MenuFlyoutItem.md) | Clickable menu item, toggle menu item, and separator (documented together). |

## Media

| Control | Description |
|---|---|
| [Image](media/Image.md) | Image display with stretch modes (None, Fill, Uniform, UniformToFill). |
| [PersonPicture](media/PersonPicture.md) | Avatar with initials fallback and optional badge. |

## Shapes

| Control | Description |
|---|---|
| [Ellipse](shapes/Ellipse.md) | Circular or elliptical shape with fill and stroke. |

## Scrolling

| Control | Description |
|---|---|
| [ScrollViewer](scrolling/ScrollViewer.md) | Scrollable container with custom scrollbars. Also documents ScrollBar. |

## Status and Info

| Control | Description |
|---|---|
| [ProgressBar](status-and-info/ProgressBar.md) | Horizontal progress indicator. Also documents ProgressRing. |
| [ToolTipService](status-and-info/ToolTipService.md) | Directive for adding native tooltips to any element. |
