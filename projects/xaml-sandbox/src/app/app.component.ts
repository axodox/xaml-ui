import { Component, ViewContainerRef } from '@angular/core';
import { RadioToggleButtonComponent, XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { StackPanelComponent } from "../../../xaml-ui/src/lib/layout/StackPanel";
import { ButtonComponent } from "../../../xaml-ui/src/lib/basic-input/Button";
import { FlyoutComponent } from "../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout";
import { ScrollViewerComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollViewer";
import { RadioButtonGroupComponent } from "../../../xaml-ui/src/lib/basic-input/RadioButton";
import { SliderComponent } from "../../../xaml-ui/src/lib/basic-input/Slider";
import { TextBoxComponent } from "../../../xaml-ui/src/lib/text/TextBox";
import { TextBlockComponent } from "../../../xaml-ui/src/lib/text/TextBlock";
import { ListViewComponent } from "../../../xaml-ui/src/lib/collections/ListView";
import { ComboBoxComponent } from "../../../xaml-ui/src/lib/basic-input/ComboBox";
import { MenuFlyoutComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyout";
import { MenuFlyoutItemComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyoutItem";
import { ContextFlyoutDirective, ItemFlyoutDirective } from '../../../xaml-ui/src/lib/dialogs-and-flyouts/ContextFlyout';
import { AppBarButtonComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/AppBarButton";
import { CommandBarComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/CommandBar";
import { NumberBoxComponent } from "../../../xaml-ui/src/lib/text/NumberBox";
import { RepeatButtonComponent } from "../../../xaml-ui/src/lib/basic-input/RepeatButton";
import { ColorPickerComponent } from "../../../xaml-ui/src/lib/basic-input/ColorPicker";
import { Color, colorToString } from '../../../xaml-ui/src/lib/Color';
import { DialogPresenter } from "../../../xaml-ui/src/lib/primitives/DialogPresenter";
import { ContentDialog, ContentDialogButton } from '../../../xaml-ui/src/lib/dialogs-and-flyouts/ContentDialog';
import { Dialog } from '../../../xaml-ui/src/lib/dialogs-and-flyouts/Dialog';
import { GridModule } from "../../../xaml-ui/src/lib/layout/Grid";
import { ToggleButtonComponent } from "../../../xaml-ui/src/lib/basic-input/ToggleButton";
import { GridView } from '../../../xaml-ui/src/lib/collections/GridView';
import { CommonModule } from '@angular/common';
import { ToggleMenuFlyoutItemComponent } from '../../../xaml-ui/src/lib/menus-and-toolbars/ToggleMenuFlyoutItem';
import { FontIconComponent } from "../../../xaml-ui/src/lib/icons/FontIcon";

@Component({
  template: `<ng-template #template>
    <DialogPresenter>
      <div Header>Title</div>
      <div>This is a text dialog.</div>
      <div Footer>Footer.</div>
    </DialogPresenter>
  </ng-template>`,
  imports: [DialogPresenter]
})
export class CustomDialog extends Dialog {
  constructor() {
    super();
    this.IsBackdropDismissEnabled = true;
  }
}

@Component({
  selector: 'app-root',
  imports: [
    XamlRootComponent,
    StackPanelComponent,
    ButtonComponent,
    FlyoutComponent,
    ScrollViewerComponent,
    SliderComponent,
    TextBoxComponent,
    TextBlockComponent,
    ListViewComponent,
    ComboBoxComponent,
    MenuFlyoutComponent,
    MenuFlyoutItemComponent,
    ContextFlyoutDirective,
    AppBarButtonComponent,
    CommandBarComponent,
    NumberBoxComponent,
    GridModule,
    RepeatButtonComponent,
    ColorPickerComponent,
    RadioButtonGroupComponent,
    FlyoutComponent,
    ContextFlyoutDirective,
    RadioToggleButtonComponent,
    ToggleButtonComponent,
    ToggleMenuFlyoutItemComponent, 
    ItemFlyoutDirective,
    GridView,
    FontIconComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xaml-sandbox';

  constructor(private _viewContainerRef: ViewContainerRef) {

  }

  onValueChange(value: any) {
    console.log(value);
  }

  onClick() {
    console.log('click');
  }

  onColorSelected(value: Color) {
    console.log(colorToString(value));
  }

  async onDialogClick() {
    let dialog = Dialog.Create(ContentDialog, this._viewContainerRef);
    dialog.Title = "Something";
    dialog.Content = "Hello world!";
    dialog.PrimaryButtonText = "OK";
    dialog.SecondaryButtonText = "Cancel";
    dialog.DefaultButton = ContentDialogButton.Primary;

    let result = await dialog.ShowAsync();
    console.log(`Dialog result: ${result}`);
  }

  async onCustomDialogClick() {
    let dialog = Dialog.Create(CustomDialog, this._viewContainerRef);

    await dialog.ShowAsync();
  }
}
