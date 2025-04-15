import { Component, HostBinding, Input } from "@angular/core";
import { FrameworkElement } from "../layout/FrameworkElement";
import { CommonModule } from "@angular/common";
import { FontStyle, FontWeights, TextAlignment, TextDecorations, TextTrimming, TextWrapping, XamlBoolean } from "../layout/Common";

@Component({
  selector: 'TextBlock',
  imports: [CommonModule],
  template: `<ng-container>
    <ng-content *ngIf="Text === undefined"/>
    <ng-container *ngIf="Text !== undefined">{{Text}}</ng-container>
  </ng-container>`
})
export class TextBlock extends FrameworkElement {
  @Input() @HostBinding('style.font-family') FontFamily?: string;
  @Input() Text?: string;
  @Input() @HostBinding('style.font-size') FontSize?: string;
  @Input() @HostBinding('style.font-style') FontStyle?: FontStyle;
  @Input() FontWeight: FontWeights = 'Normal';
  @Input() @HostBinding('style.color') Foreground?: string;
  @Input() @HostBinding('style.text-align') TextAlignment?: TextAlignment = 'Left';
  @Input() IsTextSelectionEnabled?: XamlBoolean;
  @Input() TextDecorations?: TextDecorations;
  @Input() TextTrimming?: TextTrimming;
  @Input() TextWrapping: TextWrapping = 'NoWrap';

  @HostBinding('style.font-weight')
  private get fontWeight() {
    return TextBlock.ToFontWeight(this.FontWeight);
  }

  static ToFontWeight(value: FontWeights) {
    switch (value) {
      case 'Black':
        return 900;
      case 'Bold':
        return 700;
      case 'ExtraBlack':
        return 950;
      case 'ExtraBold':
        return 800;
      case 'ExtraLight':
        return 200;
      case 'Light':
        return 300;
      case 'Medium':
        return 500;
      case 'Normal':
        return 400;
      case 'SemiBold':
        return 600;
      case 'SemiLight':
        return 350;
      case 'Thin':
        return 100;
    }
  }

  @HostBinding('style.user-select')
  private get userSelect() {
    return this.IsTextSelectionEnabled === 'True' ? 'text' : 'none';
  }

  @HostBinding('style.text-decoration-line')
  private get textDecorationLine() {
    switch (this.TextDecorations) {
      case 'None':
        return 'none';
      case 'Strikethrough':
        return 'line-through';
      case 'Underline':
        return 'underline';
      default:
        return undefined;
    }
  }

  @HostBinding('style.text-overflow')
  private get textOverflow() {
    switch (this.TextTrimming) {
      case 'None':
      case 'Clip':
        return 'clip';
      case 'CharacterEllipsis':
        return 'Ellipsis';
      default:
        return undefined;
    }
  }

  @HostBinding('style.white-space')
  private get whiteSpace() {
    switch (this.TextWrapping) {
      case 'NoWrap':
        return 'nowrap';
      case 'Wrap':
        return 'normal';
    }
  }
}