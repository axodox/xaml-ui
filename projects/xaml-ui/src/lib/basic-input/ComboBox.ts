import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from "@angular/core";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";
import { DropDownButtonComponent } from "./DropDownButton";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { ItemContainerComponent } from "../primitives/ItemContainer";

/** Idle gap after which type-ahead search starts a fresh query instead of appending. */
const TEXT_SEARCH_RESET_MS = 1000;

@Component({
  selector: 'ComboBox',
  imports: [CommonModule, DropDownButtonComponent, FlyoutComponent, ListViewComponent, ItemContainerComponent],
  template: `<DropDownButton [Height]="Height" [Width]="Width" [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment" [IsEnabled]="IsEnabled">
    <ItemContainer #container>${SelectorItemTemplate}</ItemContainer>
    <Flyout Placement="Cover" Padding="0" [Target]="target" (IsOpenChange)="onIsOpenChanged($event)">
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex" [HighlightedIndex]="_highlightedIndex" [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"
                [ItemTemplate]="ItemTemplate" [DisplayMemberPath]="DisplayMemberPath" [SelectedValuePath]="SelectedValuePath"/>
    </Flyout>
  </DropDownButton>`,
  styleUrl: 'ComboBox.scss'
})
export class ComboBoxComponent extends SelectorComponent implements AfterViewInit {
  /**
   * When enabled (the default, matching WinUI), typing while the ComboBox is
   * focused jumps the selection to the first item whose text matches. Characters
   * typed in quick succession accumulate into one query; pausing longer than
   * {@link TEXT_SEARCH_RESET_MS} starts a fresh query.
   */
  @Input() IsTextSearchEnabled: boolean = true;

  // Make the ComboBox a keyboard tab-stop so it can receive the keydowns that
  // drive text search (disabled combos are skipped).
  @HostBinding('attr.tabindex')
  protected get tabIndex() {
    return this.IsEnabled ? '0' : null;
  }

  // Index highlighted (hover-like) by type-ahead but not yet committed; -1 = none.
  protected _highlightedIndex = -1;
  private _searchText = '';
  private _lastSearchTime = 0;

  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent) {
    if (!this.IsEnabled) return;

    // Enter commits the highlighted match; Escape dismisses the open list.
    if (event.key === 'Enter') {
      if (this._popup?.IsOpen && this._highlightedIndex >= 0) {
        this.SelectedIndex = this._highlightedIndex;
        this._popup.IsOpen = false;
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'Escape') {
      if (this._popup?.IsOpen) {
        this._popup.IsOpen = false;
        event.preventDefault();
      }
      return;
    }

    if (!this.IsTextSearchEnabled) return;
    // Only printable single characters contribute; ignore arrows, shortcuts, etc.
    if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) return;

    // Append while typing is fast; a long-enough pause resets to a new search.
    let now = Date.now();
    if (now - this._lastSearchTime > TEXT_SEARCH_RESET_MS) this._searchText = '';
    this._lastSearchTime = now;
    this._searchText += event.key;

    let query = this._searchText.toLowerCase();
    let index = this.ItemSource.findIndex(item => this.getDisplayText(item).toLowerCase().includes(query));
    if (index >= 0) {
      // Preview the match with a hover-like highlight instead of selecting it; the
      // user commits with Enter or a click. Open the list so the highlight shows.
      this._highlightedIndex = index;
      if (this._popup && !this._popup.IsOpen) this._popup.IsOpen = true;
      setTimeout(() => this._selector?.GetElement(index)?.scrollIntoView({ block: 'nearest' }));
      event.preventDefault();
    }
  }

  // The text shown for an item — the DisplayMemberPath property, or the item
  // itself (mirrors how the ComboBox renders each item).
  private getDisplayText(item: any): string {
    if (item == null) return '';
    let value = this.DisplayMemberPath ? item[this.DisplayMemberPath] : item;
    return value == null ? '' : String(value);
  }

  get item() {
    return this.SelectedItem;
  }

  get index() {
    return this.SelectedIndex;
  }

  @ViewChild(ListViewComponent)
  private _selector?: SelectorComponent;

  @ViewChild('xaml-flyout')
  private _popup?: FlyoutBaseComponent;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _host: ElementRef<HTMLElement>) {
    super();
    this.SelectedIndexChange.subscribe(() => this.onSelectionChanged());
  }

  protected target: FlexibleConnectedPositionStrategyOrigin | null = null;

  protected onIsOpenChanged(value: boolean) {
    if (!value) {
      // Drop the type-ahead highlight when the list closes.
      this._highlightedIndex = -1;
      return;
    }
    let rect = this._host.nativeElement.getBoundingClientRect();
    let popupOffset = -(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0);
    this.target = { x: rect.left + 3, y: rect.top + popupOffset - 4, width: rect.width };
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  private onSelectionChanged() {
    if (this._popup) this._popup.IsOpen = false;
  }
}