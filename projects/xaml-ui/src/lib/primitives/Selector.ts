import { Component, ContentChild, EventEmitter, HostBinding, Input, Output, TemplateRef } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { HorizontalAlignment, toAlignment, toJustification, VerticalAlignment } from "../Common";

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
  @ContentChild(TemplateRef) ItemTemplate!: TemplateRef<any>;

  @Input() IsEnabled: boolean = true;
  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Left';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  protected get alignContent() {
    return toAlignment(this.VerticalContentAlignment);
  }

  protected get justifyContent() {
    return toJustification(this.HorizontalContentAlignment);
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
    let oldIndex = this.SelectedIndex;
    let oldValue = this.SelectedValue;
    let oldItem = this.SelectedItem;
    let newIndex = value.findIndex(p => this.getValue(-1, p) == oldValue);
    let newValue = newIndex !== -1 ? oldValue : null;
    let newItem = newIndex !== -1 ? value[newIndex] : null;

    this._itemSource = value;
    this._selectedIndex = newIndex;

    if (oldIndex !== newIndex) this.SelectedIndexChange.emit(this.SelectedIndex);
    if (oldValue !== newValue) this.SelectedValueChange.emit(this.SelectedValue);
    if (oldItem !== newItem) this.SelectedItemChange.emit(this.SelectedItem);
  }

  //Selected index
  private _selectedIndex = -1;
  get SelectedIndex() {
    return this._selectedIndex;
  }
  @Input() set SelectedIndex(value: number) {
    if (this.ItemSource === undefined) return;
    if (value < 0 && this.ItemSource.length > 0) value = -1;
    if (value >= this.ItemSource.length) value = this.ItemSource.length - 1;

    let oldIndex = this._selectedIndex;
    let oldValue = this.SelectedValue;
    let oldItem = this.SelectedItem;
    this._selectedIndex = value;
    let newIndex = this._selectedIndex;
    let newValue = this.SelectedValue;
    let newItem = this.SelectedItem;

    if (oldIndex !== newIndex) this.SelectedIndexChange.emit(this.SelectedIndex);
    if (oldValue !== newValue) this.SelectedValueChange.emit(this.SelectedValue);
    if (oldItem !== newItem) this.SelectedItemChange.emit(this.SelectedItem);
  }
  @Output() SelectedIndexChange = new EventEmitter<number>();

  //Selected value
  get SelectedValue() {
    if (this.SelectedIndex < 0 || this.SelectedIndex >= this.ItemSource.length) return null;
    return this.getValue(-1, this.ItemSource[this.SelectedIndex]);
  }
  @Input() set SelectedValue(value: any) {
    if (this.ItemSource === undefined) return;
    this.SelectedIndex = this.ItemSource.findIndex(p => this.getValue(-1, p) == value);
  }
  @Output() SelectedValueChange = new EventEmitter<any>();

  //Selected item
  get SelectedItem() {
    if (this.SelectedIndex < 0 || this.SelectedIndex >= this.ItemSource.length) return null;
    return this.ItemSource[this.SelectedIndex];
  }
  @Input() set SelectedItem(value: any) {
    if (this.ItemSource === undefined) return;
    this.SelectedIndex = this.ItemSource.findIndex(value);
  }
  @Output() SelectedItemChange = new EventEmitter<any>();

  //Member paths
  @Input() DisplayMemberPath?: string;
  @Input() SelectedValuePath?: string;

  protected getValue: (index: number, item: any) => any;

  protected onItemClick(event: Event, index: number, item: any) {
    if (this.SelectedIndex === index || !this.IsEnabled) return;

    this.SelectedIndex = index;
    event.stopPropagation();
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