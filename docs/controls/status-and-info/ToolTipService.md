# ToolTipService

> Source: [ToolTipService.ts](../../../projects/xaml-ui/src/lib/status-and-info/ToolTipService.ts)

WinUI-style tooltips for any element. Applying `ToolTipService-ToolTip` shows a themed popup (a
[`ToolTip`](../../../projects/xaml-ui/src/lib/status-and-info/ToolTip.ts) rendered in a CDK overlay)
positioned relative to the element after a short hover/focus delay, dismissing on leave, blur, press,
or scroll. Mirrors `Microsoft.UI.Xaml.Controls.ToolTip`.

## Usage

Apply the `ToolTipService-ToolTip` attribute to any element:

```html
<Button ToolTipService-ToolTip="Click to save">Save</Button>
<AppBarButton Text="Delete" ToolTipService-ToolTip="Remove the selected item" />
<FontIcon Glyph="&#xE713;" ToolTipService-ToolTip="Settings" />
```

**Dynamic tooltip:**

```html
<Slider [ToolTipService-ToolTip]="position() | DurationToString" />
<TextBlock [ToolTipService-ToolTip]="item.Name" />
```

**Placement** — position the tip relative to the target (`Top` | `Bottom` | `Left` | `Right`,
default `Top`). It flips to the opposite side automatically when there is no room:

```html
<Button ToolTipService-ToolTip="Filters" ToolTipService-Placement="Bottom">Filter</Button>
```

## Behavior

- Shows after `ToolTipDirective.InitialShowDelay` ms of hover or keyboard focus (default 400).
- Auto-dismisses after `ToolTipDirective.ShowDuration` ms (default 5000), or on leave / blur / press / scroll.
- Wires `aria-describedby` on the target to the tip for screen readers.

## Import

ToolTipService is an NgModule:

```typescript
import { ToolTipServiceModule } from 'xaml-ui';

@Component({
  imports: [ToolTipServiceModule, ...]
})
```
