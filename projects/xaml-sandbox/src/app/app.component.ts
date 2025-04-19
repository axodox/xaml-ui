import { Component } from '@angular/core';
import { XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { StackPanelComponent } from "../../../xaml-ui/src/lib/layout/StackPanel";
import { ButtonComponent } from "../../../xaml-ui/src/lib/basic-input/Button";
import { FlyoutComponent } from "../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout";
import { ListBoxComponent } from "../../../xaml-ui/src/lib/collections/ListBox";
import { ScrollViewerComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollViewer";
import { ScrollBarComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollBar";
import { CheckBoxComponent } from "../../../xaml-ui/src/lib/basic-input/CheckBox";
import { RadioButtonComponent } from "../../../xaml-ui/src/lib/basic-input/RadioButton";
import { SliderComponent } from "../../../xaml-ui/src/lib/basic-input/Slider";
import { ToggleSwitchComponent } from "../../../xaml-ui/src/lib/basic-input/ToggleSwitch";
import { TextBoxComponent } from "../../../xaml-ui/src/lib/text/TextBox";
import { TextBlockComponent } from "../../../xaml-ui/src/lib/text/TextBlock";
import { ListViewComponent } from "../../../xaml-ui/src/lib/collections/ListView";
import { ComboBoxComponent } from "../../../xaml-ui/src/lib/basic-input/ComboBox";
import { DropDownButtonComponent } from "../../../xaml-ui/src/lib/basic-input/DropDownButton";

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, StackPanelComponent, ButtonComponent, FlyoutComponent, ListBoxComponent, ScrollViewerComponent, ScrollBarComponent, CheckBoxComponent, RadioButtonComponent, SliderComponent, ToggleSwitchComponent, TextBoxComponent, TextBlockComponent, ListViewComponent, ComboBoxComponent, DropDownButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xaml-sandbox';
}
