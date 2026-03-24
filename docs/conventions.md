# Coding Conventions

This document describes the coding style and naming conventions recommended for projects using xaml-ui.

## Naming Conventions

### xaml-ui library (internal code)

The library itself uses a **mixed casing** approach:

- **Public APIs** (Inputs, Outputs, component class names, type aliases): **PascalCase** — `IsEnabled`, `ValueChange`, `ButtonComponent`, `HorizontalAlignment`
- **Private/protected internal members**: **camelCase** — `onChange()`, `onBlur()`, `onKeyDown()`, `gridAutoFlow`
- **Private fields**: underscore + camelCase — `_flyout`, `_input`, `_value`, `_blurTimeout`
- **Template event handlers** (internal to library components): camelCase — `(change)="onChange($event)"`, `(blur)="onBlur()"`

### Recommended application code style

Application code uses **PascalCase more broadly**:

- **Component classes**: PascalCase, no "Component" suffix for views — `MainView`, `UsersView`, `SettingsView`, `ProductsView`
- **Custom controls**: PascalCase with "Component" suffix — `ToolbarComponent`, `StatusBarComponent`
- **Dialog classes**: PascalCase — `UserEditDialog`, `ConfirmDeleteDialog`
- **Services**: PascalCase with "Service" suffix — `AuthService`, `ProductsService`, `NotificationService`
- **Pipes**: PascalCase with "Pipe" suffix — `DateFormatPipe`, `CurrencyPipe`
- **Protected/public properties**: **PascalCase** — `SelectedUser`, `NewItemName`, `IsLoading`
- **Protected methods**: **PascalCase** — `ToggleSelection()`, `OnKeyDown()`, `FormatPrice()`
- **Private fields**: underscore + camelCase — `_detailsFlyout`, `_viewContainerRef`, `_usersService`
- **Private methods**: **PascalCase** — `GenerateFileName()`, `RefreshData()`
- **Computed signals**: PascalCase — `IsLoading = computed(() => ...)`
- **Local variables** inside methods: camelCase — `let dialog`, `let result`, `let name`
- **Enum members**: PascalCase — `UserRole.Admin`, `ViewMode.Grid`

### Key difference summary

| Context | Library internal | App code |
|---|---|---|
| Template event handlers | `onChange()`, `onBlur()` | `OnKeyDown()`, `OnSaveClick()` |
| Protected methods | camelCase | PascalCase |
| Private methods | — | PascalCase |

Both use PascalCase for `@Input()` and `@Output()` names. Both use `_camelCase` for private fields.

## File Naming

All files use **PascalCase** — matching their primary export:

```
MainView.ts          MainView.html        MainView.scss
UsersView.ts         UsersView.html
UserEditDialog.ts    UserEditDialog.html
AuthService.ts
DateFormatPipe.ts
```

## Directory Structure

```
src/app/
  views/          # Feature view components (panels, pages)
  controls/       # Reusable custom controls
  dialogs/        # ContentDialog implementations
  services/       # Application services
  core/           # Utility functions and base services
  pipes/          # Angular pipes
  directives/     # Angular directives
  models/         # Data models and API types
```

## Component Patterns

### Component decorator

```typescript
@Component({
  selector: 'MyView',               // PascalCase selector
  templateUrl: 'MyView.html',       // External template for views
  imports: [GridModule, StackPanelComponent, TextBlockComponent, ...],
  // OR for small components:
  template: `<StackPanel>...</StackPanel>`,
  styles: `${FrameworkElementComponent.DefaultStyles}`,
  // OR:
  styleUrl: 'MyView.scss'
})
export class MyView extends FrameworkElementComponent {
```

- **Views** use external templates (`templateUrl`) when the template is non-trivial
- **Small controls** use inline `template` with backtick strings
- **Styles** are either inline `styles` or external `styleUrl`
- `FrameworkElementComponent.DefaultStyles` provides `:host { display: grid; position: relative; }`
- All components extend `FrameworkElementComponent` (or a subclass of it)

### Constructor injection

Services are injected in the constructor. Use `protected` for services accessed in templates, `private` for internal-only:

```typescript
constructor(
  protected _usersService: UsersService,
  protected _settingsService: SettingsService,
  private _viewContainerRef: ViewContainerRef) {
  super();
}
```

### Computed signals

Use Angular `computed()` for derived reactive state:

```typescript
protected IsLoading = computed(() => this._usersService.State().IsLoading);
protected HasSelection = computed(() => this._usersService.SelectedItem() != null);
```

### ViewChild references

Use `@ViewChild` with template reference variables to access child components:

```typescript
@ViewChild('DetailsFlyout')
private _detailsFlyout!: FlyoutComponent;

protected OnDetailsClick() {
  this._detailsFlyout.Show();
}
```

## Template Patterns

### HTML attribute ordering

Attributes on xaml-ui elements follow this general order:
1. Structural directives (`*ngIf`, `*ngFor`)
2. Grid placement (`Grid-Row`, `Grid-Column`, `Grid-RowSpan`, `Grid-ColumnSpan`)
3. Layout properties (`Orientation`, `Spacing`, `RowDefinitions`, `ColumnDefinitions`)
4. Sizing (`Width`, `Height`, `MinWidth`, `MaxWidth`, `MaxHeight`)
5. Alignment (`HorizontalAlignment`, `VerticalAlignment`)
6. Appearance (`Class`, `Background`, `Foreground`, `FontSize`, `FontStyle`)
7. Content properties (`Text`, `Glyph`, `Content`)
8. Data binding (`[ItemSource]`, `[(Value)]`, `[(Text)]`)
9. Behavior (`[IsEnabled]`, `ToolTipService-ToolTip`)
10. Events (`(Click)`, `(ValueChange)`)
11. Template references (`#MyRef`)

### Layout idioms

**Property grid (label + input form):**

```html
<Grid RowDefinitions="auto auto" ColumnDefinitions="auto 1fr" ColumnSpacing="6px" RowSpacing="6px">
  <TextBlock VerticalAlignment="Center">Label</TextBlock>
  <TextBox [(Text)]="value" />

  <TextBlock VerticalAlignment="Center">Another</TextBlock>
  <NumberBox [(Value)]="number" />
</Grid>
```

**Section with header, bordered list, and command bar:**

```html
<StackPanel Spacing="6px">
  <TextBlock Text="Section Title" Class="HeaderTextBlockStyle" />
  <Border Class="BorderedControlStyle">
    <ListView [ItemSource]="items()" [(SelectedValue)]="selected" SelectedValuePath="Id"
              HorizontalContentAlignment="Stretch" MaxHeight="300px">
      <ng-template let-item>
        <!-- item template -->
      </ng-template>
    </ListView>
    <TextBlock *ngIf="items().length === 0" Text="No items." HorizontalAlignment="Center" Margin="36px" />
  </Border>
  <CommandBar HorizontalAlignment="Center">
    <AppBarButton Text="Add" Icon="&#xE710;" (Click)="OnAdd()" />
    <AppBarButton Text="Remove" Icon="&#xE74D;" [IsEnabled]="selected !== null" (Click)="OnRemove()" />
  </CommandBar>
</StackPanel>
```

**Toolbar with flyout buttons:**

```html
<StackPanel VerticalAlignment="Center" Orientation="Vertical" Spacing="6px">
  <Button Class="InlineButtonStyle" ToolTipService-ToolTip="Search">
    <FontIcon Glyph="&#xE721;" />
    <Flyout Placement="Right">
      <SearchView />
    </Flyout>
  </Button>
</StackPanel>
```

**Context menu on list items:**

```html
<ng-template let-item>
  <TextBlock [Text]="item.Name" />
  <MenuFlyout ItemFlyout>
    <MenuFlyoutItem Text="Edit" Icon="&#xE70F;" (Click)="OnEdit(item)" />
    <MenuFlyoutItem Text="Delete" Icon="&#xE74D;" (Click)="OnDelete(item.Id)" />
  </MenuFlyout>
</ng-template>
```

**Horizontal separator:**

```html
<Border Background="#8a8c86" Height="2px" CornerRadius="1px" />
```

### List item templates

Inside `<ng-template let-item>`, use Grid for multi-column layouts:

```html
<ng-template let-item>
  <Grid RowDefinitions="auto auto" ColumnDefinitions="1fr auto" VerticalAlignment="Center" Margin="0 0 0 6px" Orientation="Vertical">
    <TextBlock [Text]="item.Name" TextWrapping="NoWrap" TextTrimming="CharacterEllipsis"
               [ToolTipService-ToolTip]="item.Name" />
    <TextBlock [Text]="item.Description" Class="DetailTextBlockStyle" FontStyle="Italic"
               TextWrapping="NoWrap" TextTrimming="CharacterEllipsis" />
    <FontIcon Grid-RowSpan="2" [Glyph]="IconForItem(item)" FontSize="15pt" VerticalAlignment="Center" />
  </Grid>
</ng-template>
```

## Styling Patterns

### Global CSS classes

Define reusable style classes in your app's `styles.scss`:

```scss
@use 'xaml-ui/styles/XamlGlobals.css';

.HeaderTextBlockStyle {
  color: var(--AccentFillColorDefault) !important;
  font-size: 16pt !important;
  font-weight: bold !important;
}

.DetailTextBlockStyle {
  color: var(--TextFillColorDisabled) !important;
}

.BorderedControlStyle {
  border-width: 2px;
  border-style: solid;
  border-color: var(--ControlStrongFillColorDefault) !important;
}
```

Apply with the `Class` attribute (capital C):

```html
<TextBlock Text="Title" Class="HeaderTextBlockStyle" />
<Border Class="BorderedControlStyle">...</Border>
```

### Component-level styles

Component SCSS files can target child xaml-ui elements by their selector name:

```scss
// MyView.scss
FontIcon {
  font-size: 20pt;
}

StackPanel {
  margin: 6px;
}

.FullScreenOverlay {
  pointer-events: none;

  > .interactive {
    pointer-events: auto;
  }
}
```

### Custom CSS variables

Define app-specific variables in `:root`:

```scss
:root {
  --FormLabelColumnWidth: 72px;
  --FormColumnSpacing: 6px;
  --FormRowSpacing: 6px;
  --AcrylicInAppFillColorDefault: #2C2C2C99;

  @media (prefers-color-scheme: light) {
    --AcrylicInAppFillColorDefault: #FCFCFC99;
  }
}
```

### Angular helper element workaround

Add this to prevent Angular's `<ng-component>` wrappers from breaking Grid/StackPanel layouts:

```scss
ng-component {
  display: contents;
}
```

## Dialog Conventions

### Dialog component structure

```typescript
@Component({
  templateUrl: 'MyDialog.html',
  styles: ``,
  imports: [CommonModule, ContentDialogPresenter, GridModule, ...],
  providers: [{ provide: ContentDialog, useExisting: MyDialog }]
})
export class MyDialog extends ContentDialog {
  Value: MyData = new MyData();

  constructor() {
    super();
    this.IsBackdropDismissEnabled = true;
    this.Title = 'Dialog Title';
    this.PrimaryButtonText = 'Cancel';
    this.SecondaryButtonText = 'Confirm';
    this.DefaultButton = ContentDialogButton.Secondary;
  }
}
```

### Dialog template structure

```html
<ng-template #template>
  <ContentDialogPresenter>
    <!-- dialog body content -->
  </ContentDialogPresenter>
</ng-template>
```

### Showing a dialog

```typescript
constructor(private _viewContainerRef: ViewContainerRef) { }

protected async ShowDialog() {
  let dialog = Dialog.Create(MyDialog, this._viewContainerRef);
  dialog.Value.SomeProperty = initialValue;

  let result = await dialog.ShowAsync();
  if (result !== ContentDialogResult.Secondary) return;

  this.ProcessResult(dialog.Value);
}
```

## TypeScript Style

- **Semicolons**: always
- **Quotes**: single quotes for imports and strings, double quotes in JSON-like objects
- **Indentation**: 2 spaces
- **Braces**: opening brace on same line; `else` on new line for multi-line blocks
- **Type annotations**: explicit when not obvious, omitted for trivially inferred types
- **Equality**: `===` / `!==` preferred, `==` / `!=` occasionally used
- **Null handling**: explicit null checks (`=== null`, `!== null`, `=== undefined`)
- **let vs const**: `let` is used for most local variables, including those that could be `const`

### Import organization

1. Angular core (`@angular/core`, `@angular/common`)
2. Third-party libraries
3. xaml-ui imports (single import line with all needed components)
4. Local components and controls
5. Services
6. Data models and types
7. Utility functions

```typescript
import { Component, ViewContainerRef } from '@angular/core';
import { FrameworkElementComponent, GridModule, StackPanelComponent, TextBlockComponent, ... } from 'xaml-ui';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/ProductsService';
import { Product } from '../models/Product';
import { formatCurrency } from '../core/Formatting';
```
