# FlyoutPresenter

> Source: [FlyoutPresenter.ts](../../../projects/xaml-ui/src/lib/primitives/FlyoutPresenter.ts)

The chrome a flyout's content sits in — surface, shadow, padding and transition. [Flyout](../dialogs-and-flyouts/Flyout.md) and [MenuFlyout](../menus-and-toolbars/MenuFlyout.md) create one for you; you use it directly only when building a control that presents its own popup content.

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsVisible` | `boolean` | `false` | Drives the open/close transition. Sets the `visible` host class |
| `TransitionAnimation` | `FlyoutPresenterAnimation` | `'Default'` | How the content enters and leaves |
| `Padding` | `string` | — | CSS padding inside the surface |

```typescript
type FlyoutPresenterAnimation = 'Default' | 'SlideLeft' | 'SlideRight' | 'SlideUp' | 'SlideDown';
```

## Behavior

- Projects its content directly; the presenter is the surface, not a wrapper around one.
- Applies a `transition-<animation>` host class, so the animation is chosen in CSS rather than in script.
- Blocks the browser context menu over its content, which is reserved for [ContextFlyout](../menus-and-toolbars/MenuFlyout.md).
- `FlyoutPresenter.TransitionDuration` (250 ms) is the time to wait before removing the content after setting `IsVisible` to `false`, so the closing transition can finish.
- Draws no focus outline of its own. A standard flyout focuses its presenter when it opens (giving it `tabindex="-1"`), so its keys reach it and **Tab** goes on into the content; [MenuFlyout](../menus-and-toolbars/MenuFlyout.md) also gives it the `menu` role. See [Flyout → Focus and keyboard](../dialogs-and-flyouts/Flyout.md#focus-and-keyboard).
- Flyouts create a new presenter for each opening, each with its own `IsVisible`, so a presenter that is fading out never becomes visible again.

Note that unlike most of the library it does **not** extend [FrameworkElement](../FrameworkElement.md) — it has no sizing or alignment inputs of its own, and takes its size from its content.

## Usage

```html
<FlyoutPresenter [IsVisible]="IsOpen" TransitionAnimation="SlideUp" Padding="12px">
  <!-- popup content -->
</FlyoutPresenter>
```

```typescript
import { FlyoutPresenter } from 'xaml-ui';

protected async Close() {
  this.IsOpen = false;
  await new Promise(resolve => setTimeout(resolve, FlyoutPresenter.TransitionDuration));
  //content can now be torn down
}
```
