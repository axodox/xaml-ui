> Source: [ContentDialog.ts](../../../projects/xaml-ui/src/lib/dialogs-and-flyouts/ContentDialog.ts)

# ContentDialog

Modal dialog with title, content area, and up to three buttons. Created programmatically. Extends Dialog → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Title` | `string` | — | Dialog title |
| `Content` | `any` | — | Text content (displayed in a wrapping TextBlock) |
| `PrimaryButtonText` | `string` | — | Primary button label (hidden if undefined) |
| `IsPrimaryButtonEnabled` | `boolean` | `true` | Primary button enabled state |
| `SecondaryButtonText` | `string` | — | Secondary button label (hidden if undefined) |
| `IsSecondaryButtonEnabled` | `boolean` | `true` | Secondary button enabled state |
| `CloseButtonText` | `string` | — | Close button label (hidden if undefined) |
| `DefaultButton` | `ContentDialogButton` | `None` | Which button gets AccentButtonStyle |
| `IsBackdropDismissEnabled` | `boolean` | `false` | Allow closing by clicking backdrop |

| Output | Type | Description |
|---|---|---|
| `PrimaryButtonClicked` | `EventEmitter` | Primary button clicked |
| `SecondaryButtonClicked` | `EventEmitter` | Secondary button clicked |
| `CloseButtonClicked` | `EventEmitter` | Close button clicked |
| `Closed` | `EventEmitter` | Dialog closed |

## Enums

```typescript
enum ContentDialogResult { None = 0, Primary = 1, Secondary = 2 }
enum ContentDialogButton { None, Primary, Secondary, Close }
```

## Methods

| Method | Return | Description |
|---|---|---|
| `ShowAsync()` | `Promise<ContentDialogResult>` | Shows dialog, resolves when closed |
| `Hide()` | — | Closes the dialog |

## Static Factory

```typescript
Dialog.Create<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef): T
```

## Creating a Custom Dialog

### 1. Define the dialog component

```typescript
@Component({
  templateUrl: 'MyDialog.html',
  styles: ``,
  imports: [CommonModule, ContentDialogPresenter, GridModule, TextBlockComponent, TextBoxComponent, ...],
  providers: [{ provide: ContentDialog, useExisting: MyDialog }]
})
export class MyDialog extends ContentDialog {
  Value: MyData = new MyData();

  constructor() {
    super();
    this.IsBackdropDismissEnabled = true;
    this.Title = 'My Dialog Title';
    this.PrimaryButtonText = 'Cancel';
    this.SecondaryButtonText = 'Confirm';
    this.DefaultButton = ContentDialogButton.Secondary;
    this.IsSecondaryButtonEnabled = false;  // enable conditionally
  }
}
```

### 2. Create the template

The template must follow this structure:

```html
<ng-template #template>
  <ContentDialogPresenter>
    <!-- Your dialog body content -->
    <Grid RowDefinitions="auto auto" ColumnDefinitions="auto 1fr" ColumnSpacing="6px" RowSpacing="6px">
      <TextBlock VerticalAlignment="Center">Name</TextBlock>
      <TextBox [(Text)]="Value.Name" HorizontalAlignment="Stretch" />

      <TextBlock VerticalAlignment="Center">Description</TextBlock>
      <TextBox [(Text)]="Value.Description" HorizontalAlignment="Stretch" />
    </Grid>
  </ContentDialogPresenter>
</ng-template>
```

Key points:
- Wrap in `<ng-template #template>`
- Use `<ContentDialogPresenter>` as the root inside the template
- The title, buttons, and footer are provided automatically by ContentDialogPresenter

### 3. Show the dialog

```typescript
constructor(private _viewContainerRef: ViewContainerRef) { }

protected async showMyDialog() {
  let dialog = Dialog.Create(MyDialog, this._viewContainerRef);
  dialog.Value.Name = 'initial value';

  let result = await dialog.ShowAsync();
  if (result !== ContentDialogResult.Secondary) return;

  // User confirmed
  this.processResult(dialog.Value);
}
```

## Quick Error/Info Dialog

For simple message dialogs, you can configure ContentDialog directly without subclassing:

```typescript
const dialog = new ContentDialog();
dialog.Title = "Error";
dialog.Content = "Something went wrong.";
dialog.PrimaryButtonText = "OK";
await dialog.ShowAsync();
```
