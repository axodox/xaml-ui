import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ButtonComponent } from "./Button";
import { DropDownButtonComponent } from "./DropDownButton";
import { GridModule } from "../layout/Grid";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { VerticalAlignment, HorizontalAlignment } from "../Common";

@Component({
  selector: 'SplitButton',
  template: `<Grid [Height]="Height" [Width]="Width" [MinWidth]="MinWidth" [MinHeight]="MinHeight" ColumnDefinitions="1fr auto">
    <Button [Padding]="Padding" CornerRadius="4px 0 0 4px" [IsEnabled]="IsEnabled" (Click)="onButtonClick()" [ngClass]="buttonClass"
            [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"><ng-content/></Button>
    <DropDownButton CornerRadius="0 4px 4px 0" (Click)="onDropDownClick()" [IsEnabled]="IsEnabled"/>
  </Grid>`,
  imports: [CommonModule, ButtonComponent, DropDownButtonComponent, GridModule]
})
export class SplitButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

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