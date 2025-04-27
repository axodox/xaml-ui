export type HorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch';
export type VerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch';
export type Orientation = 'Horizontal' | 'Vertical';
export type ScrollMode = 'Disabled' | 'Enabled' | 'Auto';
export type FontStyle = 'Normal' | 'Oblique' | 'Italic';
export type FontWeights = 'Black' | 'Bold' | 'ExtraBlack' | 'ExtraBold' | 'ExtraLight' | 'Light' | 'Medium' | 'Normal' | 'SemiBold' | 'SemiLight' | 'Thin';
export type TextAlignment = 'Center' | 'Left' | 'Right' | 'Justify';
export type XamlBoolean = 'False' | 'True';
export type TextDecorations = 'None' | 'Underline' | 'Strikethrough';
export type TextTrimming = 'None' | 'CharacterEllipsis' | 'Clip';
export type TextWrapping = 'NoWrap' | 'Wrap';
export type FlyoutPlacementMode = 'Top' | 'Bottom' | 'Left' | 'Right' | 'TopEdgeAlignedLeft' | 'TopEdgeAlignedRight' | 'BottomEdgeAlignedLeft' | 'BottomEdgeAlignedRight' | 'LeftEdgeAlignedTop' | 'LeftEdgeAlignedBottom' | 'RightEdgeAlignedTop' | 'RightEdgeAlignedBottom' | 'Cover';
export type Stretch = 'None' | 'Fill' | 'Uniform' | 'UniformToFill';

export function toJustification(value: HorizontalAlignment) {
  return value.toLowerCase();
}

export function toAlignment(value: VerticalAlignment) {
  switch (value) {
    case 'Top':
      return 'flex-start';
    case 'Center':
      return 'center';
    case 'Bottom':
      return 'flex-end';
    case 'Stretch':
      return 'stretch';
  }
}