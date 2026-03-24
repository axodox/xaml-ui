# xaml-ui

An Angular component library that brings WinUI / XAML-style controls to the web. Implements Fluent Design with automatic light/dark theming, CSS Grid layout, and PascalCase naming conventions inspired by XAML/WinUI.

## Installation

```bash
npm install xaml-ui
```

Import global styles in your root `styles.scss`:

```scss
@use 'xaml-ui/styles/XamlGlobals.css';
```

## Quick Example

```typescript
import { Component, ViewContainerRef } from '@angular/core';
import { XamlRootComponent, GridModule, StackPanelComponent, TextBlockComponent,
         TextBoxComponent, ButtonComponent, FontIconComponent,
         ContentDialog, ContentDialogButton, Dialog } from 'xaml-ui';

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, GridModule, StackPanelComponent,
            TextBlockComponent, TextBoxComponent, ButtonComponent, FontIconComponent],
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
    </XamlRoot>`
})
export class AppComponent {
  protected name = '';

  constructor(private _viewContainerRef: ViewContainerRef) { }

  protected async OnGreet() {
    let dialog = Dialog.Create(ContentDialog, this._viewContainerRef);
    dialog.Title = 'Hello!';
    dialog.Content = `Welcome, ${this.name}!`;
    dialog.CloseButtonText = 'OK';
    dialog.DefaultButton = ContentDialogButton.Close;
    await dialog.ShowAsync();
  }
}
```

## Documentation

- [Getting Started](docs/getting-started.md) — setup, key concepts, component overview
- [Controls Reference](docs/controls/index.md) — index of all controls
- [Coding Conventions](docs/conventions.md) — naming, file structure, template and styling patterns
- [Theming](docs/theming.md) — CSS custom properties reference for dark/light modes

## Development

```bash
ng serve     # Development server at http://localhost:4200/
ng build     # Production build to dist/
ng test      # Unit tests with Karma
```
