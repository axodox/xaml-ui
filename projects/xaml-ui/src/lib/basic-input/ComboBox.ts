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
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex" [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"
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

  //Make the ComboBox a keyboard tab-stop so it can receive the keydowns that
  //drive text search (disabled combos are skipped).
  @HostBinding('attr.tabindex')
  protected get tabIndex() {
    return this.IsEnabled ? '0' : null;
  }

  //Set while type-ahead moves the selection, so that change does not dismiss an open list.
  private _isTextSearching = false;
  private _searchText = '';
  private _lastSearchTime = 0;

  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent) {
    if (!this.IsEnabled) return;

    //Type-ahead has already applied its match to the selection, so both keys
    //just dismiss the open list.
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (this._popup?.IsOpen) {
        this._popup.IsOpen = false;
        event.preventDefault();
      }
      return;
    }

    if (!this.IsTextSearchEnabled) return;
    //Only printable single characters contribute; ignore arrows, shortcuts, etc.
    if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) return;

    //Append while typing is fast; a long-enough pause resets to a new search.
    let now = Date.now();
    if (now - this._lastSearchTime > TEXT_SEARCH_RESET_MS) this._searchText = '';
    this._lastSearchTime = now;
    this._searchText += event.key;

    let query = this._searchText.toLowerCase();
    let index = this.ItemSource.findIndex(item => this.getDisplayText(item).toLowerCase().includes(query));
    if (index >= 0) {
      //As in WinUI, the match moves the selection itself; an open list stays open
      //so further keystrokes can refine the match.
      this._isTextSearching = true;
      try {
        this.SelectedIndex = index;
      } finally {
        this._isTextSearching = false;
      }
      setTimeout(() => this._selector?.GetElement(index)?.scrollIntoView({ block: 'nearest' }));
      event.preventDefault();
    }
  }

  //The text shown for an item — the DisplayMemberPath property, or the item
  //itself (mirrors how the ComboBox renders each item).
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
    if (!value) return;

    let rect = this._host.nativeElement.getBoundingClientRect();
    let popupOffset = -(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0);
    this.target = { x: rect.left + 3, y: rect.top + popupOffset - 4, width: rect.width };
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  private onSelectionChanged() {
    //Picking an item dismisses the list; type-ahead selection leaves it open.
    if (this._popup && !this._isTextSearching) this._popup.IsOpen = false;
  }
}