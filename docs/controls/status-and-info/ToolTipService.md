> Source: [ToolTipService.ts](../../../projects/xaml-ui/src/lib/status-and-info/ToolTipService.ts)

# ToolTipService

Directive for adding native tooltips to any element. Uses HTML `title` attribute.

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

## Import

ToolTipService is an NgModule:

```typescript
import { ToolTipServiceModule } from 'xaml-ui';

@Component({
  imports: [ToolTipServiceModule, ...]
})
```
