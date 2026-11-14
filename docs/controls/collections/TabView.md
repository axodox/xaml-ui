# TabView

> Source: [TabView.ts](../../../projects/xaml-ui/src/lib/collections/TabView.ts)

A row of tabs over the content of the selected one, as WinUI 3's `TabView`. Extends [FrameworkElement](../FrameworkElement.md). Its tabs are `TabViewItem` children (also from `@for`); only the selected tab's content is shown, the others stay in the page, hidden, and keep their state (text typed, scroll position, component state).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `SelectedIndex` | `number` | `0` | Index of the selected tab (two-way); -1 for none |
| `TabWidthMode` | `'Equal' \| 'SizeToContent' \| 'Compact'` | `'Equal'` | `Equal`: tabs share the width, each between 100 and 240px. `SizeToContent`: each as wide as its header. `Compact`: unselected tabs with an `Icon` show only the icon (their header becomes a tooltip and stays their accessible name) |
| `IsAddTabButtonVisible` | `boolean` | `false` | Shows the add (+) button after the tabs |
| `IsEnabled` | `boolean` | `true` | Enables or disables the tabs and buttons |

| Output | Payload | Description |
|---|---|---|
| `SelectedIndexChange` | `number` | The selected tab changed (however it changed) |
| `AddTabButtonClick` | — | The add button was clicked; the owner adds a tab |
| `TabCloseRequested` | `TabViewTabCloseRequestedEventArgs` (`{ Tab, Index }`) | A closable tab's close button, Delete, Ctrl+F4 or a middle click; the owner removes the tab |

| Read-only | Type | Description |
|---|---|---|
| `Items` | `TabViewItemComponent[]` | The tabs, in order |
| `SelectedItem` | `TabViewItemComponent \| null` | The selected tab |

When tabs are removed so that `SelectedIndex` is past the end, the last tab is selected (and `SelectedIndexChange` raised).

## Slots

| Attribute | Where |
|---|---|
| `TabStripHeader` | Before the tabs (buttons, a title) |
| `TabStripFooter` | After the tabs and the add button, filling the rest of the strip (use `HorizontalAlignment="Right"` to push a button to the end) |

# TabViewItem

| Input | Type | Default | Description |
|---|---|---|---|
| `Header` | `string` | — | The tab's text |
| `Icon` | `string` | — | A Segoe Fluent Icons glyph before the header (WinUI's `IconSource`), 16px |
| `IsClosable` | `boolean` | `true` | Shows the close button; Delete / Ctrl+F4 / middle click close it |

| Output | Description |
|---|---|
| `CloseRequested` | This tab's close was asked for (also raised as `TabView.TabCloseRequested`) |

| Read-only | Description |
|---|---|
| `IsSelected` | Whether it is the selected tab |

Its content is the tab's panel. Two slots go into the tab instead:

| Attribute | Where |
|---|---|
| `TabViewItemHeader` | After the `Header` text, for a rich header |
| `TabViewItemIcon` | On the icon; an `InfoBadge` there sits on the icon's top right corner, other content overlays the glyph |

## Accessibility and keyboard

The strip is a `tablist`; each tab a `tab` with `aria-selected` and `aria-controls`; each panel a `tabpanel` labelled by its tab. The tabs are one tab stop (the selected tab); **←/→** move between tabs (wrapping) with the selection following the focus, **Home/End** go to the first and last tab, **Delete** or **Ctrl+F4** ask to close a closable tab. The close buttons are not tab stops (the keys replace them); the add button is.

## Look

As WinUI 3: the selected tab is on a raised surface (`--SolidBackgroundFillColorTertiary`, `--CardStrokeColorDefault` edge, rounded top corners) which runs on into the content area, unselected tabs are subtle with secondary text, a hover fill and separators between them. The content area has the selected tab's background; put padding in the content. The tab strip scrolls sideways when the tabs do not fit (without WinUI's scroll buttons).

## Examples

**Fixed tabs with a badge and a footer button:**

```html
<TabView Height="300px" [(SelectedIndex)]="tab">
  <TabViewItem Header="Units" Icon="&#xE716;" [IsClosable]="false">
    <UnitsView />
  </TabViewItem>
  <TabViewItem Header="Tasks" Icon="&#xE9D5;" [IsClosable]="false">
    <InfoBadge TabViewItemIcon Class="AttentionValueInfoBadgeStyle" [Value]="openTasks" />
    <TasksView />
  </TabViewItem>
  <Button TabStripFooter HorizontalAlignment="Right" (Click)="OnExport()">Export</Button>
</TabView>
```

**Documents the user opens and closes:**

```html
<TabView [IsAddTabButtonVisible]="true" [(SelectedIndex)]="index"
         (AddTabButtonClick)="OnAdd()" (TabCloseRequested)="OnClose($event.Index)">
  @for (doc of documents; track doc.Id) {
    <TabViewItem [Header]="doc.Title" Icon="&#xE8A5;">
      <DocumentView [Document]="doc" />
    </TabViewItem>
  }
</TabView>
```
