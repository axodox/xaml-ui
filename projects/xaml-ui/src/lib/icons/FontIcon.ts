import { Component, HostBinding, Input } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FontStyle, FontWeights } from "../Common";
import { TextBlockComponent } from "../text/TextBlock";

@Component({
  selector: 'FontIcon',
  template: `{{Glyph}}`,
  styles: `:host {
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
    align-content: center;
  }`
})
export class FontIconComponent extends FrameworkElementComponent {
  @Input() @HostBinding('style.font-family') FontFamily?: string;
  @Input() @HostBinding('style.font-size') FontSize?: string;
  @Input() @HostBinding('style.font-style') FontStyle?: FontStyle;  
  @Input() @HostBinding('style.color') Foreground?: string;
  
  @Input() FontWeight: FontWeights = 'Normal';

  @Input()
  get Glyph(): string | undefined {
    return this._glyph;
  }
  set Glyph(value: string | undefined) {
    this._glyph = FontIconComponent.decodeGlyph(value);
  }
  private _glyph?: string;

  @HostBinding('style.font-weight')
  private get fontWeight() {
    return TextBlockComponent.ToFontWeight(this.FontWeight);
  }

  /**
   * Decodes numeric HTML character references so a Glyph can be supplied as the
   * friendly entity form (e.g. `&#xE7B3;` or `&#59315;`) from TypeScript/signals,
   * matching the syntax used in HTML templates. In templates the HTML parser already
   * decodes the entity before it reaches the binding, so real single-character
   * glyphs pass through unchanged.
   */
  private static decodeGlyph(value: string | undefined): string | undefined {
    if (!value) return value;
    return value.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code: string) =>
      String.fromCodePoint(code[0].toLowerCase() === 'x'
        ? parseInt(code.slice(1), 16)
        : parseInt(code, 10)));
  }
}