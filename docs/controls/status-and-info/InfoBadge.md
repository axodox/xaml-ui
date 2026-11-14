# InfoBadge

> Source: [InfoBadge.ts](../../../projects/xaml-ui/src/lib/status-and-info/InfoBadge.ts)

A small badge for notifications and status, as WinUI's `InfoBadge`. Extends [FrameworkElement](../FrameworkElement.md).

It shows, in this order of preference:

- a **number**, when `Value` is 0 or more;
- a **glyph**, when there is an `Icon` (or the style class brings one);
- a **dot**, with neither.

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Value` | `number` | `-1` | The number shown; -1 shows none |
| `Icon` | `string` | — | A Segoe Fluent Icons glyph (WinUI's `IconSource`), hidden from assistive technology |
| `aria-label` | `string` | — | A name for assistive technology; with one, the badge has the `img` role. Without one it is read as its number, or not at all |

| Read-only | Type | Description |
|---|---|---|
| `Kind` | `'Value' \| 'Icon' \| 'Dot'` | What the badge shows |

`HorizontalAlignment` defaults to `Left` and `VerticalAlignment` to `Center`, so a badge keeps its own size in a grid.

## Sizes

As WinUI: a value or icon badge is 16px high and at least 16px wide, fully rounded, with 11px text (a wider number widens it); the icon is 8px. A dot is 6px (WinUI's minimum is 4px); `Width` and `Height` make it larger.

## Style classes

Set with `Class="…"`. Without a class the badge is filled with the accent colour (`--AccentFillColorDefault`); the text and glyph use `--TextOnAccentFillColorPrimary`.

| Class | Fill |
|---|---|
| `AttentionValueInfoBadgeStyle`, `AttentionIconInfoBadgeStyle`, `AttentionDotInfoBadgeStyle` | `--SystemFillColorAttention` |
| `InformationalValueInfoBadgeStyle`, `InformationalIconInfoBadgeStyle`, `InformationalDotInfoBadgeStyle` | `--SystemFillColorSolidNeutral` |
| `SuccessValueInfoBadgeStyle`, `SuccessIconInfoBadgeStyle`, `SuccessDotInfoBadgeStyle` | `--SystemFillColorSuccess` |
| `CautionValueInfoBadgeStyle`, `CautionIconInfoBadgeStyle`, `CautionDotInfoBadgeStyle` | `--SystemFillColorCaution` |
| `CriticalValueInfoBadgeStyle`, `CriticalIconInfoBadgeStyle`, `CriticalDotInfoBadgeStyle` | `--SystemFillColorCritical` |

The `…IconInfoBadgeStyle` classes bring WinUI's glyph when the badge has no `Icon`: Attention `\uEA38`, Informational `\uF13F`, Success `\uE8FB` (Accept), Caution `\uE8C9` (Important), Critical `\uE711` (Cancel). The class only colours the badge; what it shows still follows `Value` and `Icon`, so a `…ValueInfoBadgeStyle` badge without a value is a dot. The icon of a style class is read when the badge is checked, so set the class statically (`Class="…"`).

## Examples

**A count, a status icon and a dot:**

```html
<InfoBadge [Value]="unread" />
<InfoBadge Class="CriticalIconInfoBadgeStyle" />
<InfoBadge Class="SuccessDotInfoBadgeStyle" />
```

**On an icon, named for screen readers:**

```html
<Border>
  <FontIcon Glyph="&#xE7E7;" FontSize="20px" HorizontalAlignment="Left" Margin="0 4px 8px 0" />
  <InfoBadge Class="CriticalValueInfoBadgeStyle" HorizontalAlignment="Right" VerticalAlignment="Top"
             [Value]="alerts" aria-label="{{alerts}} new alerts" />
</Border>
```

**On a tab's icon:** see [TabView](../collections/TabView.md) (`TabViewItemIcon` slot).
