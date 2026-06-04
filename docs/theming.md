# Theming

xaml-ui uses CSS custom properties for all visual styling. The theme switches automatically between dark and light mode via the `prefers-color-scheme` media query, and consumers customise it through a small, explicit override API.

## How it works

Theme tokens are declared on the `<XamlRoot>` element (and on the dialog presenters that render at `<body>` level via CDK Overlay). They are **not** declared at `:root`, so xaml-ui's token names don't pollute the host app's variable namespace. Tokens reach descendants via standard CSS custom-property inheritance.

The styles ship with the components automatically — there is **no CSS file to import**. As soon as a `<XamlRoot>` is instantiated, its stylesheet is loaded and tokens become available throughout its subtree.

Each token resolves through a `var(--XamlUiOverride<Name>, <default>)` chain. The `--XamlUiOverride*` slot is the public theming surface: set it at `:root` (or any ancestor of the `<XamlRoot>`) to customise the corresponding token. The internal `--Name` form is not part of the public API.

```scss
// Consumer's styles.scss — no @use of xaml-ui CSS needed.
:root {
  --XamlUiOverrideAccentFillColorDefault: #608ff4;
  --XamlUiOverrideSystemFontFamily: 'Red Hat Text', sans-serif;
  --XamlUiOverrideWindowFillColorDefault: #131516;
}
```

Light-mode overrides go in a media query alongside the default (dark) ones — overrides apply to both schemes, so wrap the light values like xaml-ui itself does:

```scss
:root {
  --XamlUiOverrideAccentFillColorDefault: #4CC2FF;

  @media (prefers-color-scheme: light) {
    --XamlUiOverrideAccentFillColorDefault: #0067C0;
  }
}
```

The source of truth for the token list and default values is [_Theme.scss](../projects/xaml-ui/src/lib/Theme.scss).

## Tokens

### Window / surface

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--WindowFillColorDefault` | `#202020` | `#F3F3F3` | App-level background; used by `<XamlRoot>` and dialog cards |
| `--LayerFillColorAlt` | `#FFFFFF0D` | `#FFFFFF` | Elevated layer surface |
| `--SurfaceStrokeColorDefault` | `#75757566` | `#75757566` | Generic surface border |
| `--SurfaceStrokeColorFlyout` | `#00000033` | `#0000000F` | Flyout border |
| `--AcrylicInAppFillColorDefault` | `#2C2C2C26` | `#FCFCFC26` | Acrylic surface fill |
| `--SystemChromeMediumLowColor` | `#2B2B2B` | `#F2F2F2` | System chrome surface |
| `--SmokeFillColorDefault` | `#0000004D` | `#0000004D` | Dialog backdrop smoke |

### Accent colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--AccentFillColorDefault` | `#4CC2FF` | `#0067C0` | Primary accent |
| `--AccentFillColorSecondary` | `#4CC2FFE6` | `#0067C0E6` | Hover state (90% opacity) |
| `--AccentFillColorTertiary` | `#4CC2FFCC` | `#0067C0CC` | Pressed state (80% opacity) |
| `--AccentFillColorDisabled` | `#FFFFFF28` | `#FFFFFF37` | Disabled accent |
| `--SystemAccentColor` | `#0078d4` | `#0078d4` | Base system accent |

### Text colors

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--TextFillColorPrimary` | `#FFFFFF` | `#000000E4` | Primary text |
| `--TextFillColorSecondary` | `#FFFFFFC5` | `#0000009E` | Secondary / muted text |
| `--TextFillColorDisabled` | `#FFFFFF5D` | `#0000005C` | Disabled text |
| `--TextOnAccentFillColorPrimary` | `#000000` | `#FFFFFF` | Text on accent background |
| `--TextOnAccentFillColorSecondary` | `#00000080` | `#FFFFFFB3` | Secondary text on accent |
| `--TextOnAccentFillColorSelected` | `#FFFFFF` | `#FFFFFF` | Selected text on accent |
| `--TextOnAccentFillColorDisabled` | `#FFFFFF87` | `#FFFFFF` | Disabled text on accent |

### Control fill

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--ControlFillColorDefault` | `#FFFFFF0F` | `#FFFFFFB3` | Default control background |
| `--ControlFillColorSecondary` | `#FFFFFF15` | `#F9F9F980` | Hover state |
| `--ControlFillColorTertiary` | `#FFFFFF08` | `#F9F9F94D` | Pressed state |
| `--ControlFillColorDisabled` | `#FFFFFF0B` | `#F9F9F94D` | Disabled state |
| `--ControlFillColorInputActive` | `#1E1E1EB3` | `#FFFFFF` | Active input background |
| `--ControlFillColorTransparent` | `#FFFFFF00` | `#FFFFFF00` | Transparent control fill |
| `--ControlSolidFillColorDefault` | `#454545` | `#FFFFFF` | Solid (opaque) control bg |

### Control alt fill

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--ControlAltFillColorSecondary` | `#00000019` | `#00000006` | Alt control bg (secondary) |
| `--ControlAltFillColorTertiary` | `#FFFFFF0B` | `#0000000F` | Alt control bg (tertiary) |
| `--ControlAltFillColorQuarternary` | `#FFFFFF12` | `#00000018` | Alt control bg (quaternary) |
| `--ControlAltFillColorDisabled` | `#FFFFFF00` | `#FFFFFF00` | Alt control bg (disabled) |

### Control strong / subtle fill

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--ControlStrongFillColorDefault` | `#FFFFFF8B` | `#00000072` | Strong fill (e.g. slider track) |
| `--ControlStrongFillColorDisabled` | `#FFFFFF3F` | `#00000051` | Strong fill disabled |
| `--SubtleFillColorTransparent` | `#FFFFFF00` | `#FFFFFF00` | Transparent subtle fill |
| `--SubtleFillColorSecondary` | `#FFFFFF0F` | `#00000009` | Subtle hover (e.g. InlineButtonStyle) |
| `--SubtleFillColorTertiary` | `#FFFFFF0A` | `#00000006` | Subtle pressed |

### Borders / strokes

| Variable | Dark | Light | Description |
|---|---|---|---|
| `--ControlStrokeColorDefault` | `#FFFFFF12` | `#0000000F` | Default control border |
| `--ControlStrongStrokeColorDefault` | `#FFFFFF8B` | `#00000072` | Strong border |
| `--ControlStrongStrokeColorDisabled` | `#FFFFFF28` | `#00000037` | Strong border disabled |
| `--ControlStrokeColorOnAccentDefault` | `#FFFFFF14` | `#FFFFFF14` | Border on accent background |
| `--DividerStrokeColorDefault` | `#FFFFFF15` | `#0000000F` | Divider line |

### Selection / highlight

| Variable | Dark | Light |
|---|---|---|
| `--SystemControlHighlightListAccentLow` | `#0078D499` | `#0078D466` |
| `--SystemControlHighlightListAccentMedium` | `#0078D4CC` | `#0078D499` |
| `--SystemControlHighlightListAccentHigh` | `#0078D4E6` | `#0078D4B3` |

### Invariant tokens (same in light and dark)

| Variable | Value | Description |
|---|---|---|
| `--ControlBorderThickness` | `1px` | Default border width |
| `--ControlCornerRadius` | `4px` | Default border radius |
| `--OverlayCornerRadius` | `8px` | Flyout / dialog corner radius |
| `--SystemFontSize` | `10pt` | Base font size |
| `--SystemFontFamily` | `'Segoe UI', Arial, sans-serif` | Default font |
| `--SymbolFontFamily` | `'Segoe Fluent Icons', 'Segoe MDL2 Assets'` | Icon font |
| `--AcrylicBlur` | `blur(12px)` | Acrylic backdrop blur |

### Animation durations

| Variable | Value | Description |
|---|---|---|
| `--ControlNormalAnimationDuration` | `0.25s` | Standard transitions |
| `--ControlFastAnimationDuration` | `0.167s` | Fast transitions (hover) |
| `--ControlFasterAnimationDuration` | `0.083s` | Fastest transitions |

## Reading tokens in app code

Inside any element that is a descendant of `<XamlRoot>`, read tokens by their short names directly:

```scss
.HeaderTextBlockStyle {
  color: var(--AccentFillColorDefault) !important;
  font-size: 16pt !important;
  font-weight: bold !important;
}

.DetailTextBlockStyle {
  color: var(--TextFillColorDisabled) !important;
}
```

Do **not** use the `--XamlUiOverride*` names when reading — they're write-only slots that the chain may not populate. Always read the resolved `--Name` form.

## Overlay backdrop classes

xaml-ui ships two backdrop classes for CDK overlays it creates. These are global rules that apply outside the `<XamlRoot>` subtree (CDK Overlay attaches its container at `<body>` level).

- `.xaml-flyout-overlay-backdrop` — transparent backdrop for flyouts
- `.xaml-dialog-overlay-backdrop` — semi-transparent smoke backdrop for dialogs (`var(--SmokeFillColorDefault)`)

xaml-ui's overlay panes are also marked with `.xaml-overlay-pane` so the library's `display: grid` rule on `.cdk-overlay-pane` only affects xaml-ui's own overlays, not other CDK Overlay usage in the host app.

## Hostile inheritance

`<XamlRoot>` declares `all: initial`, which resets every inherited property to its spec-defined initial value and cuts the cascade chain at that element. This means hostile host-app styles like `body { font-family: 'Comic Sans MS' }` or `html { line-height: 4 }` cannot leak into xaml-ui content.

Custom properties are exempt from `all`, so theming via `--XamlUiOverride*` continues to flow through inheritance. `direction` and `unicode-bidi` are also exempt, preserving RTL behavior.

Inherited properties xaml-ui doesn't explicitly re-establish (e.g., `text-align`, `letter-spacing`, `white-space`) end up at their spec-initial values rather than inheriting from the host. If a component relies on inheriting one of those from its parent, it must declare the property explicitly in its own stylesheet.
