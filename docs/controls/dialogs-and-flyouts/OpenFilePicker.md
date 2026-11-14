# OpenFilePicker

> Source: [OpenFilePicker.ts](../../../projects/xaml-ui/src/lib/dialogs-and-flyouts/OpenFilePicker.ts)

Utility class (not a component) for picking files. Uses the File System Access API if available, falls back to a hidden `<input type="file">`.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `FileTypeFilter` | `FilePickerAcceptType[]` | — | Allowed file types (the fallback input accepts `*/*` without it) |
| `SettingsIdentifier` | `string` | — | Identifier for remembering last directory |
| `AllowMultiple` | `boolean` | — | Allow multi-file selection (also in the fallback input) |
| `SuggestedStartLocation` | `WellKnownDirectory` | — | Start directory hint |

## Methods

| Method | Return | Description |
|---|---|---|
| `ShowAsync()` | `Promise<File[] \| null>` | Shows picker, returns selected files or null |

## Static Members

| Member | Type | Description |
|---|---|---|
| `SupportsFileSystemAccessApi` | `boolean` | Whether the browser supports the modern File System Access API |
| `ToAcceptAttribute(fileTypes)` | `string` | The `accept` attribute for these file types: each MIME type followed by its extensions, without duplicates |

## Fallback Input

Without the File System Access API, `ShowAsync()` clicks a hidden `<input type="file">` whose `accept` is `ToAcceptAttribute(FileTypeFilter)`. It lists the extensions as well as the MIME types, so a file whose type the browser does not know (a `.geojson`, a `.kml`) is still offered by its extension:

```typescript
OpenFilePicker.ToAcceptAttribute([{ description: 'GeoJSON', accept: { 'application/geo+json': ['.geojson', '.json'] } }]);
// 'application/geo+json,.geojson,.json'
```

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
