import { Component } from "@angular/core";
import { ButtonComponent, ButtonTemplate } from "./Button";
import { TextBlockComponent } from "../text/TextBlock";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'DropDownButton',
  imports: [TextBlockComponent, CommonModule],
  template: ButtonTemplate + `<div class="drop-down-glyph">&#xE70D;</div>`,
  styleUrls: ['Button.scss', 'DropDownButton.scss']
})
export class DropDownButtonComponent extends ButtonComponent {
  
}