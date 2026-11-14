import { Component } from '@angular/core';
import { CheckBoxComponent, ComboBoxComponent, DataGridComponents, DataGridGridLinesVisibility, GridModule, InfoBadgeComponent, StackPanelComponent, TextBlockComponent } from '../../../../xaml-ui/src/public-api';

type Readiness = 'Ready' | 'Limited' | 'Not ready';

interface IUnitRow {
  Unit: string;
  Echelon: string;
  Commander: { Name: string };
  Phases: Readiness[];
  Remarks: string;
}

@Component({
  selector: 'DataGridGallery',
  imports: [StackPanelComponent, TextBlockComponent, DataGridComponents, ComboBoxComponent, CheckBoxComponent, InfoBadgeComponent, GridModule],
  template: `<StackPanel Spacing="12px" Padding="12px">
    <TextBlock Text="DataGrid" FontSize="20pt" FontWeight="SemiBold" />

    <Grid ColumnDefinitions="auto 140px auto auto" ColumnSpacing="12px" HorizontalAlignment="Left">
      <TextBlock Text="GridLinesVisibility" VerticalAlignment="Center" />
      <ComboBox [ItemSource]="GridLineModes" [(SelectedValue)]="GridLines" />
      <CheckBox [(IsChecked)]="IsFrozen">FrozenColumnCount = 1</CheckBox>
      <CheckBox [(IsChecked)]="IsEnabled">IsEnabled</CheckBox>
    </Grid>

    <TextBlock Text="Units x phases: text and template columns, a rich header, single selection" FontWeight="SemiBold" />
    <DataGrid MaxWidth="760px" MaxHeight="260px" [ItemsSource]="Rows" [GridLinesVisibility]="GridLines" [FrozenColumnCount]="IsFrozen ? 1 : 0"
      [IsEnabled]="IsEnabled === true" [(SelectedIndex)]="SelectedIndex" [(SelectedItem)]="SelectedRow">
      <DataGridTextColumn Header="Unit" Binding="Unit" Width="200px" />
      <DataGridTextColumn Header="Echelon" Binding="Echelon" />
      <DataGridTextColumn Header="Commander" Binding="Commander.Name" />
      @for (phase of Phases; track phase; let index = $index) {
        <DataGridTemplateColumn [Header]="phase" Width="120px">
          <ng-template let-item>
            <StackPanel Orientation="Horizontal" Spacing="6px">
              <InfoBadge [class]="BadgeClass(item.Phases[index])" VerticalAlignment="Center" />
              <TextBlock [Text]="item.Phases[index]" VerticalAlignment="Center" />
            </StackPanel>
          </ng-template>
        </DataGridTemplateColumn>
      }
      <DataGridTextColumn Header="Remarks" Binding="Remarks" Width="260px" TextWrapping="Wrap">
        <ng-template DataGridColumnHeader>
          <TextBlock Text="Remarks (wrapping)" FontStyle="Italic" />
        </ng-template>
      </DataGridTextColumn>
    </DataGrid>
    <TextBlock [Text]="'SelectedIndex: ' + SelectedIndex + ', SelectedItem: ' + (SelectedRow?.Unit ?? 'none')" />

    <TextBlock Text="No headers, SelectionMode None, auto and star widths" FontWeight="SemiBold" />
    <DataGrid MaxWidth="480px" HeadersVisibility="None" SelectionMode="None" GridLinesVisibility="Horizontal" [ItemsSource]="FirstRows">
      <DataGridTextColumn Binding="Unit" Width="*" />
      <DataGridTextColumn Binding="Echelon" Width="Auto" />
    </DataGrid>
  </StackPanel>`
})
export class DataGridGallery {
  protected readonly GridLineModes: DataGridGridLinesVisibility[] = ['None', 'Horizontal', 'Vertical', 'All'];
  protected readonly Phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'];
  protected readonly Rows: IUnitRow[] = [
    { Unit: '1st Armoured Brigade', Echelon: 'Brigade', Commander: { Name: 'Col. Varga' }, Phases: ['Ready', 'Ready', 'Limited', 'Ready'], Remarks: 'Main effort in phase 2; one tank company held as the divisional reserve.' },
    { Unit: '2nd Mechanised Brigade', Echelon: 'Brigade', Commander: { Name: 'Col. Kovács' }, Phases: ['Ready', 'Limited', 'Limited', 'Ready'], Remarks: 'Supporting effort.' },
    { Unit: '1st Artillery Regiment', Echelon: 'Regiment', Commander: { Name: 'Lt Col. Szabó' }, Phases: ['Ready', 'Ready', 'Ready', 'Limited'], Remarks: 'Ammunition resupply needed before phase 4.' },
    { Unit: '6th Reconnaissance Squadron', Echelon: 'Squadron', Commander: { Name: 'Maj. Tóth' }, Phases: ['Ready', 'Not ready', 'Limited', 'Ready'], Remarks: 'Screens the northern flank.' },
    { Unit: '1st Engineer Battalion', Echelon: 'Battalion', Commander: { Name: 'Lt Col. Nagy' }, Phases: ['Limited', 'Ready', 'Ready', 'Ready'], Remarks: 'Bridging assets arrive at the end of phase 1.' },
    { Unit: '1st Logistics Battalion', Echelon: 'Battalion', Commander: { Name: 'Lt Col. Horváth' }, Phases: ['Ready', 'Ready', 'Not ready', 'Limited'], Remarks: 'Fuel is the limiting factor.' },
    { Unit: '1st Signal Battalion', Echelon: 'Battalion', Commander: { Name: 'Maj. Kiss' }, Phases: ['Ready', 'Ready', 'Ready', 'Ready'], Remarks: '' }
  ];

  protected readonly FirstRows = this.Rows.slice(0, 3);

  protected GridLines: DataGridGridLinesVisibility = 'Horizontal';
  protected IsFrozen: boolean | null = true;
  protected IsEnabled: boolean | null = true;
  protected SelectedIndex = 1;
  protected SelectedRow: IUnitRow | null = null;

  protected BadgeClass(readiness: Readiness) {
    switch (readiness) {
      case 'Ready': return 'SuccessDotInfoBadgeStyle';
      case 'Limited': return 'CautionDotInfoBadgeStyle';
      default: return 'CriticalDotInfoBadgeStyle';
    }
  }
}
