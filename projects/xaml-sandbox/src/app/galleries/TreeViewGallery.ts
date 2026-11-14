import { Component } from '@angular/core';
import { CheckBoxComponent, FontIconComponent, GridModule, InfoBadgeComponent, StackPanelComponent, TextBlockComponent, TextBoxComponent, TreeViewComponent } from '../../../../xaml-ui/src/public-api';

interface IUnit {
  Name: string;
  Echelon: string;
  Strength?: number;
  Children?: IUnit[];
}

function unit(name: string, echelon: string, children?: IUnit[], strength?: number): IUnit {
  return { Name: name, Echelon: echelon, Children: children, Strength: strength };
}

@Component({
  selector: 'TreeViewGallery',
  imports: [StackPanelComponent, TextBlockComponent, TreeViewComponent, TextBoxComponent, CheckBoxComponent, FontIconComponent, InfoBadgeComponent, GridModule],
  template: `<StackPanel Spacing="12px" Padding="12px">
    <TextBlock Text="TreeView" FontSize="20pt" FontWeight="SemiBold" />
    <CheckBox [(IsChecked)]="IsEnabled">IsEnabled</CheckBox>

    <Grid ColumnDefinitions="1fr 1fr" ColumnSpacing="24px">
      <StackPanel Spacing="6px">
        <TextBlock Text="Single selection, item template, search expands matches" FontWeight="SemiBold" />
        <TextBox PlaceholderText="Search units" [(Text)]="Search" (TextChange)="OnSearch($event)" />
        <TreeView [ItemsSource]="Orbat" SelectionMode="Single" [(SelectedItem)]="SelectedUnit" [(ExpandedItems)]="Expanded" [IsEnabled]="IsEnabled === true"
          (ItemInvoked)="Report = 'ItemInvoked: ' + $event.Name" (Expanding)="Report = 'Expanding: ' + $event.Name" (Collapsed)="Report = 'Collapsed: ' + $event.Name">
          <ng-template let-item>
            <Grid ColumnDefinitions="auto 1fr auto" ColumnSpacing="8px">
              <FontIcon [Glyph]="item.Children ? GroupGlyph : UnitGlyph" VerticalAlignment="Center" />
              <TextBlock [Text]="item.Name" [FontWeight]="Matches(item) ? 'Bold' : 'Normal'" VerticalAlignment="Center" />
              @if (item.Strength !== undefined) {
                <InfoBadge Class="InformationalValueInfoBadgeStyle" [Value]="item.Strength" VerticalAlignment="Center" />
              }
            </Grid>
          </ng-template>
        </TreeView>
        <TextBlock [Text]="'SelectedItem: ' + (SelectedUnit?.Name ?? 'none')" />
        <TextBlock [Text]="'ExpandedItems: ' + Names(Expanded)" TextWrapping="Wrap" />
      </StackPanel>

      <StackPanel Spacing="6px">
        <TextBlock Text="Multiple selection (check boxes), DisplayMemberPath" FontWeight="SemiBold" />
        <TreeView [ItemsSource]="Orbat" SelectionMode="Multiple" DisplayMemberPath="Name" [(SelectedItems)]="SelectedUnits" [(ExpandedItems)]="ExpandedMultiple"
          [IsEnabled]="IsEnabled === true" (ItemInvoked)="Report = 'ItemInvoked: ' + $event.Name" />
        <TextBlock [Text]="'SelectedItems: ' + Names(SelectedUnits)" TextWrapping="Wrap" />

        <TextBlock Text="SelectionMode None" FontWeight="SemiBold" />
        <TreeView [ItemsSource]="DivisionalTroops" SelectionMode="None" DisplayMemberPath="Name" [IsEnabled]="IsEnabled === true" (ItemInvoked)="Report = 'ItemInvoked: ' + $event.Name" />
      </StackPanel>
    </Grid>
    <TextBlock [Text]="'Events: ' + Report" />
  </StackPanel>`
})
export class TreeViewGallery {
  protected readonly Orbat: IUnit[] = [
    unit('1st Armoured Division', 'Division', [
      unit('1st Armoured Brigade', 'Brigade', [
        unit('1st Tank Battalion', 'Battalion', undefined, 44),
        unit('2nd Tank Battalion', 'Battalion', undefined, 41),
        unit('3rd Mechanised Infantry Battalion', 'Battalion', undefined, 52)
      ]),
      unit('2nd Mechanised Brigade', 'Brigade', [
        unit('4th Mechanised Infantry Battalion', 'Battalion', undefined, 50),
        unit('5th Mechanised Infantry Battalion', 'Battalion', undefined, 48),
        unit('6th Reconnaissance Squadron', 'Squadron', undefined, 18)
      ]),
      unit('1st Artillery Regiment', 'Regiment', [
        unit('A Battery', 'Battery', undefined, 6),
        unit('B Battery', 'Battery', undefined, 6),
        unit('C Battery', 'Battery', undefined, 5)
      ])
    ]),
    unit('Divisional Troops', 'Group', [
      unit('1st Engineer Battalion', 'Battalion', undefined, 30),
      unit('1st Signal Battalion', 'Battalion', undefined, 22),
      unit('1st Logistics Battalion', 'Battalion', undefined, 60)
    ])
  ];

  protected readonly DivisionalTroops = [this.Orbat[1]];
  protected readonly GroupGlyph = '\uE902';
  protected readonly UnitGlyph = '\uE77B';

  protected IsEnabled: boolean | null = true;
  protected Search = '';
  protected SelectedUnit: IUnit | null = null;
  protected SelectedUnits: IUnit[] = [];
  protected Expanded: IUnit[] = [this.Orbat[0]];
  protected ExpandedMultiple: IUnit[] = [this.Orbat[0], this.Orbat[0].Children![0]];
  protected Report = 'none yet';

  protected Names(units: IUnit[]) {
    return units.length > 0 ? units.map(p => p.Name).join(', ') : 'none';
  }

  protected Matches(unit: IUnit) {
    return this.Search.length > 0 && unit.Name.toLowerCase().includes(this.Search.toLowerCase());
  }

  //Expands every ancestor of a matching unit
  protected OnSearch(text: string) {
    this.Search = text;
    if (!text) return;

    let expanded: IUnit[] = [];
    let walk = (units: IUnit[], path: IUnit[]) => {
      for (let item of units) {
        if (this.Matches(item)) expanded.push(...path.filter(p => !expanded.includes(p)));
        walk(item.Children ?? [], [...path, item]);
      }
    };
    walk(this.Orbat, []);
    this.Expanded = expanded;
  }
}
