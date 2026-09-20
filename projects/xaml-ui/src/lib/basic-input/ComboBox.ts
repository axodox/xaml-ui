import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from "@angular/core";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";
import { DropDownButtonComponent } from "./DropDownButton";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { ItemContainerComponent } from "../primitives/ItemContainer";


@Component({
  selector: 'ComboBox',
  imports: [CommonModule, DropDownButtonComponent, FlyoutComponent, ListViewComponent, ItemContainerComponent],
  template: `<DropDownButton [Height]="Height" [Width]="Width" [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment" [IsEnabled]="IsEnabled">
    <ItemContainer #container>${SelectorItemTemplate}</ItemContainer>
    <Flyout Placement="Cover" Padding="0" [Target]="target" (IsOpenChange)="onIsOpenChanged($event)">
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex" [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"
                [ItemTemplate]="ItemTemplate" [DisplayMemberPath]="DisplayMemberPath" [SelectedValuePath]="SelectedValuePath" (ItemClick)="onItemClicked()"/>
    </Flyout>
  </DropDownButton>`,
  styleUrl: 'ComboBox.scss'
})
export class ComboBoxComponent extends SelectorComponent implements AfterViewInit {

  @Input() IsTextSearchEnabled: boolean = true;

  @HostBinding('attr.tabindex')
  protected get tabIndex() {
    return this.IsEnabled ? '0' : null;
  }

  private readonly _textSearchTimeout = 1000;

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
    if (now - this._lastSearchTime > this._textSearchTimeout) this._searchText = '';
    this._lastSearchTime = now;
    this._searchText += event.key;

    let query = this._searchText.toLowerCase();
    let index = this.ItemSource.findIndex(item => this.getDisplayText(item).toLowerCase().includes(query));
    if (index >= 0) {
      this.SelectedIndex = index;
      setTimeout(() => this._selector?.GetElement(index)?.scrollIntoView({ block: 'nearest' }));
      event.preventDefault();
    }
  }

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

  protected onItemClicked() {
    if (this._popup) this._popup.IsOpen = false;
  }
}