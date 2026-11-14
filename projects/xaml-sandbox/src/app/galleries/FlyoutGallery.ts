import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ButtonComponent, FlyoutComponent, FlyoutPlacementMode, GridModule, StackPanelComponent, TextBlockComponent, TextBoxComponent
} from '../../../../xaml-ui/src/public-api';

/**
 * Flyouts: every `FlyoutPlacementMode`; **Esc** closes the topmost one and the focus goes back to its button; reopened
 * while it fades out it shows once; at the window's edges it opens on the other side or is moved in, never narrowed.
 */
@Component({
  selector: 'FlyoutGallery',
  imports: [ButtonComponent, FlyoutComponent, GridModule, StackPanelComponent, TextBlockComponent, TextBoxComponent],
  template: `
    <StackPanel Spacing="12px" Padding="12px">
      <TextBlock Text="Flyout" FontSize="16pt" FontWeight="SemiBold" />
      <TextBlock TextWrapping="Wrap" Text="Open a flyout, then press Esc: it closes and the focus is back on its button. A flyout opened from a flyout closes first." />

      <TextBlock Text="Placements" FontWeight="SemiBold" />
      <Grid ColumnDefinitions="repeat(5, auto)" ColumnSpacing="8px" RowSpacing="8px" HorizontalAlignment="Left" Margin="24px 120px">
        @for (placement of Placements; track placement) {
          <Button>{{ placement }}
            <Flyout [Placement]="placement">
              <StackPanel Spacing="6px">
                <TextBlock [Text]="'Placement: ' + placement" FontWeight="SemiBold" />
                <TextBox PlaceholderText="Tab moves in here" Width="180px" />
              </StackPanel>
            </Flyout>
          </Button>
        }
      </Grid>

      <TextBlock Text="Nested, Esc closes the topmost" FontWeight="SemiBold" />
      <Button HorizontalAlignment="Left">Outer flyout
        <Flyout Placement="Right">
          <StackPanel Spacing="6px">
            <TextBlock Text="Outer" />
            <Button>Inner flyout
              <Flyout Placement="Right"><TextBlock Text="Inner: Esc closes me first" /></Flyout>
            </Button>
          </StackPanel>
        </Flyout>
      </Button>

      <TextBlock Text="Reopened while it fades out" FontWeight="SemiBold" />
      <StackPanel Orientation="Horizontal" Spacing="8px">
        <Button #fadeTarget (Click)="Reopen()">Close and reopen at once</Button>
        <TextBlock VerticalAlignment="Center" [Text]="'Visible presenters after reopening: ' + VisiblePresenters" />
      </StackPanel>
      <Flyout #fade Placement="Bottom" [Target]="fadeTargetElement"><TextBlock Text="One presenter only" /></Flyout>

      <TextBlock Text="At the window's edges: wide content is not narrowed" FontWeight="SemiBold" />
      <Grid ColumnDefinitions="1fr auto">
        <Button HorizontalAlignment="Left">Bottom, at the left edge
          <Flyout Placement="Left">
            <TextBlock Text="Left did not fit: opened on the right instead, at full width." />
          </Flyout>
        </Button>
        <Button>Bottom-left aligned, at the right edge
          <Flyout Placement="BottomEdgeAlignedLeft">
            <TextBlock Text="A long line that would not fit to the right of the button's left edge, so the flyout opens right-aligned." />
          </Flyout>
        </Button>
      </Grid>
    </StackPanel>`
})
export class FlyoutGallery {
  protected readonly Placements: FlyoutPlacementMode[] = [
    'Top', 'TopEdgeAlignedLeft', 'TopEdgeAlignedRight', 'Bottom', 'BottomEdgeAlignedLeft',
    'BottomEdgeAlignedRight', 'Left', 'LeftEdgeAlignedTop', 'LeftEdgeAlignedBottom', 'Right',
    'RightEdgeAlignedTop', 'RightEdgeAlignedBottom', 'Cover'
  ];

  protected VisiblePresenters = 0;
  protected fadeTargetElement: HTMLElement | null = null;

  @ViewChild('fade') private _fade!: FlyoutComponent;
  @ViewChild('fadeTarget', { read: ElementRef }) private _fadeTarget!: ElementRef<HTMLElement>;

  protected async Reopen() {
    this.fadeTargetElement = this._fadeTarget.nativeElement;
    this._fade.Show();
    await new Promise(p => setTimeout(p, 400));
    this._fade.Hide();
    await new Promise(p => setTimeout(p, 50));
    this._fade.Show();
    await new Promise(p => setTimeout(p, 100));
    this.VisiblePresenters = document.querySelectorAll('FlyoutPresenter.visible').length;
  }
}
