# Testing

How xaml-ui is tested: unit specs for behaviour, and the sandbox's galleries to see and try each control. Both run
headless or on a desktop of your own; nothing here needs a window on someone else's screen.

## 1. Build

```bash
npx ng build xaml-ui                                  # the library, into dist/xaml-ui
npx ng build xaml-sandbox --configuration development # the sandbox
```

Both must finish without errors or warnings.

## 2. Specs (Karma, headless Chrome)

```bash
npx ng test xaml-ui --watch=false --browsers=ChromeHeadless
npx ng test xaml-ui --watch=false --browsers=ChromeHeadless --include=projects/xaml-ui/src/lib/basic-input/ComboBox.spec.ts
```

The specs sit beside their controls (`*.spec.ts`), each with a small host component in `TestBed`. Required: every spec
passes. What they cover:

| Spec | What is tested |
|---|---|
| `basic-input/CheckBox.spec.ts` | The native input stays focusable and named by the content; the glyph is not in the text; a click toggles; three-state cycles unchecked → checked → indeterminate; an owner's `null` shows indeterminate and a click unchecks (WinUI); ToggleSwitch has the `switch` role |
| `basic-input/ComboBox.spec.ts` | A list and a value changing together keep the choice, also after a choice made in the list |
| `primitives/Selector.spec.ts` | The same in both input orders, a kept choice, a cleared choice, an unknown value; one tab stop; arrow keys move focus and selection |
| `text/NumberBox.spec.ts` | Text that is not a number puts the last value back; empty text is NaN; decimal comma; clamping and the shown value; the spin button role, name and values; `parse` |
| `menus-and-toolbars/MenuFlyout.spec.ts` | Menu and item roles, accelerator text and note; a click on a disabled item or a separator leaves the menu open; arrows skip disabled items and wrap; Enter chooses; radio items; Esc; one visible presenter when a flyout is reopened while it fades out; focus into a flyout and back; SplitButton's `DropDownClick` and named arrow; a self-closed `XamlButton` clicked with Enter |
| `status-and-info/ProgressAndToolTip.spec.ts` | ProgressBar and ProgressRing roles, values, busy state and tracks; live tooltip content; no tooltip on touch hover; ScrollViewer's `ViewChanged` (intermediate and at rest); the file picker's fallback `accept` |
| `collections/TabView.spec.ts`, `TreeView.spec.ts`, `DataGrid.spec.ts`, `status-and-info/InfoBadge.spec.ts` | Selection, keyboard, roles and ARIA of the new controls; the tree's three-state subtree selection; hidden tab panels keeping their state; the grid's columns, frozen column and wrapping; the badge's kinds and styles |

## 3. The sandbox's galleries

```bash
npx ng serve xaml-sandbox --port 4211
```

Open `http://localhost:4211/` (the list on the left) or one gallery directly: `http://localhost:4211/?gallery=<Name>`.
Check each in dark and light mode (the system's colour scheme). Required outcome per gallery:

| Gallery | Steps | Required |
|---|---|---|
| `Focus` | Tab through the page; Enter and Space on each button; ↓ ↑ Home End in the lists | Every button (Button, XamlButton, ToggleButton, HyperlinkButton, RepeatButton, DropDownButton, both parts of each SplitButton, AppBarButton, RadioToggleButton) is a tab stop with WinUI's focus ring for the keyboard only; Enter or Space clicks; a list is one tab stop and its arrows move focus and selection; *Last:* names what was clicked; the split button without a flyout reports its arrow |
| `Flyout` | Open each placement; Esc; open the nested flyout and press Esc twice; *Close and reopen at once*; the two edge buttons | Each placement opens where named; Esc closes the topmost flyout and gives the focus back to its button; one presenter is visible after reopening; at the window's edges a flyout opens on the other side or is moved in, never narrowed |
| `MenuFlyout` | Tab to *File*, Enter; ↓ ↑ Home End, Enter, Space, Esc; click the disabled item; *View* (toggle and radio items); *At the right edge*; *Custom* | The first item has the focus when opened from the keyboard; arrows skip the disabled item and wrap; Enter/Space choose and close; Esc closes with the focus back on the button; the disabled item leaves the menu open; accelerators and notes on the right, the destructive item in the critical colour; one radio item checked per group; the right-edge menu opens to the left, whole |
| `Input` | Tab and Space on the boxes; arrows in the radio group; type `abc`, `2,5`, `500` in the NumberBox and Enter; change the category (also after picking a rule); point at *Live tooltip* and wait; click it | Boxes are reachable and toggle with Space; three-state reaches indeterminate; the NumberBox puts 15 back for `abc`, reads 2.5, clamps to 120; the rule box always shows the rule the category picked; the tooltip counts up while it shows and does not show after a click; the file picker's fallback filter lists the extensions |
| `Status` | Move the slider; *Item 40*, *ChangeView* | Bars and rings follow the value over their tracks; the text reports intermediate view changes and one at rest; the smooth scroll reaches item 40 |
| `InfoBadge`, `TabView`, `TreeView`, `DataGrid` | As each gallery's headings say | As WinUI's controls of the same name (the gallery texts name what to try) |

A headless run of these steps (Playwright, 50 checks with screenshots) was used for the WEB-X01c work; it lives with
that task's files, not in this repository, because xaml-ui has no Playwright dependency.
