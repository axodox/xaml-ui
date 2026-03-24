import { Component, ViewContainerRef } from '@angular/core';
import {
  XamlRootComponent, GridModule, StackPanelComponent,
  TextBlockComponent, TextBoxComponent, ButtonComponent,
  FontIconComponent, ContentDialog, ContentDialogButton, Dialog
} from 'xaml-ui';

@Component({
  selector: 'app-root',
  imports: [
    XamlRootComponent, GridModule, StackPanelComponent,
    TextBlockComponent, TextBoxComponent, ButtonComponent, FontIconComponent
  ],
  template: `
    <XamlRoot>
      <StackPanel Spacing="12px" Padding="24px" HorizontalAlignment="Center" VerticalAlignment="Center">
        <TextBlock Text="Welcome" FontSize="24pt" FontWeight="Bold" HorizontalAlignment="Center" />
        <Grid ColumnDefinitions="auto 1fr" ColumnSpacing="6px" RowSpacing="6px">
          <TextBlock VerticalAlignment="Center">Name</TextBlock>
          <TextBox [(Text)]="name" PlaceholderText="Enter your name" Width="250px" />
        </Grid>
        <Button Class="AccentButtonStyle" (Click)="OnGreet()" HorizontalAlignment="Center">
          <FontIcon Glyph="&#xE76E;" /> Greet
        </Button>
      </StackPanel>
    </XamlRoot>`,
  styles: `:host { display: grid; height: 100vh; }`
})
export class AppComponent {
  protected name = '';

  constructor(private _viewContainerRef: ViewContainerRef) { }

  protected async OnGreet() {
    let dialog = Dialog.Create(ContentDialog, this._viewContainerRef);
    dialog.Title = 'Hello!';
    dialog.Content = `Welcome, ${this.name || 'World'}!`;
    dialog.CloseButtonText = 'OK';
    dialog.DefaultButton = ContentDialogButton.Close;
    await dialog.ShowAsync();
  }
}
