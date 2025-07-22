import { Component } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'CommandBar',
  template: `<ng-content/>`,
  styleUrl: 'CommandBar.scss'
})
export class CommandBarComponent extends FrameworkElementComponent {

}
