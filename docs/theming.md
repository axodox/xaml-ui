# Theming

xaml-ui uses CSS custom properties for all visual styling. The theme automatically switches between dark and light mode via `prefers-color-scheme` media query.

## Setup

Import the global styles in your root `styles.scss`:

```scss
@use 'xaml-ui/styles/XamlGlobals.css';
```

## Color System

### Accent Colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--AccentFillColorDefault` | `#4CC2FF` | `#0067C0` | Primary accent |
| `--AccentFillColorSecondary` | `#4CC2FFE6` | `#0067C0E6` | Hover state (90% opacity) |
| `--AccentFillColorTertiary` | `#4CC2FFCC` | `#0067C0CC` | Pressed state (80% opacity) |
| `--AccentFillColorDisabled` | `#FFFFFF28` | `#FFFFFF37` | Disabled accent |
| `--SystemAccentColor` | `#0078d4` | `#0078d4` | Base system accent |

### Text Colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--TextFillColorPrimary` | `#FFFFFF` | `#000000E4` | Primary text |
| `--TextFillColorSecondary` | `#FFFFFFC5` | `#0000009E` | Secondary/muted text |
| `--TextFillColorDisabled` | `#FFFFFF5D` | `#0000005C` | Disabled text |
| `--TextOnAccentFillColorPrimary` | `#000000` | `#FFFFFF` | Text on accent background |
| `--TextOnAccentFillColorSecondary` | `#00000080` | `#FFFFFFB3` | Secondary text on accent |

### Control Colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--ControlFillColorDefault` | `#FFFFFF0F` | `#FFFFFFB3` | Default control background |
| `--ControlFillColorSecondary` | `#FFFFFF15` | `#F9F9F980` | Hover state |
| `--ControlFillColorTertiary` | `#FFFFFF08` | `#F9F9F94D` | Pressed state |
| `--ControlFillColorDisabled` | `#FFFFFF0B` | `#F9F9F94D` | Disabled state |
| `--ControlFillColorInputActive` | `#1E1E1EB3` | `#FFFFFF` | Active input background |
| `--ControlSolidFillColorDefault` | `#454545` | `#FFFFFF` | Solid (opaque) control bg |

### Subtle/Transparent Colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--SubtleFillColorSecondary` | `#FFFFFF0F` | `#00000009` | Subtle hover (e.g. InlineButtonStyle) |
| `--SubtleFillColorTertiary` | `#FFFFFF0A` | `#00000006` | Subtle pressed |

### Stroke/Border Colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--ControlStrokeColorDefault` | `#FFFFFF12` | `#0000000F` | Default control border |
| `--ControlStrongStrokeColorDefault` | `#FFFFFF8B` | `#00000072` | Strong border |
| `--ControlStrongFillColorDefault` | `#FFFFFF8B` | `#00000072` | Strong fill (e.g. slider track) |
| `--DividerStrokeColorDefault` | `#FFFFFF15` | `#0000000F` | Divider line color |
| `--SurfaceStrokeColorDefault` | `#75757566` | `#75757566` | Surface border |

### Selection/Highlight Colors

| Variable | Dark | Light |
|---|---|---|
| `--SystemControlHighlightListAccentLow` | `#0078D499` | `#0078D466` |
| `--SystemControlHighlightListAccentMedium` | `#0078D4CC` | `#0078D499` |
| `--SystemControlHighlightListAccentHigh` | `#0078D4E6` | `#0078D4B3` |

### Surface/Backdrop Colors

| Variable | Dark | Light |
|---|---|---|
| `--SmokeFillColorDefault` | `#0000004D` | `#0000004D` |
| `--AcrylicInAppFillColorDefault` | `#2C2C2C26` | `#FCFCFC26` |
| `--LayerFillColorAlt` | `#FFFFFF0D` | `#FFFFFF` |

## Invariant Variables

These do not change between light/dark mode:

| Variable | Value | Description |
|---|---|---|
| `--ControlBorderThickness` | `1px` | Default border width |
| `--ControlCornerRadius` | `4px` | Default border radius |
| `--OverlayCornerRadius` | `8px` | Flyout/dialog corner radius |
| `--SystemFontSize` | `10pt` | Base font size |
| `--SystemFontFamily` | `'Segoe UI', Arial, sans-serif` | Default font |
| `--SymbolFontFamily` | `'Segoe Fluent Icons', 'Segoe MDL2 Assets'` | Icon font |
| `--AcrylicBlur` | `blur(12px)` | Acrylic backdrop blur |

## Animation Durations

| Variable | Value | Description |
|---|---|---|
| `--ControlNormalAnimationDuration` | `0.25s` | Standard transitions |
| `--ControlFastAnimationDuration` | `0.167s` | Fast transitions (hover) |
| `--ControlFasterAnimationDuration` | `0.083s` | Fastest transitions |

## Customizing the Theme

Override any variable in your app's `:root`:

```scss
:root {
  --AcrylicInAppFillColorDefault: #2C2C2C99;

  @media (prefers-color-scheme: light) {
    --AcrylicInAppFillColorDefault: #FCFCFC99;
  }
}
```

## App-Level Style Classes

Define reusable style classes in your `styles.scss` using these variables:

```scss
.HeaderTextBlockStyle {
  color: var(--AccentFillColorDefault) !important;
  font-size: 16pt !important;
  font-weight: bold !important;
}

.DetailTextBlockStyle {
  color: var(--TextFillColorDisabled) !important;
}

.BorderedControlStyle {
  border-width: 2px;
  border-style: solid;
  border-color: var(--ControlStrongFillColorDefault) !important;
}
```

Apply with the `Class` attribute (capital C):

```html
<TextBlock Text="Title" Class="HeaderTextBlockStyle" />
```

## Overlay Backdrop Classes

Defined in XamlGlobals.css:

- `.xaml-flyout-overlay-backdrop` — transparent backdrop for flyouts
- `.xaml-dialog-overlay-backdrop` — semi-transparent smoke backdrop for dialogs
