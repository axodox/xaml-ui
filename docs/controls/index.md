# Controls Reference

Complete index of all xaml-ui controls, organized by category.

## Common

| Control | Description |
|---|---|
| [FrameworkElement](FrameworkElement.md) | Abstract base class for all controls. Provides sizing, alignment, margin, padding, opacity. |
| [XamlRoot](XamlRoot.md) | Root container that must wrap the entire application. Sets theme, blocks context menu. |
| [Color](Color.md) | The `Color` type and the RGBA/HSVA/HSLA classes controls convert through. |

## Layout

| Control | Description |
|---|---|
| [Panel](layout/Panel.md) | Abstract base for containers. Provides background, corner radius, border. |
| [Grid](layout/Grid.md) | CSS Grid layout with XAML-style row/column definitions and 0-based placement directives. |
| [StackPanel](layout/StackPanel.md) | Arranges children sequentially in a row or column with spacing. |
| [Border](layout/Border.md) | Single-child container with panel styling. Children overlay in one cell. |
| [Separator](layout/Separator.md) | Horizontal or vertical dividing line. |

## Basic Input

| Control | Description |
|---|---|
| [Button](basic-input/Button.md) | Clickable button with text or child content. Supports flyouts and style classes (Accent, Inline, Hyperlink). Also `XamlButton` (self-closable). |
| [ToggleButton](basic-input/ToggleButton.md) | Button with checked/unchecked toggle state. |
| [CheckBox](basic-input/CheckBox.md) | Boolean toggle with checkbox indicator; optional indeterminate state (IsThreeState). |
| [ToggleSwitch](basic-input/ToggleSwitch.md) | Boolean toggle rendered as a switch. |
| [RadioButton](basic-input/RadioButton.md) | Mutually exclusive radio option. Used inside RadioButtonGroup. |
| [RadioToggleButton](basic-input/RadioToggleButton.md) | RadioButton styled as a toggle button (for toolbar segmented controls). |
| [Slider](basic-input/Slider.md) | Range input for selecting a numeric value. Horizontal or vertical. |
| [ComboBox](basic-input/ComboBox.md) | Dropdown selection with item templates and value/display paths. |
| [ColorPicker](basic-input/ColorPicker.md) | Color wheel with optional brightness and alpha sliders. Built on ColorSpectrum. |
| [ColorSpectrum](primitives/ColorSpectrum.md) | Hue/saturation wheel primitive. Picks by position, in HSV. |
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
| [TabView](collections/TabView.md) | Tabs over the content of the selected one; closable tabs, add button, strip header/footer slots. Also documents TabViewItem. |
| [TreeView](collections/TreeView.md) | Hierarchical list from an items source; single or check-box (multiple) selection, two-way expanded items. |
| [DataGrid](collections/DataGrid.md) | Table of items with text and template columns, grid lines, row selection and a frozen first column. |

## Dialogs and Flyouts

| Control | Description |
|---|---|
| [Flyout](dialogs-and-flyouts/Flyout.md) | Lightweight popup anchored to parent. Placement with fallback, Standard/Transient show modes, Esc and focus return. |
| [ContentDialog](dialogs-and-flyouts/ContentDialog.md) | Modal dialog with title, body, and up to three buttons. Created programmatically. |
| [OpenFilePicker](dialogs-and-flyouts/OpenFilePicker.md) | Utility class for picking files via File System Access API. |
| [FlyoutPresenter](primitives/FlyoutPresenter.md) | Surface, padding and transition chrome a flyout's content sits in. |
| [DialogPresenter](primitives/DialogPresenter.md) | Frame with optional header and footer bands a dialog's content sits in. |

## Menus and Toolbars

| Control | Description |
|---|---|
| [CommandBar](menus-and-toolbars/CommandBar.md) | Horizontal toolbar container for AppBarButton children. |
| [MenuFlyout](menus-and-toolbars/MenuFlyout.md) | Menu flyout with keyboard navigation. Closes when an enabled item is chosen. Supports ItemFlyout and ContextFlyout directives. |
| [MenuFlyoutItem](menus-and-toolbars/MenuFlyoutItem.md) | Menu command with icon, note and accelerator text; ToggleMenuFlyoutItem, RadioMenuFlyoutItem and separator (documented together). |
| [RadioMenuFlyoutItem](menus-and-toolbars/MenuFlyoutItem.md#radiomenuflyoutitem) | Menu option exclusive within its GroupName. |

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
| [ProgressBar](status-and-info/ProgressBar.md) | Horizontal progress indicator with a track; paused and error states. |
| [ProgressRing](status-and-info/ProgressRing.md) | Circular progress indicator with a track ring (Background). |
| [ToolTipService](status-and-info/ToolTipService.md) | Directive for adding native tooltips to any element. |
| [InfoBadge](status-and-info/InfoBadge.md) | Small notification badge: a number, a glyph or a dot, in WinUI's status colours. |
