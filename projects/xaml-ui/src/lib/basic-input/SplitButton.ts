import { Component, ContentChild, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent } from "./Button";
import { DropDownButtonComponent } from "./DropDownButton";
import { GridModule } from "../layout/Grid";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";

@Component({
  selector: 'SplitButton',
  template: `<Grid ColumnDefinitions="1fr auto">
    <Button CornerRadius="4px 0 0 4px" [IsEnabled]="IsEnabled" (Click)="onButtonClick()" [ngClass]="buttonClass"><ng-content/></Button>
    <DropDownButton CornerRadius="0 4px 4px 0" (Click)="onDropDownClick()" [IsEnabled]="IsEnabled"/>
  </Grid>`,
  imports: [CommonModule, ButtonComponent, DropDownButtonComponent, GridModule]
})
export class SplitButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;

  @Output() Click = new EventEmitter();

  @ContentChild('xaml-flyout')
  private _popup?: FlyoutBaseComponent;

  protected get buttonClass() {
    return this._popup?.IsOpen ? 'flyout-open' : undefined;
  }

  protected onButtonClick() {
    if (!this.IsEnabled) return;

    this.Click.emit();
  }

  protected onDropDownClick() {
    if (!this._popup || !this.IsEnabled) return;

    this._popup.IsOpen = true;
  }
}