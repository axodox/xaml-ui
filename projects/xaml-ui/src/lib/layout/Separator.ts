import { Component, HostBinding, Input } from "@angular/core";
import { Orientation } from "xaml-ui";
import { FrameworkElementComponent } from "xaml-ui";

@Component({
  selector: 'Separator',
  template: '',
  styles: `:host {
    display: block;
    border-radius: 1px;
    background: var(--DividerStrokeColorDefault);
  }`
})
export class SeparatorComponent extends FrameworkElementComponent {
  @Input() Orientation: Orientation = 'Horizontal';

  @HostBinding('style.height')
  protected override get height() {
    if (this.Height !== undefined) return this.Height;
    return this.Orientation === 'Horizontal' ? '2px' : 'stretch';
  }

  @HostBinding('style.width')
  protected override get width() {
    if (this.Width !== undefined) return this.Width;
    return this.Orientation === 'Vertical' ? '2px' : 'stretch';
  }
}
