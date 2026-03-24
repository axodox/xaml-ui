# OpenFilePicker

> Source: [OpenFilePicker.ts](../../../projects/xaml-ui/src/lib/dialogs-and-flyouts/OpenFilePicker.ts)

Utility class (not a component) for picking files. Uses the File System Access API if available, falls back to a hidden `<input type="file">`.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `FileTypeFilter` | `FilePickerAcceptType[]` | — | Allowed file types |
| `SettingsIdentifier` | `string` | — | Identifier for remembering last directory |
| `AllowMultiple` | `boolean` | — | Allow multi-file selection |
| `SuggestedStartLocation` | `WellKnownDirectory` | — | Start directory hint |

## Methods

| Method | Return | Description |
|---|---|---|
| `ShowAsync()` | `Promise<File[] \| null>` | Shows picker, returns selected files or null |

## Static Properties

| Property | Type | Description |
|---|---|---|
| `SupportsFileSystemAccessApi` | `boolean` | Whether the browser supports the modern File System Access API |

## Example

```typescript
let picker = new OpenFilePicker();
picker.FileTypeFilter = [
  {
    description: "Image files",
    accept: {
      "image/png": ".png",
      "image/jpeg": [".jpg", ".jpeg"],
      "image/bmp": ".bmp"
    }
  }
];
picker.AllowMultiple = false;
picker.SuggestedStartLocation = "pictures";

let files = await picker.ShowAsync();
if (files && files.length > 0) {
  let file = files[0];
  // process file
}
```
