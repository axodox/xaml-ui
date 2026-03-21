import { Component, Input } from "@angular/core";
import { Stretch } from "../Common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'Image',
  template: `<img [src]="Source" [class]="Stretch" [ngStyle]="imageStyle" [alt]="">`,
  styleUrl: 'Image.scss',
  imports: [CommonModule]
})
export class ImageComponent extends FrameworkElementComponent {
  @Input() Source?: string;
  @Input() Stretch: Stretch = 'Uniform';

  protected get imageStyle() {
    return {
      width: this.Width,
      height: this.Height,
      maxWidth: this.MaxWidth,
      maxHeight: this.MaxHeight
    }
  }
}