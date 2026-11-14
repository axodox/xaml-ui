# Flyout

> Source: [Flyout.ts](../../../projects/xaml-ui/src/lib/dialogs-and-flyouts/Flyout.ts)

Lightweight popup anchored to its parent element. Uses Angular CDK Overlay for positioning; its content sits in a [FlyoutPresenter](../primitives/FlyoutPresenter.md). Extends FlyoutBase (not a [FrameworkElement](../FrameworkElement.md): it has no sizing inputs, the presenter takes its size from the content).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Placement` | `FlyoutPlacementMode` | `'Top'` | Position relative to anchor. See [Placement](#placement) |
| `ShowMode` | `FlyoutShowMode` | `'Standard'` | `'Standard'` or `'Transient'`. See [Focus and keyboard](#focus-and-keyboard) |
| `Padding` | `string` | — | Internal padding (the presenter's default is `16px`) |
| `HasBackdrop` | `boolean` | `true` | Whether an invisible backdrop covers the page: a click or right-click on it closes the flyout |
| `IsOpen` | `boolean` | `false` | Open state |
| `Target` | `FlexibleConnectedPositionStrategyOrigin` | — | Custom anchor (an element, `ElementRef` or a point); defaults to the parent element |

| Output | Type | Description |
|---|---|---|
| `IsOpenChange` | `EventEmitter<boolean>` | Open state changed |

## Methods

| Method | Description |
|---|---|
| `Show()` | Opens the flyout |
| `Hide()` | Closes the flyout |

## Placement

`FlyoutPlacementMode`: `Top`, `Bottom`, `Left`, `Right`, `TopEdgeAlignedLeft`, `TopEdgeAlignedRight`, `BottomEdgeAlignedLeft`, `BottomEdgeAlignedRight`, `LeftEdgeAlignedTop`, `LeftEdgeAlignedBottom`, `RightEdgeAlignedTop`, `RightEdgeAlignedBottom`, `Cover`

Where the asked-for placement does not fit, the flyout tries the opposite side, then the sides across (as WinUI):

| Placement | Tried in order |
|---|---|
| `Top` | `Top`, `Bottom`, `Left`, `Right` |
| `Bottom` | `Bottom`, `Top`, `Left`, `Right` |
| `Left` | `Left`, `Right`, `Top`, `Bottom` |
| `Right` | `Right`, `Left`, `Top`, `Bottom` |
| `BottomEdgeAlignedLeft` | `BottomEdgeAlignedLeft`, `TopEdgeAlignedLeft`, `BottomEdgeAlignedRight`, `TopEdgeAlignedRight` |
| `LeftEdgeAlignedTop` | `LeftEdgeAlignedTop`, `RightEdgeAlignedTop`, `LeftEdgeAlignedBottom`, `RightEdgeAlignedBottom` |

The other edge-aligned modes follow the same pattern (same edge on the opposite side, then the other edge on both sides). `Cover` has no fallback; it covers the target and takes its size.

A flyout is never narrowed to fit: when no candidate fits, it keeps its size and is pushed into the window (4px from its edges). It follows the target while the page scrolls.

## Focus and keyboard

| `ShowMode` | Behavior |
|---|---|
| `Standard` | When it has faded in, the flyout takes the keyboard focus (on its presenter, so **Tab** goes on into its content). **Esc** closes it; with nested flyouts only the topmost one closes. On closing, the focus goes back to the element that had it when the flyout opened, if the focus is still in the flyout or lost. |
| `Transient` | Leaves the focus and the keys to its owner. Used for flyouts beside a focused field: the [ComboBox](../basic-input/ComboBox.md) list and the [NumberBox](../text/NumberBox.md) spin buttons. |

## Behavior

- Each opening has its own presenter state: a flyout closed and reopened while it fades out shows a single presenter (the fading one does not come back).
- While a closing flyout fades out (250ms), the pointer goes through it and its backdrop, so the next click reaches the page instead of being lost.

## Usage Patterns

### Inside a Button (auto-opens on click)

When placed as a child of a Button, the flyout opens automatically on click (a flyout declared elsewhere can be given to the button's `Flyout` input instead; see [Button](../basic-input/Button.md)):

```html
<Button Class="InlineButtonStyle" ToolTipService-ToolTip="Settings">
  <FontIcon Glyph="&#xE713;" />
  <Flyout Placement="Right">
    <SettingsPanel />
  </Flyout>
</Button>
```

### Programmatic control via ViewChild

```html
<Button (Click)="onOpenFlyout()">Open</Button>
<Flyout #myFlyout Placement="Bottom">
  <StackPanel Spacing="6px">
    <TextBox PlaceholderText="Enter value" [(Text)]="value" />
    <Button (Click)="onConfirm()">Confirm</Button>
  </StackPanel>
</Flyout>
```

```typescript
@ViewChild('myFlyout') private _flyout!: FlyoutComponent;
protected onOpenFlyout() { this._flyout.Show(); }
protected onConfirm() { this._flyout.Hide(); }
```

### Inside AppBarButton

```html
<AppBarButton Text="Add" Icon="&#xE710;" (Click)="onAddClick()">
  <Flyout #addFlyout>
    <StackPanel Orientation="Horizontal" Spacing="6px">
      <TextBox PlaceholderText="Name" [(Text)]="newName" Width="200px" />
      <Button [IsEnabled]="newName !== ''" (Click)="onSave()">
        <FontIcon Glyph="&#xE74E;" />
      </Button>
    </StackPanel>
  </Flyout>
</AppBarButton>
```

## Animation

Flyouts animate in/out with a slide direction based on `Placement` (`Top*` slides up, `Bottom*` down, `Left*` left, `Right*` right, `Cover` uses the default transition; 250ms duration).
