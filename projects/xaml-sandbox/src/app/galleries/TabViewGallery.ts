import { Component } from '@angular/core';
import { ButtonComponent, CheckBoxComponent, ComboBoxComponent, FontIconComponent, GridModule, InfoBadgeComponent, StackPanelComponent, TabViewComponent, TabViewItemComponent, TabViewTabCloseRequestedEventArgs, TabViewWidthMode, TextBlockComponent, TextBoxComponent } from '../../../../xaml-ui/src/public-api';

interface IDocumentTab {
  Id: number;
  Header: string;
  Icon: string;
  Notes: string;
}

@Component({
  selector: 'TabViewGallery',
  imports: [StackPanelComponent, TextBlockComponent, TabViewComponent, TabViewItemComponent, InfoBadgeComponent, ButtonComponent, ComboBoxComponent, CheckBoxComponent, FontIconComponent, TextBoxComponent, GridModule],
  template: `<StackPanel Spacing="12px" Padding="12px">
    <TextBlock Text="TabView" FontSize="20pt" FontWeight="SemiBold" />

    <Grid ColumnDefinitions="auto 160px auto" ColumnSpacing="12px" HorizontalAlignment="Left">
      <TextBlock Text="TabWidthMode" VerticalAlignment="Center" />
      <ComboBox [ItemSource]="WidthModes" [(SelectedValue)]="WidthMode" />
      <CheckBox [(IsChecked)]="IsEnabled">IsEnabled</CheckBox>
    </Grid>

    <TextBlock Text="Fixed tabs with icons, counts as InfoBadges, a header and a footer button" FontWeight="SemiBold" />
    <TabView Height="200px" [TabWidthMode]="WidthMode" [(SelectedIndex)]="SelectedIndex" [IsEnabled]="IsEnabled === true">
      <FontIcon TabStripHeader Glyph="&#xE8A1;" Margin="0 0 0 8px" />
      <TabViewItem Header="Units" Icon="&#xE716;" [IsClosable]="false">
        <StackPanel Padding="12px" Spacing="6px">
          <TextBlock Text="The units of the operation. Type here, switch tabs and come back: the text stays." />
          <TextBox PlaceholderText="Notes" />
        </StackPanel>
      </TabViewItem>
      <TabViewItem Header="Tasks" Icon="&#xE9D5;" [IsClosable]="false">
        <InfoBadge TabViewItemIcon Class="AttentionValueInfoBadgeStyle" [Value]="TaskCount" />
        <StackPanel Padding="12px" Spacing="6px">
          <TextBlock [Text]="TaskCount + ' open tasks.'" />
          <Button HorizontalAlignment="Left" (Click)="TaskCount = TaskCount + 1">Add a task</Button>
        </StackPanel>
      </TabViewItem>
      <TabViewItem Icon="&#xE7BA;" Header="Warnings" [IsClosable]="false">
        <InfoBadge TabViewItemIcon Class="CriticalValueInfoBadgeStyle" [Value]="3" />
        <TextBlock Padding="12px" Text="Three warnings." />
      </TabViewItem>
      <TabViewItem Header="Log" [IsClosable]="false">
        <TextBlock Padding="12px" Text="A tab without an icon keeps its header in Compact mode." />
      </TabViewItem>
      <Button TabStripFooter HorizontalAlignment="Right" Margin="0 0 8px 0" (Click)="Report = 'Footer button clicked'">Export</Button>
    </TabView>
    <TextBlock [Text]="'SelectedIndex: ' + SelectedIndex" />

    <TextBlock Text="Closable tabs with an add button and projected headers" FontWeight="SemiBold" />
    <TabView Height="180px" [TabWidthMode]="WidthMode" [IsAddTabButtonVisible]="true" [IsEnabled]="IsEnabled === true"
      [(SelectedIndex)]="DocumentIndex" (AddTabButtonClick)="OnAddTab()" (TabCloseRequested)="OnTabCloseRequested($event)">
      @for (tab of Documents; track tab.Id) {
        <TabViewItem [Header]="tab.Header" [Icon]="tab.Icon">
          <TextBlock Padding="12px" [Text]="tab.Notes" />
        </TabViewItem>
      }
      <TabViewItem Icon="&#xE734;" [IsClosable]="false">
        <TextBlock TabViewItemHeader FontStyle="Italic" Text="Projected header" />
        <TextBlock Padding="12px" Text="This tab's header is projected content, not the Header text." />
      </TabViewItem>
    </TabView>
    <TextBlock [Text]="'Events: ' + Report" />
  </StackPanel>`
})
export class TabViewGallery {
  protected readonly WidthModes: TabViewWidthMode[] = ['Equal', 'SizeToContent', 'Compact'];
  protected WidthMode: TabViewWidthMode = 'Equal';
  protected IsEnabled: boolean | null = true;
  protected SelectedIndex = 0;
  protected TaskCount = 7;

  private _nextId = 4;
  protected Documents: IDocumentTab[] = [
    { Id: 1, Header: 'Phase 1 - Shaping', Icon: '\uE8A5', Notes: 'Shaping operations.' },
    { Id: 2, Header: 'Phase 2 - Decisive', Icon: '\uE8A5', Notes: 'Decisive operations.' },
    { Id: 3, Header: 'Phase 3 - Sustaining', Icon: '\uE8A5', Notes: 'Sustaining operations.' }
  ];
  protected DocumentIndex = 0;
  protected Report = 'none yet';

  protected OnAddTab() {
    let id = this._nextId++;
    this.Documents = [...this.Documents, { Id: id, Header: `Phase ${id}`, Icon: '\uE8A5', Notes: `Phase ${id}, added by the add button.` }];
    this.DocumentIndex = this.Documents.length - 1;
    this.Report = `AddTabButtonClick (added Phase ${id})`;
  }

  protected OnTabCloseRequested(args: TabViewTabCloseRequestedEventArgs) {
    this.Report = `TabCloseRequested: index ${args.Index}, "${args.Tab.Header}"`;
    this.Documents = this.Documents.filter((p, i) => i !== args.Index);
  }
}
