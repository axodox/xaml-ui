import { Component, HostBinding, Input } from "@angular/core";
import { Border } from "../layout/Border";

@Component({
  selector: 'Button',
  template: `<ng-container><ng-content/></ng-container>`,
  styleUrl: 'Button.scss'
})
export class Button extends Border {
  @Input() IsEnabled: boolean = true;

  @HostBinding('attr.disabled')
  private get disabled() {
    return this.IsEnabled ? undefined : true;
  }
}