import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ButtonComponent } from "./Button";
import { DropDownButtonComponent } from "./DropDownButton";
import { GridModule } from "../layout/Grid";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { FlyoutPlacementMode, HorizontalAlignment } from "../Common";

@Component({
  selector: 'SplitButton',
  template: `<Grid [Height]="Height" [Width]="Width" ColumnDefinitions="1fr auto">
    <Button [Padding]="buttonPadding" CornerRadius="4px 0 0 4px" [HorizontalContentAlignment]="HorizontalContentAlignment" [IsEnabled]="IsEnabled" (Click)="onButtonClick()" [ngClass]="buttonClass"><ng-content/></Button>
    <DropDownButton [Padding]="dropdownPadding" #dropDown CornerRadius="0 4px 4px 0" Width="36px" (Click)="onDropDownClick()" [IsEnabled]="IsEnabled"/>
  </Grid>`,
  imports: [CommonModule, ButtonComponent, DropDownButtonComponent, GridModule]
})
export class SplitButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;

  @Input() Placement: FlyoutPlacementMode = 'BottomEdgeAlignedLeft';

  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center'

  @Input() InnerPadding?: string | undefined;

  @Output() Click = new EventEmitter();

  @ContentChild('xaml-flyout')
  private _popup?: FlyoutBaseComponent;

  @ViewChild('dropDown', { read: ElementRef })
  private _dropDown?: ElementRef;

  protected get buttonClass() {
    return this._popup?.IsOpen ? 'flyout-open' : undefined;
  }

  protected onButtonClick() {
    if (!this.IsEnabled) return;

    this.Click.emit();
  }

  protected get buttonPadding() {
    let paddingArray = this.InnerPadding?.split(' ');
    switch (paddingArray?.length) {
      case 1:
        return paddingArray[0] + ' ' + 'var(--ButtonHorizontalPadding)' + ' ' + paddingArray[0] + ' ' + paddingArray[0];
      case 2:
        return paddingArray[0] + ' ' + 'var(--ButtonHorizontalPadding)' + ' ' + paddingArray[0] + ' ' + paddingArray[1];
      case 3:
        return paddingArray[0] + ' ' + 'var(--ButtonHorizontalPadding)' + ' ' + paddingArray[2] + ' ' + paddingArray[1];
      case 4:
        return paddingArray[0] + ' ' + 'var(--ButtonHorizontalPadding)' + ' ' + paddingArray[2] + ' ' + paddingArray[3];
      default:
        return this.InnerPadding;
    }
  }

  protected get dropdownPadding() {
    let paddingArray = this.InnerPadding?.split(' ');
    switch (paddingArray?.length) {
      case 1:
        return paddingArray[0] + ' ' + paddingArray[0] + ' ' + paddingArray[0] + ' ' + 'var(--ButtonHorizontalPadding)';
      case 2:
        return paddingArray[0] + ' ' + paddingArray[1] + ' ' + paddingArray[0] + ' ' + 'var(--ButtonHorizontalPadding)';
      case 3:
        return paddingArray[0] + ' ' + paddingArray[1] + ' ' + paddingArray[2] + ' ' + 'var(--ButtonHorizontalPadding)';
      case 4:
        return paddingArray[0] + ' ' + paddingArray[1] + ' ' + paddingArray[2] + ' ' + 'var(--ButtonHorizontalPadding)';
      default:
        return this.InnerPadding;
    }
  }

  protected onDropDownClick() {
    if (!this._popup || !this.IsEnabled) return;

    this._popup.Placement = this.Placement;
    if (this._dropDown) this._popup.Target = this._dropDown.nativeElement;
    this._popup.IsOpen = true;
  }
}