> Source: [Flyout.ts](../../../projects/xaml-ui/src/lib/dialogs-and-flyouts/Flyout.ts)

# Flyout

Lightweight popup anchored to its parent element. Uses Angular CDK Overlay for positioning. Extends FlyoutBase → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Placement` | `FlyoutPlacementMode` | `'Top'` | Position relative to anchor |
| `Padding` | `string` | — | Internal padding |
| `HasBackdrop` | `boolean` | `true` | Whether clicking outside closes the flyout |
| `IsOpen` | `boolean` | — | Open state |
| `Target` | `FlexibleConnectedPositionStrategyOrigin` | — | Custom anchor element |

| Output | Type | Description |
|---|---|---|
| `IsOpenChange` | `EventEmitter<boolean>` | Open state changed |

## Methods

| Method | Description |
|---|---|
| `Show()` | Opens the flyout |
| `Hide()` | Closes the flyout |

## FlyoutPlacementMode

`Top`, `Bottom`, `Left`, `Right`, `TopEdgeAlignedLeft`, `TopEdgeAlignedRight`, `BottomEdgeAlignedLeft`, `BottomEdgeAlignedRight`, `LeftEdgeAlignedTop`, `LeftEdgeAlignedBottom`, `RightEdgeAlignedTop`, `RightEdgeAlignedBottom`, `Cover`

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Usage Patterns

### Inside a Button (auto-opens on click)

When placed as a child of a Button, the flyout opens automatically on click:

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

Flyouts animate in/out with a slide direction based on Placement (250ms duration).
