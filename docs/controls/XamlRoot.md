# XamlRoot

> Source: [XamlRoot.ts](../../projects/xaml-ui/src/lib/XamlRoot.ts)

Root container component. Must wrap the entire application template. Provides base styling and blocks the browser context menu.

## Behavior

- Blocks browser right-click context menu (reserved for ContextFlyout / MenuFlyout)
- Sets background color: `#202020` (dark) / `#f3f3f3` (light)
- Applies `display: grid; overflow: hidden; user-select: none`

## Usage

Every app template must wrap content in `<XamlRoot>`:

```html
<XamlRoot>
  <Grid ColumnDefinitions="auto 1fr">
    <!-- app content -->
  </Grid>
</XamlRoot>
```

## Import

```typescript
import { XamlRootComponent } from 'xaml-ui';

@Component({
  imports: [XamlRootComponent, ...]
})
```
