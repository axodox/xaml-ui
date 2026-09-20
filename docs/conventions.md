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

## Control Properties

Controls expose state as PascalCase property pairs — a getter, an `@Input()` setter, and
a matching `NameChange` `@Output()`. The rules below keep those properties honest as a
control grows. They are worth following even where they cost a little efficiency: the
failures they prevent are the kind that appear months later, in one edge case, in code
that looked obviously correct.

### Store one format, compute the rest

A control should keep its state in exactly one representation. Anything else a caller can
read is derived from it on demand. Two stored copies of the same thing will eventually
disagree — usually in the one code path that forgot to update the second one.

```typescript
//One stored form, in the representation the control actually works in.
private _color = new ColorHsva(0, 0, 1, 1);

get Color(): Color { return this._color.ToRgba().ToNumber(); }
get Brightness() { return this._color.V; }
get Alpha() { return this._color.A; }
```

Choose the stored format for what it preserves, not for what is most convenient to return.
`ColorSpectrum` stores HSVA in floating point rather than the packed `Color` it publishes,
because an 8-bit colour at low brightness has almost no hue left in it — turn the
brightness down and back up through the packed form and you come back a different hue.
A control that re-reads its own published output loses whatever that output cannot carry.

### The setter is the only writer

If a value has a setter, nothing else assigns its backing field. A reader who sees a
setter will reasonably assume it always runs, and will put a guard or a side effect in it
expecting that. Internal code that writes the field directly quietly breaks that promise.

In practice this means the whole control has exactly one assignment to each backing field.
If a second one appears, it belongs behind the setter.

### The setter does the whole job

Calling the setter must be enough. Everything needed to bring the control in line with the
new value happens inside it — repositioning, redrawing, raising the change event — so no
caller has to remember a follow-up call.

```typescript
set HsvColor(value: ColorHsva) {
  if (ColorHsva.AreNearEqual(value, this._color)) return;

  this._color = value.Clone();
  this.updateSelectorPosition();     //the visual that depends on it
  this.HsvColorChange.emit(this.HsvColor);
}
```

Work driven by a template binding is already covered — change detection re-reads the
getter — so only imperative side effects need to be listed here.

### Raise the change event in the setter

Put the `NameChange` emit in the setter and nowhere else. Then it fires however the value
moved — a binding, a gesture, another property, internal code — and no future code path
can change the value silently. A control whose event fires from its gesture handler
instead will go quiet the first time someone sets the property another way.

### Guard against no-op sets

Compare and return early. This is not only an optimization:

- **It terminates two-way bindings.** `[(Value)]` feeds the control's own output back into
  its setter. The guard is what stops that echo.
- **It keeps events meaningful.** Subscribers should not be woken for a value that did
  not change.
- **It protects precision.** In `ColorSpectrum`, the echo arrives as a packed `Color`;
  re-decomposing it would round hue and saturation away. The guard has to stop it before
  the conversion, not after.

Guard on the value the property publishes. Where a change too small to matter is possible
— a slider is finer grained than the 8 bits it ends up in — compare with a tolerance.

### Funnel several ways in to one writer

When a control has more than one way to change the same state, give them one shared
writer and let each entry point defer to it. Every path then gets the guard, the side
effects and the event without repeating them, and there is one place to read to know what
happens on a change.

`ColorSpectrum` has four ways in — `Color`, `Brightness`, `Alpha` and the pointer — and
all four end up in `set HsvColor`:

```typescript
@Input() set Color(value: Color) {
  if (value === this.Color) return;
  this.HsvColor = ColorRgba.FromNumber(value).ToHsva();
}

@Input() set Brightness(value: number) {
  let color = this.HsvColor;
  color.V = value;
  this.HsvColor = color;
}
```

Pick the funnel's type for what it preserves. `HsvColor` takes HSVA rather than `Color`
precisely so the channel setters do not round-trip hue through 8 bits on every step.

Where two published properties do not move together, they get one guard each rather than
one shared one. `Color` and `HsvColor` are both raised from the same writer, but many HSVA
states share one `Color` — at zero brightness every hue is black — so `HsvColor` changing
does not imply `Color` did.

### Class-typed values need value comparison

`===` on a class instance compares references, not contents, so it is false for two
separate instances however equal they are. A property of class type needs an explicit
comparison — the colour classes provide `AreNearEqual`:

```typescript
if (ColorHsva.AreNearEqual(value, this._color)) return;   //not value === this._color
```

Primitive-typed properties (`Color` is a `number`) are the easy case, and are worth
preferring for anything that has to be bindable — see below.

### Getters that are bound must return a primitive or a stable reference

Change detection compares bound values with `Object.is`. A getter that builds a new object
each call hands it a new reference every check, so it looks changed every time. As an
`@Input()` that is worse than wasteful: a `[(TwoWay)]` binding assigns a fresh reference
back during change detection and trips `ExpressionChangedAfterItHasBeenChecked`.

So a getter that clones — as `HsvColor` does, to stop callers mutating stored state — can
be a plain property and an `@Output()`, but not an `@Input()`. Expose the bindable form as
a primitive alongside it: `Color` is a `number`, and `Brightness` and `Alpha` are numbers,
which is why those are the inputs and `HsvColor` is not.

Cheap getters over fields (`get Brightness() { return this._color.V; }`) are fine to bind
and fine to read from a template; they also avoid the allocation that reading through the
cloning getter would cost on every check.

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

Define reusable style classes in your app's `styles.scss`. xaml-ui's tokens become available wherever `<XamlRoot>` is mounted — no import needed — so reference them by their short names directly:

```scss
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

Define app-specific variables in `:root`. To customise xaml-ui tokens, use the `--XamlUiOverride*` slots (see [theming.md](theming.md)):

```scss
:root {
  --FormLabelColumnWidth: 72px;
  --FormColumnSpacing: 6px;
  --FormRowSpacing: 6px;
  --XamlUiOverrideAcrylicInAppFillColorDefault: #2C2C2C99;

  @media (prefers-color-scheme: light) {
    --XamlUiOverrideAcrylicInAppFillColorDefault: #FCFCFC99;
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
