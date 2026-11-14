# ToolTipService

> Source: [ToolTipService.ts](../../../projects/xaml-ui/src/lib/status-and-info/ToolTipService.ts)

WinUI-style tooltips for any element. Applying `ToolTipService-ToolTip` shows a themed popup (a
[`ToolTip`](../../../projects/xaml-ui/src/lib/status-and-info/ToolTip.ts) rendered in a CDK overlay)
positioned relative to the element after a short hover/keyboard-focus delay, dismissing on leave,
blur, press, or scroll. Mirrors `Microsoft.UI.Xaml.Controls.ToolTip`.

## Usage

Apply the `ToolTipService-ToolTip` attribute to any element:

```html
<Button ToolTipService-ToolTip="Click to save">Save</Button>
<AppBarButton Text="Delete" ToolTipService-ToolTip="Remove the selected item" />
<FontIcon Glyph="&#xE713;" ToolTipService-ToolTip="Settings" />
```

**Dynamic tooltip** — the content is live: an open tip shows the new value, and closes when the
value is cleared (empty or `undefined`):

```html
<Slider [ToolTipService-ToolTip]="position() | DurationToString" />
<TextBlock [ToolTipService-ToolTip]="item.Name" />
```

**Template content** — `ToolTipService-ToolTipTemplate` takes a `TemplateRef` instead of text (it wins
over `ToolTipService-ToolTip`):

```html
<Button [ToolTipService-ToolTipTemplate]="tip">Save</Button>
<ng-template #tip><TextBlock Text="Save" FontWeight="SemiBold" /><TextBlock Text="Ctrl+S" /></ng-template>
```

**Placement** — `ToolTipService-Placement`: `Mouse` (default: below the pointer; `Top` when the tip
is opened by keyboard focus) or `Top` | `Bottom` | `Left` | `Right` of the target. It flips to the
opposite side automatically when there is no room:

```html
<Button ToolTipService-ToolTip="Filters" ToolTipService-Placement="Bottom">Filter</Button>
```

## Behavior

- Shows 400ms after a mouse or pen hovers the element, or after it receives keyboard focus (`:focus-visible`).
- Does not show on touch hover, nor on the focus a pointer click gives.
- After a press on the element the tip closes and stays away until the pointer has left the element (as in WinUI).
- Dismisses on leave, blur, press or scroll. There is no timed auto-dismiss.
- With nested tooltip owners, the innermost one under the pointer wins.
- The tip never takes the pointer: it does not block what is beneath it.
- Wires `aria-describedby` on the target to the tip for screen readers while it shows.

## Import

ToolTipService is an NgModule:

```typescript
import { ToolTipServiceModule } from 'xaml-ui';

@Component({
  imports: [ToolTipServiceModule, ...]
})
```
