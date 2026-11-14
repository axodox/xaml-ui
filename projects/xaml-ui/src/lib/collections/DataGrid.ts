import { ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Input, Output, QueryList, TemplateRef, forwardRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { ScrollViewerComponent } from "../scrolling/ScrollViewer";
import { TextWrapping } from "../Common";

/** Which headers a DataGrid shows, as the Toolkit's `DataGridHeadersVisibility` (there are no row headers). */
export type DataGridHeadersVisibility = 'Column' | 'None';

/** Which grid lines a DataGrid draws between its cells, as the Toolkit's `DataGridGridLinesVisibility`. */
export type DataGridGridLinesVisibility = 'None' | 'Horizontal' | 'Vertical' | 'All';

/** How a DataGrid selects rows; the Toolkit's `Extended` mode is not supported. */
export type DataGridSelectionMode = 'None' | 'Single';

/** Marks a column's header template: `<ng-template DataGridColumnHeader>…</ng-template>` inside a column. */
@Directive({
  selector: '[DataGridColumnHeader]'
})
export class DataGridColumnHeaderDirective {
  readonly Template = inject(TemplateRef);
}

/**
 * The base of DataGrid columns: a header (text or `[DataGridColumnHeader]` template) and a width. A width is a CSS
 * grid track (`1fr`, `120px`, `minmax(…)`), or the Toolkit's forms: `Auto` (sized to its content, also `auto`), `*`,
 * `2*` or a number of pixels.
 */
@Directive()
export abstract class DataGridColumn {
  @Input() Header?: string;
  @Input() Width: string = 'auto';

  @ContentChild(DataGridColumnHeaderDirective)
  private _headerTemplate?: DataGridColumnHeaderDirective;

  /** The template of a rich header, when there is one. */
  get HeaderTemplate(): TemplateRef<any> | undefined {
    return this._headerTemplate?.Template;
  }

  /** The template of a cell, if the column has one. */
  abstract get CellTemplate(): TemplateRef<any> | undefined;

  /** The CSS grid track of the column. */
  get TrackSize() {
    return DataGridColumn.toTrackSize(this.Width);
  }

  private static toTrackSize(width: string | number) {
    if (typeof width === 'number') return width + 'px';

    //Auto sizes to the header and the cells, as in the Toolkit, so a grid of auto columns scrolls rather than clips
    let value = width.trim();
    if (/^auto$|^sizetocells$|^sizetoheader$/i.test(value)) return 'max-content';
    if (value === '*') return '1fr';
    if (/^\d+(\.\d+)?\*$/.test(value)) return value.slice(0, -1) + 'fr';
    if (/^\d+(\.\d+)?$/.test(value)) return value + 'px';
    return value;
  }
}

/** A column showing a property of each item as text, as the Toolkit's `DataGridTextColumn`. */
@Component({
  selector: 'DataGridTextColumn',
  template: '',
  providers: [{ provide: DataGridColumn, useExisting: forwardRef(() => DataGridTextColumnComponent) }],
  styles: `:host { display: none; }`
})
export class DataGridTextColumnComponent extends DataGridColumn {
  /** The property path shown, dotted for nested properties (`Unit.Name`). */
  @Input() Binding?: string;

  /** Whether the text wraps in the cell; the Toolkit's default does not, it is clipped with an ellipsis instead. */
  @Input() TextWrapping: TextWrapping = 'NoWrap';

  override get CellTemplate() {
    return undefined;
  }

  /** The text of the column's cell for an item. */
  GetText(item: any): string {
    if (item === null || item === undefined) return '';
    let value = this.Binding ? this.Binding.split('.').reduce((p, c) => p?.[c], item) : item;
    return value === null || value === undefined ? '' : String(value);
  }
}

/** A column whose cells come from a template, as the Toolkit's `DataGridTemplateColumn`: `<ng-template let-item>`. */
@Component({
  selector: 'DataGridTemplateColumn',
  template: '',
  providers: [{ provide: DataGridColumn, useExisting: forwardRef(() => DataGridTemplateColumnComponent) }],
  styles: `:host { display: none; }`
})
export class DataGridTemplateColumnComponent extends DataGridColumn {
  @ContentChildren(TemplateRef)
  private _templates?: QueryList<TemplateRef<any>>;

  //The cell template is the one which is not the header's (told apart by their place: each query has its own TemplateRef)
  override get CellTemplate() {
    let header = this.HeaderTemplate?.elementRef.nativeElement;
    return this._templates?.find(p => p.elementRef.nativeElement !== header);
  }
}

/**
 * A table of items in rows and columns, like the Windows Community Toolkit's `DataGrid`. Its columns are
 * `DataGridTextColumn` and `DataGridTemplateColumn` children; the rows line up in one CSS grid, and the grid scrolls
 * sideways when it is wider than its container (and down, when given a height).
 */
@Component({
  selector: 'DataGrid',
  imports: [CommonModule, ScrollViewerComponent],
  template: `<ScrollViewer>
    <div class="grid" role="grid" [style.grid-template-columns]="columnTracks"
      [attr.aria-rowcount]="ItemsSource.length + (HeadersVisibility === 'Column' ? 1 : 0)" [attr.aria-colcount]="columns?.length ?? 0"
      [attr.aria-multiselectable]="SelectionMode === 'Single' ? 'false' : null" [attr.aria-disabled]="IsEnabled ? null : 'true'"
      (keydown)="onKeyDown($event)">
      <div *ngIf="HeadersVisibility === 'Column'" class="row header-row" role="row" aria-rowindex="1">
        <div *ngFor="let column of columns; index as columnIndex" class="cell header-cell" role="columnheader" [attr.aria-colindex]="columnIndex + 1" [ngClass]="{ 'frozen': columnIndex < FrozenColumnCount }">
          <ng-container *ngIf="column.HeaderTemplate" [ngTemplateOutlet]="column.HeaderTemplate" />
          <ng-container *ngIf="!column.HeaderTemplate">{{ column.Header }}</ng-container>
        </div>
      </div>
      <div *ngFor="let item of ItemsSource; index as index" class="row item-row" role="row"
        [attr.aria-rowindex]="index + (HeadersVisibility === 'Column' ? 2 : 1)"
        [attr.aria-selected]="SelectionMode === 'Single' ? index === SelectedIndex : null"
        [attr.tabindex]="IsEnabled && SelectionMode === 'Single' ? (index === focusIndex ? 0 : -1) : null"
        [ngClass]="{ 'selected': index === SelectedIndex }" (click)="onRowClick(index)">
        <div *ngFor="let column of columns; index as columnIndex" class="cell" role="gridcell" [attr.aria-colindex]="columnIndex + 1"
          [ngClass]="{ 'frozen': columnIndex < FrozenColumnCount, 'wrap': textColumn(column)?.TextWrapping === 'Wrap', 'text': !column.CellTemplate }">
          <ng-container *ngIf="column.CellTemplate" [ngTemplateOutlet]="column.CellTemplate" [ngTemplateOutletContext]="{ $implicit: item }" />
          <span *ngIf="!column.CellTemplate" class="cell-text">{{ textColumn(column)?.GetText(item) }}</span>
        </div>
      </div>
    </div>
  </ScrollViewer>`,
  styleUrl: 'DataGrid.scss'
})
export class DataGridComponent extends FrameworkElementComponent {
  @Input() IsEnabled = true;
  @Input() HeadersVisibility: DataGridHeadersVisibility = 'Column';
  @Input() GridLinesVisibility: DataGridGridLinesVisibility = 'None';
  @Input() SelectionMode: DataGridSelectionMode = 'Single';

  /** How many columns stay in place when the grid scrolls sideways: 0 or 1. */
  @Input() FrozenColumnCount = 0;

  @ContentChildren(DataGridColumn)
  protected columns?: QueryList<DataGridColumn>;

  private readonly _element: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _changeDetector = inject(ChangeDetectorRef);

  //Whether ItemsSource has been set; before that, a selected item set first is kept for the list to come
  private _hasItemsSource = false;

  //ItemsSource
  private _itemsSource: any[] = [];
  get ItemsSource() {
    return this._itemsSource;
  }
  @Input() set ItemsSource(value: any[]) {
    value = value ?? [];
    if (value === this._itemsSource) return;

    let oldIndex = this.SelectedIndex;
    let hadItemsSource = this._hasItemsSource;
    this._itemsSource = value;
    this._hasItemsSource = true;

    //A selected item which left the list is deselected, as in the Toolkit; the index can move either way
    if (hadItemsSource && this.SelectedItem !== null && !value.includes(this.SelectedItem)) this.SelectedItem = null;
    if (this.SelectedIndex !== oldIndex) this.SelectedIndexChange.emit(this.SelectedIndex);
  }

  //Selected item: the one stored form of the selection; the index is found from it
  private _selectedItem: any = null;
  get SelectedItem() {
    return this._selectedItem;
  }
  @Input() set SelectedItem(value: any) {
    if (value === undefined) value = null;
    if (value === this._selectedItem) return;

    let oldIndex = this.SelectedIndex;
    this._selectedItem = value;
    this.SelectedItemChange.emit(value);
    if (this.SelectedIndex !== oldIndex) this.SelectedIndexChange.emit(this.SelectedIndex);
  }
  @Output() SelectedItemChange = new EventEmitter<any>();

  get SelectedIndex() {
    return this._selectedItem === null ? -1 : this._itemsSource.indexOf(this._selectedItem);
  }
  @Input() set SelectedIndex(value: number) {
    if (value === this.SelectedIndex) return;
    this.SelectedItem = this._itemsSource[value] ?? null;
  }
  @Output() SelectedIndexChange = new EventEmitter<number>();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostBinding('class.horizontal-lines')
  private get horizontalLines() {
    return this.GridLinesVisibility === 'Horizontal' || this.GridLinesVisibility === 'All';
  }

  @HostBinding('class.vertical-lines')
  private get verticalLines() {
    return this.GridLinesVisibility === 'Vertical' || this.GridLinesVisibility === 'All';
  }

  @HostBinding('class.selectable')
  private get selectable() {
    return this.SelectionMode === 'Single' && this.IsEnabled;
  }

  protected get columnTracks() {
    return this.columns?.map(p => p.TrackSize).join(' ') ?? '';
  }

  //The row which is the grid's tab stop: the selected one, else the first
  protected get focusIndex() {
    return Math.max(this.SelectedIndex, 0);
  }

  protected textColumn(column: DataGridColumn) {
    return column instanceof DataGridTextColumnComponent ? column : undefined;
  }

  protected onRowClick(index: number) {
    if (!this.IsEnabled || this.SelectionMode !== 'Single') return;
    this.SelectedIndex = index;
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (!this.IsEnabled || this.SelectionMode !== 'Single' || this._itemsSource.length === 0) return;

    let last = this._itemsSource.length - 1;
    let index = this.SelectedIndex;
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, last);
        break;
      case 'ArrowUp':
        next = index < 0 ? 0 : Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.SelectedIndex = next;
    this._changeDetector.detectChanges();

    let row = this._element.nativeElement.querySelectorAll<HTMLElement>('.item-row')[next];
    row?.focus();
  }
}

/** The DataGrid and its column components, to import together. */
export const DataGridComponents = [DataGridComponent, DataGridTextColumnComponent, DataGridTemplateColumnComponent, DataGridColumnHeaderDirective] as const;
