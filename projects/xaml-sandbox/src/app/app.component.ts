import { Component, ViewContainerRef } from '@angular/core';
import {
  AppBarButtonComponent,
  BorderComponent,
  ButtonComponent,
  CheckBoxComponent,
  Color,
  colorToString,
  ColorPickerComponent,
  ComboBoxComponent,
  CommandBarComponent,
  ContentDialog,
  ContentDialogButton,
  ContextFlyoutDirective,
  Dialog,
  DialogPresenter,
  DropDownButtonComponent,
  EllipseComponent,
  FlyoutComponent,
  FontIconComponent,
  GridModule,
  GridViewComponent,
  HyperlinkButtonComponent,
  ImageComponent,
  ItemFlyoutDirective,
  ListViewComponent,
  MenuFlyoutComponent,
  MenuFlyoutItemComponent,
  NumberBoxComponent,
  OpenFilePicker,
  PersonPictureComponent,
  ProgressBarComponent,
  ProgressRingComponent,
  RadioButtonComponent,
  RadioButtonGroupComponent,
  RadioToggleButtonComponent,
  RepeatButtonComponent,
  ScrollViewerComponent,
  SeparatorComponent,
  SliderComponent,
  SplitButtonComponent,
  StackPanelComponent,
  TextBlockComponent,
  TextBoxComponent,
  ToggleButtonComponent,
  ToggleMenuFlyoutItemComponent,
  XamlRootComponent
} from '../../../xaml-ui/src/public-api';

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

export class KeyValuePair {
  constructor(
    public Key: string,
    public Value: string) { }
}

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, StackPanelComponent, ButtonComponent, FlyoutComponent, ScrollViewerComponent, SliderComponent, TextBoxComponent, TextBlockComponent, ListViewComponent, ComboBoxComponent, MenuFlyoutComponent, MenuFlyoutItemComponent, ContextFlyoutDirective, AppBarButtonComponent, CommandBarComponent, NumberBoxComponent, GridModule, RepeatButtonComponent, ColorPickerComponent, RadioButtonGroupComponent, FlyoutComponent, ContextFlyoutDirective, RadioToggleButtonComponent, ToggleButtonComponent, ToggleMenuFlyoutItemComponent, ItemFlyoutDirective, FontIconComponent, ProgressBarComponent, ProgressRingComponent, GridViewComponent, PersonPictureComponent, EllipseComponent, CheckBoxComponent, RadioButtonComponent, HyperlinkButtonComponent, ImageComponent, BorderComponent, SeparatorComponent, DropDownButtonComponent, SplitButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'xaml-sandbox';

  protected TestCollection = [
    new KeyValuePair('A', 'Aladár'),
    new KeyValuePair('B', 'Béla'),
    new KeyValuePair('C', 'Cecília')
  ];

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

  async OnOpenJsonClick() {
    let openFilePicker = new OpenFilePicker();
    openFilePicker.SettingsIdentifier = "xaml-sandbox-json";
    openFilePicker.SuggestedStartLocation = "documents";
    openFilePicker.AllowMultiple = false;
    openFilePicker.FileTypeFilter = [
      {
        "description": "JSON files",
        "accept": { "application/json": ".json" }
      }
    ];
    const results = await openFilePicker.ShowAsync();
    if (results) {
      console.log(`File read: ${await results[0].text()}.`);
    }
    else {
      console.log('No file selected.');
    }
  }
}
