import { Component } from "@angular/core";
import { ButtonComponent } from "./Button";
import { TextBlockComponent } from "../text/TextBlock";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'DropDownButton',
  imports: [TextBlockComponent, CommonModule],
  template: `<div class="content"><TextBlock *ngIf="Content !== undefined" [Text]="Content"/><ng-content select=":not(Flyout):not(MenuFlyout)"/></div>
  <div class="drop-down-glyph">&#xE70D;</div>
  <ng-content select="Flyout, MenuFlyout"/>`,
  styleUrls: ['Button.scss', 'DropDownButton.scss']
})
export class DropDownButtonComponent extends ButtonComponent {

}