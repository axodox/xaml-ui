# ScrollViewer

> Source: [ScrollViewer.ts](../../../projects/xaml-ui/src/lib/scrolling/ScrollViewer.ts)

Scrollable container with custom ScrollBars. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `HorizontalScrollMode` | `'Disabled' \| 'Enabled' \| 'Auto'` | `'Auto'` | Horizontal scroll behavior |
| `VerticalScrollMode` | `'Disabled' \| 'Enabled' \| 'Auto'` | `'Auto'` | Vertical scroll behavior |

| Output | Type | Description |
|---|---|---|
| `ViewChanged` | `EventEmitter<ScrollViewerViewChangedEventArgs>` | The view moved: raised on every scroll with `IsIntermediate: true`, and once more with `IsIntermediate: false` when it comes to rest (`scrollend`, or 150 ms without movement where the browser lacks it). The content scrolls inside the viewer, so its own scroll events do not reach the viewer's parents; this does |

`ScrollViewerViewChangedEventArgs` (WinUI's type of that name, with the offsets): `HorizontalOffset: number`, `VerticalOffset: number`, `IsIntermediate: boolean`.

## ScrollMode Values

| Value | Description |
|---|---|
| `Disabled` | No scrolling in this axis |
| `Enabled` | Always show scrollbar |
| `Auto` | Show scrollbar only when content overflows |

## Read-only Properties

| Property | Type | Description |
|---|---|---|
| `ExtentWidth` | `number` | Total content width |
| `ExtentHeight` | `number` | Total content height |
| `ViewportWidth` | `number` | Visible area width |
| `ViewportHeight` | `number` | Visible area height |
| `HorizontalOffset` | `number` | Current horizontal scroll position |
| `VerticalOffset` | `number` | Current vertical scroll position |

## Methods

| Method | Description |
|---|---|
| `ScrollTo(horizontalOffset?, verticalOffset?)` | Scrolls to an absolute offset at once; omitted axes stay where they are |
| `ScrollBy(horizontalDelta, verticalDelta)` | Scrolls by an offset relative to the current position |
| `ChangeView(horizontalOffset?, verticalOffset?, zoomFactor?, disableAnimation = false)` | WinUI's `ChangeView`: scrolls smoothly to the offsets (`null` or omitted: the axis stays), instantly when `disableAnimation`. `zoomFactor` is ignored (no zoom). Returns `false` when the viewer is not ready |
| `ScrollToElement(element, options?)` | Scrolls an element inside the content into view (`ScrollIntoViewOptions`, default `{ block: 'nearest' }`); `behavior: 'smooth'` animates it |

A smooth scroll runs to its end: the scroll bars, which hand back the offset they were given, no longer stop it half-way.

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Example

ScrollViewer scrolls whatever is placed inside it — presenting a collection is the job of the content,
so compose it with a [ListView](../collections/ListView.md), a `StackPanel`, or plain markup.

```html
<ScrollViewer HorizontalScrollMode="Disabled" VerticalScrollMode="Auto" MaxHeight="400px">
  <StackPanel Spacing="6px">
    <!-- long content -->
  </StackPanel>
</ScrollViewer>
```

**Following the view and scrolling smoothly:**

```html
<ScrollViewer #viewer VerticalScrollMode="Auto" HorizontalScrollMode="Disabled" (ViewChanged)="onViewChanged($event)">
  <!-- items -->
</ScrollViewer>
<Button (Click)="viewer.ChangeView(null, 600)">Further down</Button>
```

```typescript
protected onViewChanged(args: ScrollViewerViewChangedEventArgs) {
  if (!args.IsIntermediate) this.saveScrollPosition(args.VerticalOffset);
}

protected scrollTo(viewer: ScrollViewerComponent, element: Element) {
  viewer.ScrollToElement(element, { block: 'start', behavior: 'smooth' });
}
```

# ScrollBar

Low-level scrollbar control. Usually used internally by ScrollViewer. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Vertical'` | Scrollbar direction |
| `ViewportSize` | `number` | `0` | Visible area size |
| `ScrollSize` | `number` | `0` | Total scrollable area size |
| `StepSize` | `number` | `5` | Increment per step button click |
| `Value` | `number` | — | Current scroll position |
| `IsEnabled` | `boolean` | `true` | Enabled state |

| Output | Type | Description |
|---|---|---|
| `ValueChange` | `EventEmitter<number>` | Scroll position changed (not raised when the clamped value is unchanged) |
