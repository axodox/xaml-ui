import { Component, HostBinding, Input } from "@angular/core";
import { FrameworkElement } from "../layout/FrameworkElement";
import { FontStyle, FontWeights } from "../layout/Common";
import { TextBlock } from "./TextBlock";

@Component({
  selector: 'FontIcon',
  template: `{{Glyph}}`,
  styles: `:host {
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  }`
})
export class FontIcon extends FrameworkElement {
  @Input() @HostBinding('style.font-family') FontFamily?: string;
  @Input() @HostBinding('style.font-size') FontSize?: string;
  @Input() @HostBinding('style.font-style') FontStyle?: FontStyle;  
  @Input() FontWeight: FontWeights = 'Normal';
  @Input() Glyph?: string;
  
  @HostBinding('style.font-weight')
  private get fontWeight() {
    return TextBlock.ToFontWeight(this.FontWeight);
  }
}