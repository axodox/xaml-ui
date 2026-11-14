import { Component } from '@angular/core';
import {
  BorderComponent, ButtonComponent, GridModule, ProgressBarComponent, ProgressRingComponent, ScrollViewerComponent, ScrollViewerViewChangedEventArgs,
  SliderComponent, StackPanelComponent, TextBlockComponent
} from '../../../../xaml-ui/src/public-api';

/**
 * Progress controls with their track and ARIA values, and a ScrollViewer that reports its view changes and scrolls
 * smoothly to an item.
 */
@Component({
  selector: 'StatusGallery',
  imports: [
    BorderComponent, ButtonComponent, GridModule, ProgressBarComponent, ProgressRingComponent, ScrollViewerComponent, SliderComponent,
    StackPanelComponent, TextBlockComponent
  ],
  template: `
    <StackPanel Spacing="12px" Padding="12px">
      <TextBlock Text="ProgressBar and ProgressRing" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Determinate controls draw their track; each has the progressbar role with aria-valuemin, aria-valuemax and aria-valuenow (indeterminate: aria-busy)." />
      <Slider Width="300px" HorizontalAlignment="Left" [(Value)]="Progress" />
      <Grid ColumnDefinitions="300px auto" ColumnSpacing="24px" RowSpacing="12px" HorizontalAlignment="Left">
        <ProgressBar [Value]="Progress" VerticalAlignment="Center" />
        <TextBlock [Text]="'Value ' + Format(Progress)" />
        <ProgressBar [Value]="Progress" [ShowPaused]="true" VerticalAlignment="Center" />
        <TextBlock Text="ShowPaused" />
        <ProgressBar [Value]="Progress" [ShowError]="true" VerticalAlignment="Center" />
        <TextBlock Text="ShowError" />
        <ProgressBar [IsIndeterminate]="true" VerticalAlignment="Center" />
        <TextBlock Text="Indeterminate" />
      </Grid>
      <StackPanel Orientation="Horizontal" Spacing="24px">
        <ProgressRing [Value]="Progress" />
        <ProgressRing [Value]="Progress" Width="16px" Height="16px" VerticalAlignment="Center" />
        <ProgressRing [IsIndeterminate]="true" />
        <ProgressRing [Value]="Progress" Background="var(--AccentFillColorDisabled)" />
      </StackPanel>

      <TextBlock Text="ScrollViewer" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="ViewChanged reports the offsets while scrolling (intermediate) and once at rest. The buttons scroll smoothly to an item; the scroll is not stopped half-way." />
      <StackPanel Orientation="Horizontal" Spacing="8px">
        <Button (Click)="ScrollTo(viewer, 0)">Item 1</Button>
        <Button (Click)="ScrollTo(viewer, 20)">Item 21</Button>
        <Button (Click)="ScrollTo(viewer, 39)">Item 40</Button>
        <Button (Click)="viewer.ChangeView(null, 600)">ChangeView(null, 600)</Button>
      </StackPanel>
      <Border Width="320px" Height="200px" BorderThickness="1px" BorderBrush="var(--CardStrokeColorDefault)" CornerRadius="var(--ControlCornerRadius)" HorizontalAlignment="Left">
        <ScrollViewer #viewer VerticalScrollMode="Auto" HorizontalScrollMode="Disabled" (ViewChanged)="OnViewChanged($event)">
          <StackPanel Spacing="4px" Padding="8px">
            @for (item of Items; track item) {
              <Border class="scroll-item" Padding="8px" Background="var(--CardBackgroundFillColorDefault)" CornerRadius="var(--ControlCornerRadius)">
                <TextBlock [Text]="item" />
              </Border>
            }
          </StackPanel>
        </ScrollViewer>
      </Border>
      <TextBlock [Text]="ViewText" Foreground="var(--TextFillColorSecondary)" />
    </StackPanel>`
})
export class StatusGallery {
  protected Progress = 0.4;
  protected readonly Items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);
  protected ViewText = 'No view change yet';
  private _intermediate = 0;

  protected Format(value: number) {
    return value.toFixed(2);
  }

  protected ScrollTo(viewer: ScrollViewerComponent, index: number) {
    let element = document.querySelectorAll('.scroll-item')[index];
    if (element) viewer.ScrollToElement(element, { block: 'start', behavior: 'smooth' });
  }

  protected OnViewChanged(args: ScrollViewerViewChangedEventArgs) {
    if (args.IsIntermediate) this._intermediate++;
    this.ViewText = `VerticalOffset ${Math.round(args.VerticalOffset)}, ${args.IsIntermediate ? 'intermediate' : 'at rest'} (${this._intermediate} intermediate events)`;
  }
}
