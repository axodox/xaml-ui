# Border

> Source: [Border.ts](../../../projects/xaml-ui/src/lib/layout/Border.ts)

Single-child container with panel styling. All children overlay in the same grid cell (via `grid-template-areas: "children"`). Extends [Panel](Panel.md).

## Own Properties

None beyond Panel. Border is a simple container that provides the Panel styling properties.

## Inherited Properties

- From [Panel](Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

**Styled container:**

```html
<Border Background="#2C2C2C" CornerRadius="6px" BorderThickness="2px"
        BorderBrush="var(--ControlStrongFillColorDefault)">
  <TextBlock>Content</TextBlock>
</Border>
```

**Using the BorderedControlStyle class:**

```html
<Border Class="BorderedControlStyle">
  <ListView [ItemSource]="items()" ... />
  <TextBlock *ngIf="items().length === 0" Text="No items." HorizontalAlignment="Center" Margin="36px" />
</Border>
```

**Horizontal separator line:**

```html
<Border Background="#8a8c86" Height="2px" CornerRadius="1px" />
```
