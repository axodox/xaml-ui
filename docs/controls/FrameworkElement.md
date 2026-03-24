> Source: [FrameworkElement.ts](../../projects/xaml-ui/src/lib/FrameworkElement.ts)

# FrameworkElement

Abstract base class for all xaml-ui visual components. You do not use this directly — every component inherits from it.

## Inherited Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Width` | `string` | — | CSS width. If unset, `fit-content` when alignment is not Stretch. |
| `MinWidth` | `string` | — | CSS min-width |
| `MaxWidth` | `string` | — | CSS max-width |
| `Height` | `string` | — | CSS height. If unset, `fit-content` when alignment is not Stretch. |
| `MinHeight` | `string` | — | CSS min-height |
| `MaxHeight` | `string` | — | CSS max-height |
| `HorizontalAlignment` | `'Left' \| 'Center' \| 'Right' \| 'Stretch'` | `'Stretch'` | Maps to CSS `justify-self` |
| `VerticalAlignment` | `'Top' \| 'Center' \| 'Bottom' \| 'Stretch'` | `'Stretch'` | Maps to CSS `align-self` |
| `Margin` | `string` | — | CSS margin (e.g. `"6px"`, `"0 0 0 12px"`) |
| `Padding` | `string` | — | CSS padding |
| `Opacity` | `string \| number` | — | CSS opacity |

## Default Host Styles

Every component that extends `FrameworkElementComponent` includes:

```css
:host {
  display: grid;
  position: relative;
  overflow: hidden;
}
```

When inheriting in your own components, you can include the default styles:

```typescript
styles: `${FrameworkElementComponent.DefaultStyles}`
```

## Sizing Behavior

- When `HorizontalAlignment` is `'Stretch'` (default) and no `Width` is set, the component fills available width.
- When `HorizontalAlignment` is not `'Stretch'`, the component shrinks to `fit-content`.
- Same logic applies vertically with `VerticalAlignment` and `Height`.

## Usage in Custom Components

Extend `FrameworkElementComponent` for custom components that participate in the xaml-ui layout system:

```typescript
import { FrameworkElementComponent } from 'xaml-ui';

@Component({
  selector: 'MyControl',
  template: `...`,
  styles: `${FrameworkElementComponent.DefaultStyles}`
})
export class MyControl extends FrameworkElementComponent { }
```
