import { Component, OnDestroy } from '@angular/core';
import {
  ButtonComponent, CheckBoxComponent, ComboBoxComponent, GridModule, NumberBoxComponent, OpenFilePicker, RadioButtonComponent, RadioButtonGroupComponent,
  StackPanelComponent, TextBlockComponent, ToggleSwitchComponent, ToolTipServiceModule
} from '../../../../xaml-ui/src/public-api';

interface IRuleCategory {
  Id: string;
  Name: string;
  Rules: { Id: string, Name: string }[];
}

/**
 * Input controls: check boxes, radio buttons and toggle switches keep their native input (Tab, Space, screen
 * readers); a three-state check box; a NumberBox that puts the last value back for text that is not a number; a
 * ComboBox whose list and value change together; a tooltip whose content changes while it shows; the file picker's
 * fallback filter.
 */
@Component({
  selector: 'InputGallery',
  imports: [
    ButtonComponent, CheckBoxComponent, ComboBoxComponent, GridModule, NumberBoxComponent, RadioButtonComponent, RadioButtonGroupComponent,
    StackPanelComponent, TextBlockComponent, ToggleSwitchComponent, ToolTipServiceModule
  ],
  template: `
    <StackPanel Spacing="12px" Padding="12px">
      <TextBlock Text="Check boxes, radio buttons, toggle switches" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Tab reaches each box, Space toggles it, the arrow keys move between radio buttons of a group." />
      <Grid ColumnDefinitions="auto auto auto" ColumnSpacing="36px">
        <StackPanel Spacing="6px">
          <CheckBox [(IsChecked)]="Simple">Two-state ({{ Simple }})</CheckBox>
          <CheckBox [IsThreeState]="true" [(IsChecked)]="ThreeState">Three-state ({{ ThreeState }})</CheckBox>
          <CheckBox [IsChecked]="Mixed" (IsCheckedChange)="Mixed = $event">Set to null by its owner ({{ Mixed }})</CheckBox>
          <Button HorizontalAlignment="Left" (Click)="Mixed = null">Make it indeterminate</Button>
          <CheckBox [IsChecked]="true" [IsEnabled]="false">Disabled</CheckBox>
        </StackPanel>
        <RadioButtonGroup [(Value)]="Size">
          <StackPanel Spacing="6px">
            <RadioButton [Value]="'Small'">Small</RadioButton>
            <RadioButton [Value]="'Medium'">Medium</RadioButton>
            <RadioButton [Value]="'Large'">Large</RadioButton>
            <TextBlock [Text]="'Chosen: ' + Size" />
          </StackPanel>
        </RadioButtonGroup>
        <StackPanel Spacing="6px">
          <ToggleSwitch [(IsChecked)]="Switched">Show finished ({{ Switched }})</ToggleSwitch>
          <ToggleSwitch [IsChecked]="true" [IsEnabled]="false">Disabled</ToggleSwitch>
        </StackPanel>
      </Grid>

      <TextBlock Text="NumberBox" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Type text that is not a number and press Enter: the last value comes back (WinUI). Empty text clears the value; 2,5 reads as 2.5; 500 is clamped to 120." />
      <StackPanel Orientation="Horizontal" Spacing="12px">
        <NumberBox Width="160px" [Minimum]="0" [Maximum]="120" Unit="min" AutomationProperties-Name="Time budget" [(Value)]="Minutes" />
        <TextBlock VerticalAlignment="Center" [Text]="'Value: ' + Minutes" />
      </StackPanel>

      <TextBlock Text="ComboBox: list and value change together" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Changing the category replaces the rule list and picks its first rule in the same update; the rule box shows it." />
      <StackPanel Orientation="Horizontal" Spacing="12px">
        <ComboBox Width="180px" [ItemSource]="Categories" DisplayMemberPath="Name" SelectedValuePath="Id" [SelectedValue]="Category.Id" (SelectedValueChange)="OnCategory($event)" />
        <ComboBox Width="240px" [SelectedValue]="Rule" [ItemSource]="Category.Rules" DisplayMemberPath="Name" SelectedValuePath="Id" (SelectedValueChange)="Rule = $event" />
        <TextBlock VerticalAlignment="Center" [Text]="'Rule: ' + Rule" />
      </StackPanel>

      <TextBlock Text="ToolTipService: live content" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Point at the button and keep the pointer there: the tip counts up while it shows. A finger on a touch screen and the focus a click gives show no tip; Tab to it shows it." />
      <Button HorizontalAlignment="Left" [ToolTipService-ToolTip]="'Elapsed: ' + Seconds + ' s'">Live tooltip</Button>

      <TextBlock Text="OpenFilePicker: fallback filter" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" [Text]="'Without the File System Access API, the input accepts: ' + Accept" />
      <Button HorizontalAlignment="Left" (Click)="OnOpen()">Open a GeoJSON file…</Button>
      <TextBlock [Text]="'Picked: ' + Picked" />
    </StackPanel>`
})
export class InputGallery implements OnDestroy {
  protected Simple = false;
  protected ThreeState: boolean | null = false;
  protected Mixed: boolean | null = null;
  protected Size = 'Medium';
  protected Switched = true;
  protected Minutes = 15;
  protected Seconds = 0;
  protected Picked = '—';

  protected readonly Categories: IRuleCategory[] = [
    { Id: 'fires', Name: 'Fires', Rules: [{ Id: 'no-fire', Name: 'No fire' }, { Id: 'observed', Name: 'Observed fire only' }] },
    { Id: 'movement', Name: 'Movement', Rules: [{ Id: 'no-entry', Name: 'No entry' }, { Id: 'escort', Name: 'Escorted only' }, { Id: 'night', Name: 'Not at night' }] }
  ];
  protected Category = this.Categories[0];
  protected Rule = this.Category.Rules[1].Id;

  private static readonly _fileTypes: FilePickerAcceptType[] = [{ description: 'GeoJSON', accept: { 'application/geo+json': ['.geojson', '.json'] } }];
  protected readonly Accept = OpenFilePicker.ToAcceptAttribute(InputGallery._fileTypes);

  private readonly _timer = setInterval(() => this.Seconds++, 1000);

  protected OnCategory(id: string) {
    let category = this.Categories.find(p => p.Id === id);
    if (!category || category === this.Category) return;

    this.Category = category;
    this.Rule = category.Rules[0].Id;
  }

  protected async OnOpen() {
    let picker = new OpenFilePicker();
    picker.FileTypeFilter = InputGallery._fileTypes;
    let files = await picker.ShowAsync();
    this.Picked = files?.map(p => p.name).join(', ') ?? 'nothing';
  }

  ngOnDestroy(): void {
    clearInterval(this._timer);
  }
}
