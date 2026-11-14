import { Component } from '@angular/core';
import {
  ButtonComponent, FontIconComponent, GridModule, MenuFlyoutComponent, MenuFlyoutItemComponent, MenuFlyoutSeparator, RadioMenuFlyoutItemComponent,
  StackPanelComponent, TextBlockComponent, ToggleMenuFlyoutItemComponent
} from '../../../../xaml-ui/src/public-api';

/**
 * Menus: items with keyboard accelerators and notes, a destructive item in the critical colour, a disabled item (a
 * click on it leaves the menu open), toggle and radio items. Keys: ↓ ↑ Home End move, Enter or Space chooses, Esc
 * closes; opened from the keyboard, the first item has the focus.
 */
@Component({
  selector: 'MenuFlyoutGallery',
  imports: [
    ButtonComponent, FontIconComponent, GridModule, MenuFlyoutComponent, MenuFlyoutItemComponent, MenuFlyoutSeparator, RadioMenuFlyoutItemComponent,
    StackPanelComponent, TextBlockComponent, ToggleMenuFlyoutItemComponent
  ],
  template: `
    <StackPanel Spacing="12px" Padding="12px">
      <TextBlock Text="MenuFlyout" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Tab to a button and press Enter: the first item has the focus; ↓ ↑ Home End move (wrapping around), Enter or Space chooses, Esc closes and the focus is back on the button. With the mouse the focus follows the pointer." />

      <Grid ColumnDefinitions="auto auto 1fr auto" ColumnSpacing="8px">
        <Button>File
          <MenuFlyout Placement="BottomEdgeAlignedLeft">
            <MenuFlyoutItem Text="New session" Icon="&#xE710;" KeyboardAcceleratorTextOverride="Ctrl+N" (Click)="Log('New session')" />
            <MenuFlyoutItem Text="Open…" Icon="&#xE8E5;" KeyboardAcceleratorTextOverride="Ctrl+O" (Click)="Log('Open')" />
            <MenuFlyoutItem Text="Save" Icon="&#xE74E;" KeyboardAcceleratorTextOverride="Ctrl+S" (Click)="Log('Save')" />
            <MenuFlyoutItem Text="Export synchronization matrix" Icon="&#xEDE1;" Note=".xlsx" (Click)="Log('Export')" />
            <MenuFlyoutItem Text="Restore point" Icon="&#xE81C;" Note="nothing saved yet" [IsEnabled]="false" (Click)="Log('never')" />
            <MenuFlyoutSeparator />
            <MenuFlyoutItem Text="Delete session" Icon="&#xE74D;" Foreground="var(--SystemFillColorCritical)" KeyboardAcceleratorTextOverride="Del" (Click)="Log('Delete')" />
          </MenuFlyout>
        </Button>
        <Button>View
          <MenuFlyout Placement="BottomEdgeAlignedLeft">
            <ToggleMenuFlyoutItem Text="Show grid" [(IsChecked)]="ShowGrid" KeyboardAcceleratorTextOverride="G" (Click)="Log('Show grid: ' + ShowGrid)" />
            <ToggleMenuFlyoutItem Text="Show labels" [(IsChecked)]="ShowLabels" (Click)="Log('Show labels: ' + ShowLabels)" />
            <MenuFlyoutSeparator />
            @for (marking of Markings; track marking) {
              <RadioMenuFlyoutItem GroupName="Marking" [Text]="marking" [IsChecked]="Marking === marking" [Note]="Marking === marking ? 'current' : undefined"
                (Click)="Marking = marking; Log('Marking: ' + marking)" />
            }
          </MenuFlyout>
        </Button>
        <TextBlock VerticalAlignment="Center" [Text]="'Last: ' + Last" Foreground="var(--TextFillColorSecondary)" />
        <Button>At the right edge
          <MenuFlyout Placement="BottomEdgeAlignedLeft">
            <MenuFlyoutItem Text="Export decision support matrix" Note=".xlsx" (Click)="Log('Export DSM')" />
            <MenuFlyoutItem Text="Export COA statement" Note=".docx" (Click)="Log('Export statement')" />
          </MenuFlyout>
        </Button>
      </Grid>

      <TextBlock Text="Custom accelerator content (KeyboardAccelerator slot)" FontWeight="SemiBold" />
      <Button HorizontalAlignment="Left">Custom
        <MenuFlyout Placement="BottomEdgeAlignedLeft">
          <MenuFlyoutItem Text="Undo" Icon="&#xE7A7;" (Click)="Log('Undo')">
            <TextBlock KeyboardAccelerator Text="⌃Z" Foreground="var(--AccentFillColorDefault)" />
          </MenuFlyoutItem>
          <MenuFlyoutItem Text="Colour" (Click)="Log('Colour')">
            <FontIcon Icon Glyph="&#xE91F;" Foreground="var(--SystemFillColorCaution)" />
          </MenuFlyoutItem>
        </MenuFlyout>
      </Button>
    </StackPanel>`
})
export class MenuFlyoutGallery {
  protected ShowGrid = true;
  protected ShowLabels = false;
  protected readonly Markings = ['Unclassified', 'Restricted', 'Confidential', 'Secret'];
  protected Marking = 'Restricted';
  protected Last = '—';

  protected Log(text: string) {
    this.Last = text;
  }
}
