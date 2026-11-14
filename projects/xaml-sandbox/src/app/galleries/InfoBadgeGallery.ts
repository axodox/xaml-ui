import { Component } from '@angular/core';
import { BorderComponent, ButtonComponent, FontIconComponent, GridModule, InfoBadgeComponent, StackPanelComponent, TextBlockComponent } from '../../../../xaml-ui/src/public-api';

@Component({
  selector: 'InfoBadgeGallery',
  imports: [BorderComponent, StackPanelComponent, TextBlockComponent, InfoBadgeComponent, ButtonComponent, FontIconComponent, GridModule],
  template: `<StackPanel Spacing="12px" Padding="12px">
    <TextBlock Text="InfoBadge" FontSize="20pt" FontWeight="SemiBold" />

    <TextBlock Text="Default (accent): value, icon, dot" FontWeight="SemiBold" />
    <StackPanel Orientation="Horizontal" Spacing="12px">
      <InfoBadge [Value]="1" />
      <InfoBadge [Value]="12" />
      <InfoBadge [Value]="150" />
      <InfoBadge Icon="&#xE7BA;" />
      <InfoBadge />
    </StackPanel>

    <TextBlock Text="Style classes (value, icon, dot)" FontWeight="SemiBold" />
    <Grid ColumnDefinitions="120px auto auto auto" RowDefinitions="auto auto auto auto auto" RowSpacing="8px" ColumnSpacing="16px" HorizontalAlignment="Left">
      <TextBlock Grid-Row="0" Grid-Column="0" Text="Attention" />
      <InfoBadge Grid-Row="0" Grid-Column="1" Class="AttentionValueInfoBadgeStyle" [Value]="Count" />
      <InfoBadge Grid-Row="0" Grid-Column="2" Class="AttentionIconInfoBadgeStyle" />
      <InfoBadge Grid-Row="0" Grid-Column="3" Class="AttentionDotInfoBadgeStyle" />
      <TextBlock Grid-Row="1" Grid-Column="0" Text="Informational" />
      <InfoBadge Grid-Row="1" Grid-Column="1" Class="InformationalValueInfoBadgeStyle" [Value]="Count" />
      <InfoBadge Grid-Row="1" Grid-Column="2" Class="InformationalIconInfoBadgeStyle" />
      <InfoBadge Grid-Row="1" Grid-Column="3" Class="InformationalDotInfoBadgeStyle" />
      <TextBlock Grid-Row="2" Grid-Column="0" Text="Success" />
      <InfoBadge Grid-Row="2" Grid-Column="1" Class="SuccessValueInfoBadgeStyle" [Value]="Count" />
      <InfoBadge Grid-Row="2" Grid-Column="2" Class="SuccessIconInfoBadgeStyle" />
      <InfoBadge Grid-Row="2" Grid-Column="3" Class="SuccessDotInfoBadgeStyle" />
      <TextBlock Grid-Row="3" Grid-Column="0" Text="Caution" />
      <InfoBadge Grid-Row="3" Grid-Column="1" Class="CautionValueInfoBadgeStyle" [Value]="Count" />
      <InfoBadge Grid-Row="3" Grid-Column="2" Class="CautionIconInfoBadgeStyle" />
      <InfoBadge Grid-Row="3" Grid-Column="3" Class="CautionDotInfoBadgeStyle" />
      <TextBlock Grid-Row="4" Grid-Column="0" Text="Critical" />
      <InfoBadge Grid-Row="4" Grid-Column="1" Class="CriticalValueInfoBadgeStyle" [Value]="Count" />
      <InfoBadge Grid-Row="4" Grid-Column="2" Class="CriticalIconInfoBadgeStyle" />
      <InfoBadge Grid-Row="4" Grid-Column="3" Class="CriticalDotInfoBadgeStyle" />
    </Grid>

    <TextBlock Text="Sized by Width / Height (a larger dot)" FontWeight="SemiBold" />
    <StackPanel Orientation="Horizontal" Spacing="12px">
      <InfoBadge Class="SuccessDotInfoBadgeStyle" Width="10px" Height="10px" />
      <InfoBadge Class="CriticalDotInfoBadgeStyle" Width="14px" Height="14px" />
    </StackPanel>

    <TextBlock Text="On a button, with an aria-label" FontWeight="SemiBold" />
    <StackPanel Orientation="Horizontal" Spacing="12px">
      <Button (Click)="Count = Count + 1">
        <Grid ColumnDefinitions="auto auto" ColumnSpacing="8px">
          <FontIcon Glyph="&#xE715;" />
          <TextBlock Text="One more" />
        </Grid>
      </Button>
      <Border>
        <FontIcon Glyph="&#xE7E7;" FontSize="20px" HorizontalAlignment="Left" Margin="0 4px 8px 0" />
        <InfoBadge Class="CriticalValueInfoBadgeStyle" HorizontalAlignment="Right" VerticalAlignment="Top" [Value]="Count" aria-label="{{Count}} new alerts" />
      </Border>
      <Button (Click)="Count = Count > 0 ? Count - 1 : 0">Fewer</Button>
      <Button (Click)="Count = -1">No value (dot)</Button>
    </StackPanel>
    <TextBlock [Text]="'Value: ' + Count" />
  </StackPanel>`
})
export class InfoBadgeGallery {
  protected Count = 5;
}
