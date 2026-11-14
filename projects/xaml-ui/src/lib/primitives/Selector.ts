import { Component, ContentChild, EventEmitter, HostBinding, Input, Output, TemplateRef } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { HorizontalAlignment, ToAlignment, ToJustification, VerticalAlignment } from "../Common";

export const SelectorItemTemplate =
  `<ng-container *ngIf="ItemTemplate">
    <ng-container [ngTemplateOutlet]="ItemTemplate" [ngTemplateOutletContext]="{ $implicit: item }" [ngTemplateOutletInjector]="container.Injector" />
    </ng-container>
  <ng-container *ngIf="!ItemTemplate">{{ DisplayMemberPath && item !== null ? item[DisplayMemberPath] : item }}</ng-container>`;

@Component({
  selector: 'Selector',
  template: '',
})
export abstract class SelectorComponent extends FrameworkElementComponent {
  
  @ContentChild(TemplateRef) 
  private _contentItemTemplate?: TemplateRef<any>;

  private _inputItemTemplate?: TemplateRef<any>;
  @Input() set ItemTemplate(value: TemplateRef<any> | undefined) {
    this._inputItemTemplate = value;
  }
  get ItemTemplate(): TemplateRef<any> | undefined {
    return this._inputItemTemplate ?? this._contentItemTemplate;
  }

  @Input() IsEnabled: boolean = true;
  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Left';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  protected get alignContent() {
    return ToAlignment(this.VerticalContentAlignment);
  }

  protected get justifyContent() {
    return ToJustification(this.HorizontalContentAlignment);
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  //ItemSource
  private _itemSource: any[] = [];
  get ItemSource() {
    return this._itemSource;
  }
  @Input() set ItemSource(value: any[]) {
    //A value asked for before its list arrived is chosen now; otherwise the choice is kept if the new list has it.
    //The list and the value often change in the same binding update, in either order, so the change is published once
    //the update is done: a choice the new list lacks is not cleared before the value meant for it arrives.
    let wantedValue = this._hasPendingValue ? this._pendingValue : this.SelectedValue;
    this.deferChanges();

    this._itemSource = value;
    this._selectedIndex = value.findIndex(p => this.getValue(-1, p) == wantedValue);
    if (this._selectedIndex !== -1) this.clearPendingValue();
  }

  //Selected index
  private _selectedIndex = -1;
  get SelectedIndex() {
    return this._selectedIndex;
  }
  @Input() set SelectedIndex(value: number) {
    if (this.ItemSource === undefined) return;
    this.clearPendingValue();
    if (value < 0 && this.ItemSource.length > 0) value = -1;
    if (value >= this.ItemSource.length) value = this.ItemSource.length - 1;

    //Within a binding update that changed the list, the change is published at its end
    if (this._published) {
      this._selectedIndex = value;
      return;
    }

    let oldIndex = this._selectedIndex;
    let oldValue = this.SelectedValue;
    let oldItem = this.SelectedItem;
    this._selectedIndex = value;
    this.raiseChanges(oldIndex, oldValue, oldItem);
  }
  @Output() SelectedIndexChange = new EventEmitter<number>();

  //Selected value
  get SelectedValue() {
    if (this.SelectedIndex < 0 || this.SelectedIndex >= this.ItemSource.length) return null;
    return this.getValue(-1, this.ItemSource[this.SelectedIndex]);
  }
  @Input() set SelectedValue(value: any) {
    if (this.ItemSource === undefined) return;

    //A value the list does not have (yet) waits: its list may be on its way in the same binding update. If it is not
    //there once the update is done, the selection is cleared.
    let index = this.ItemSource.findIndex(p => this.getValue(-1, p) == value);
    if (index === -1 && value !== null && value !== undefined) {
      this.deferChanges();
      this._pendingValue = value;
      this._hasPendingValue = true;
      return;
    }

    this.SelectedIndex = index;
  }
  @Output() SelectedValueChange = new EventEmitter<any>();

  //Selected item
  get SelectedItem() {
    if (this.SelectedIndex < 0 || this.SelectedIndex >= this.ItemSource.length) return null;
    return this.ItemSource[this.SelectedIndex];
  }
  @Input() set SelectedItem(value: any) {
    if (this.ItemSource === undefined) return;
    this.SelectedIndex = this.ItemSource.indexOf(value);
  }
  @Output() SelectedItemChange = new EventEmitter<any>();

  private _pendingValue: any;
  private _hasPendingValue = false;

  private clearPendingValue() {
    this._pendingValue = undefined;
    this._hasPendingValue = false;
  }

  //The selection as last published, while a change waits for the end of the binding update
  private _published?: { Index: number, Value: any, Item: any };

  //Published right after the binding update (a microtask): outside change detection, so the owner may take the new
  //value into the very bindings that set the list
  private deferChanges() {
    if (this._published) return;

    this._published = { Index: this.SelectedIndex, Value: this.SelectedValue, Item: this.SelectedItem };
    queueMicrotask(() => this.publishChanges());
  }

  //The binding update is done: a value still not in the list clears the selection, and what changed is raised
  private publishChanges() {
    let published = this._published;
    if (!published) return;

    this._published = undefined;
    if (this._hasPendingValue) {
      this.clearPendingValue();
      this._selectedIndex = -1;
    }
    this.raiseChanges(published.Index, published.Value, published.Item);
  }

  private raiseChanges(oldIndex: number, oldValue: any, oldItem: any) {
    if (oldIndex !== this.SelectedIndex) this.SelectedIndexChange.emit(this.SelectedIndex);
    if (oldValue !== this.SelectedValue) this.SelectedValueChange.emit(this.SelectedValue);
    if (oldItem !== this.SelectedItem) this.SelectedItemChange.emit(this.SelectedItem);
  }

  //Member paths
  @Input() DisplayMemberPath?: string;
  @Input() SelectedValuePath?: string;

  protected getValue: (index: number, item: any) => any;

  @Output() ItemClick = new EventEmitter<number>();

  protected onItemClick(event: Event, index: number, item: any) {
    if (!this.IsEnabled) return;

    if (this.SelectedIndex !== index) {
      this.SelectedIndex = index;
      event.stopPropagation();
    }

    this.ItemClick.emit(index);
  }

  //Keyboard: the list is one tab stop, on the focused row (else the selected one, else the first); the arrow keys,
  //Home and End move the focus and the selection with it, as in WinUI's ListView; Enter and Space click the row
  private _focusIndex = -1;

  protected getItemTabIndex(index: number) {
    if (!this.IsEnabled) return null;

    let focusIndex = this._focusIndex >= 0 && this._focusIndex < this.ItemSource.length ? this._focusIndex : Math.max(this.SelectedIndex, 0);
    return index === focusIndex ? 0 : -1;
  }

  protected onItemFocus(index: number) {
    this._focusIndex = index;
  }

  protected onItemKeyDown(event: KeyboardEvent, index: number, item: any) {
    if (!this.IsEnabled || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;

    let next: number;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = Math.min(index + 1, this.ItemSource.length - 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = this.ItemSource.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!event.repeat) this.onItemClick(event, index, item);
        return;
      default:
        return;
    }

    event.preventDefault();
    if (next === index) return;

    this.SelectedIndex = next;
    this.FocusItem(next);
  }

  /** Moves the keyboard focus to a row and scrolls it into view. */
  FocusItem(index: number) {
    this._focusIndex = index;
    let element = this.GetElement(index);
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ block: 'nearest' });
  }

  GetElement(index: number) {
    return document.querySelector(`#xaml-selector-${this._id}-item-${index}`) as HTMLElement | null;
  }

  constructor() {
    super();

    //This is required otherwise the SelectedValuePath cannot be read
    this.getValue = (index: number, item: any) => {
      return this.SelectedValuePath !== undefined ? item[this.SelectedValuePath] : item;
    };
  }
}