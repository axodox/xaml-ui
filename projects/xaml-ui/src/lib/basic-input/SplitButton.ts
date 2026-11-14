import { Component, ContentChild, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent } from "./Button";
import { DropDownButtonComponent } from "./DropDownButton";
import { GridModule } from "../layout/Grid";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { VerticalAlignment, HorizontalAlignment } from "../Common";

/**
 * A button with two parts: the main part raises `Click`, the arrow opens the `Flyout` or `MenuFlyout` inside it and
 * raises `DropDownClick` (with or without a flyout, so the owner can open a menu of its own there). Both parts are tab
 * stops; the arrow's accessible name is `DropDownLabel` (WinUI's *More options*).
 */
@Component({
  selector: 'SplitButton',
  template: `<Grid [Height]="Height" [Width]="Width" [MinWidth]="MinWidth" [MinHeight]="MinHeight" ColumnDefinitions="1fr auto">
    <Button [Padding]="Padding" CornerRadius="4px 0 0 4px" [IsEnabled]="IsEnabled" (Click)="onButtonClick()" [ngClass]="buttonClass"
            [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"><ng-content/></Button>
    <DropDownButton CornerRadius="0 4px 4px 0" (Click)="onDropDownClick($event)" [IsEnabled]="IsEnabled"
                    [Flyout]="_popup" [attr.aria-label]="DropDownLabel"/>
  </Grid>`,
  imports: [CommonModule, ButtonComponent, DropDownButtonComponent, GridModule]
})
export class SplitButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  /** The accessible name of the arrow part. */
  @Input() DropDownLabel = 'More options';

  /** The main part was clicked. */
  @Output() Click = new EventEmitter();

  /** The arrow was clicked; the event's `currentTarget` is the arrow, to open a menu at. */
  @Output() DropDownClick = new EventEmitter<Event>();

  @ContentChild('xaml-flyout')
  protected _popup?: FlyoutBaseComponent;

  protected get buttonClass() {
    return this._popup?.IsOpen ? 'flyout-open' : undefined;
  }

  protected onButtonClick() {
    if (!this.IsEnabled) return;

    this.Click.emit();
  }

  protected onDropDownClick(event: Event) {
    if (!this.IsEnabled) return;

    //The arrow opens the flyout itself (its Flyout)
    this.DropDownClick.emit(event);
  }
}
