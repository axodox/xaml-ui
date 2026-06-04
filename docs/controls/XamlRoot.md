# XamlRoot

> Source: [XamlRoot.ts](../../projects/xaml-ui/src/lib/XamlRoot.ts)

Root container component. Must wrap the entire application template. Acts as the token-declaring root for xaml-ui's theme and as the isolation boundary that prevents host-app styles from leaking into xaml-ui content.

## Behavior

- Ships xaml-ui's global stylesheet automatically (uses `ViewEncapsulation.None`). No CSS import is required from the consumer.
- Declares every xaml-ui theme token via the `var(--XamlUiOverride<Name>, <default>)` chain — tokens cascade to descendants through standard CSS custom-property inheritance. See [theming.md](../theming.md).
- Applies `all: initial` to block hostile inheritance from the host app (custom properties, `direction`, and `unicode-bidi` are spec-exempt and continue to flow through).
- Re-establishes inherited properties from xaml-ui tokens: `font-family`, `font-size`, `color`, `background`.
- Applies chrome: `display: grid; overflow: hidden; user-select: none; touch-action: none; box-sizing: border-box`.
- Blocks the browser right-click context menu (reserved for `ContextFlyout` / `MenuFlyout`).

## Usage

Every app template must wrap content in `<XamlRoot>`:

```html
<XamlRoot>
  <Grid ColumnDefinitions="auto 1fr">
    <!-- app content -->
  </Grid>
</XamlRoot>
```

Dialog and flyout presenters wrap their projected content in an inner `<XamlRoot>` internally so tokens reach the overlay subtree (CDK Overlay attaches its container at `<body>` level, outside any consumer `XamlRoot`). When `XamlRoot` is nested inside an `.xaml-overlay-pane`, its `overflow` and `background` are reset so the presenter's box-shadow renders and the presenter chrome shows through.

## Import

```typescript
import { XamlRootComponent } from 'xaml-ui';

@Component({
  imports: [XamlRootComponent, ...]
})
```
