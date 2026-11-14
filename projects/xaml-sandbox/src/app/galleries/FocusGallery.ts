import { Component } from '@angular/core';
import {
  AppBarButtonComponent, ButtonComponent, CommandBarComponent, DropDownButtonComponent, GridModule, HyperlinkButtonComponent,
  ListBoxComponent, ListViewComponent, MenuFlyoutComponent, MenuFlyoutItemComponent, RadioButtonGroupComponent, RadioToggleButtonComponent,
  RepeatButtonComponent, SplitButtonComponent, StackPanelComponent, TextBlockComponent, ToggleButtonComponent
} from '../../../../xaml-ui/src/public-api';

/**
 * Keyboard focus: every button is a tab stop (Tab moves through them in order), **Enter** or **Space** clicks it, and
 * it shows WinUI's focus ring; lists are one tab stop whose rows the arrow keys move through. `XamlButton` is the
 * self-closed form of `Button`. The split button's arrow raises its own event.
 */
@Component({
  selector: 'FocusGallery',
  imports: [
    AppBarButtonComponent, ButtonComponent, CommandBarComponent, DropDownButtonComponent, GridModule, HyperlinkButtonComponent,
    ListBoxComponent, ListViewComponent, MenuFlyoutComponent, MenuFlyoutItemComponent, RadioButtonGroupComponent, RadioToggleButtonComponent,
    RepeatButtonComponent, SplitButtonComponent, StackPanelComponent, TextBlockComponent, ToggleButtonComponent
  ],
  template: `
    <StackPanel Spacing="12px" Padding="12px">
      <TextBlock Text="Keyboard focus" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Press Tab to move through the controls, Enter or Space to click. Each one shows the focus ring only for the keyboard." />

      <TextBlock Text="Buttons" FontWeight="SemiBold" />
      <StackPanel Orientation="Horizontal" Spacing="8px">
        <Button (Click)="Log('Button')">Button</Button>
        <XamlButton Content="XamlButton (self-closed)" (Click)="Log('XamlButton')" />
        <ToggleButton [(IsChecked)]="IsToggled" (Click)="Log('ToggleButton ' + !IsToggled)">ToggleButton</ToggleButton>
        <HyperlinkButton Content="HyperlinkButton" (Click)="Log('HyperlinkButton')" />
        <RepeatButton (Click)="Log('RepeatButton ' + (++Repeats))">RepeatButton</RepeatButton>
        <Button [IsEnabled]="false">Disabled</Button>
        <Button [IsTabStop]="false" (Click)="Log('Not a tab stop')">IsTabStop false</Button>
      </StackPanel>

      <TextBlock Text="Drop-down and split buttons" FontWeight="SemiBold" />
      <StackPanel Orientation="Horizontal" Spacing="8px">
        <DropDownButton Content="DropDownButton">
          <MenuFlyout Placement="BottomEdgeAlignedLeft">
            <MenuFlyoutItem Text="First" (Click)="Log('DropDownButton: First')" />
            <MenuFlyoutItem Text="Second" (Click)="Log('DropDownButton: Second')" />
          </MenuFlyout>
        </DropDownButton>
        <SplitButton (Click)="Log('SplitButton: main part')" (DropDownClick)="Log('SplitButton: arrow (DropDownClick)')">With a flyout
          <MenuFlyout Placement="BottomEdgeAlignedLeft">
            <MenuFlyoutItem Text="Option A" (Click)="Log('SplitButton: Option A')" />
            <MenuFlyoutItem Text="Option B" (Click)="Log('SplitButton: Option B')" />
          </MenuFlyout>
        </SplitButton>
        <SplitButton DropDownLabel="Choose another role" (Click)="Log('Approve')" (DropDownClick)="Log('Arrow without a flyout: the owner opens its own menu')">Objective?</SplitButton>
      </StackPanel>

      <TextBlock Text="AppBarButton and RadioToggleButton" FontWeight="SemiBold" />
      <StackPanel Orientation="Horizontal" Spacing="8px">
        <CommandBar>
          <AppBarButton Icon="&#xE710;" Text="Add" (Click)="Log('AppBarButton: Add')" />
          <AppBarButton Icon="&#xE74D;" Text="Delete" (Click)="Log('AppBarButton: Delete')" />
          <AppBarButton Icon="&#xE719;" Text="Disabled" [IsEnabled]="false" />
        </CommandBar>
        <RadioButtonGroup [Value]="Segment" (ValueChange)="Segment = $event; Log('Segment ' + $event)">
          <StackPanel Orientation="Horizontal" Spacing="2px">
            <RadioToggleButton [Value]="0">Day</RadioToggleButton>
            <RadioToggleButton [Value]="1">Week</RadioToggleButton>
            <RadioToggleButton [Value]="2">Month</RadioToggleButton>
          </StackPanel>
        </RadioButtonGroup>
      </StackPanel>

      <TextBlock Text="Lists: one tab stop, arrows move the focus and the selection, Enter or Space clicks" FontWeight="SemiBold" />
      <Grid ColumnDefinitions="240px 240px" ColumnSpacing="12px">
        <ListView MaxHeight="200px" [ItemSource]="Units" [(SelectedIndex)]="SelectedUnit" (ItemClick)="Log('ListView: clicked ' + Units[$event])" />
        <ListBox [ItemSource]="Units" (ItemClick)="Log('ListBox: clicked ' + Units[$event])" />
      </Grid>

      <TextBlock [Text]="'Last: ' + Last" Foreground="var(--TextFillColorSecondary)" />
    </StackPanel>`
})
export class FocusGallery {
  protected IsToggled = false;
  protected Repeats = 0;
  protected Segment = 0;
  protected SelectedUnit = 0;
  protected Last = '—';
  protected readonly Units = ['1st Battalion', '2nd Battalion', '3rd Battalion', 'Recon Company', 'Artillery Battery', 'Engineer Company'];

  protected Log(text: string) {
    this.Last = text;
  }
}
