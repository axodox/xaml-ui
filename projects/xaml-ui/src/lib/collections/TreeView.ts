import { ChangeDetectorRef, Component, ContentChild, DoCheck, ElementRef, EventEmitter, HostBinding, Input, Output, TemplateRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CheckBoxComponent } from "../basic-input/CheckBox";
import { ItemContainerComponent } from "../primitives/ItemContainer";

/** How a TreeView selects, as WinUI's `TreeViewSelectionMode`. */
export type TreeViewSelectionMode = 'None' | 'Single' | 'Multiple';

const CollapsedGlyph = '\uE76C';
const ExpandedGlyph = '\uE70D';

/**
 * A hierarchical list with expanding and collapsing nodes, as WinUI's `TreeView` used with an items source. Each item's
 * children are read from `ChildrenMemberPath`. In `Multiple` mode every row has a check box: checking a node selects
 * its whole subtree, and a node whose subtree is partly selected shows a dash.
 */
@Component({
  selector: 'TreeView',
  imports: [CommonModule, CheckBoxComponent, ItemContainerComponent],
  template: `<div class="tree" role="tree" [attr.aria-multiselectable]="SelectionMode === 'Multiple' ? 'true' : null"
      [attr.aria-disabled]="IsEnabled ? null : 'true'" (keydown)="onKeyDown($event)">
      <ng-container [ngTemplateOutlet]="nodes" [ngTemplateOutletContext]="{ $implicit: ItemsSource, level: 1 }"/>
    </div>
    <ng-template #nodes let-items let-level="level">
      <div *ngFor="let item of items" class="treeitem" role="treeitem"
        [attr.aria-level]="level"
        [attr.aria-expanded]="hasChildren(item) ? isExpanded(item) : null"
        [attr.aria-selected]="SelectionMode === 'Single' ? item === SelectedItem : null"
        [attr.aria-checked]="SelectionMode === 'Multiple' ? ariaChecked(item) : null"
        [attr.tabindex]="IsEnabled ? (item === focusTarget ? 0 : -1) : null"
        (focus)="onItemFocus($event, item)">
        <ItemContainer #container class="row" [ngClass]="{ 'selected': isRowSelected(item) }" [style.padding-left.px]="(level - 1) * 16" (click)="onRowClick(item)">
          <div class="item-selector"></div>
          <span class="chevron" aria-hidden="true" (click)="onChevronClick($event, item)">{{ hasChildren(item) ? (isExpanded(item) ? expandedGlyph : collapsedGlyph) : '' }}</span>
          <CheckBox *ngIf="SelectionMode === 'Multiple'" class="check" aria-hidden="true" [IsChecked]="checkState(item)" [IsTabStop]="false" [IsEnabled]="IsEnabled" />
          <div class="item-content">
            <ng-container *ngIf="ItemTemplate">
              <ng-container [ngTemplateOutlet]="ItemTemplate" [ngTemplateOutletContext]="{ $implicit: item }" [ngTemplateOutletInjector]="container.Injector" />
            </ng-container>
            <ng-container *ngIf="!ItemTemplate">{{ DisplayMemberPath && item !== null ? item[DisplayMemberPath] : item }}</ng-container>
          </div>
        </ItemContainer>
        <div *ngIf="hasChildren(item) && isExpanded(item)" role="group">
          <ng-container [ngTemplateOutlet]="nodes" [ngTemplateOutletContext]="{ $implicit: childrenOf(item), level: level + 1 }"/>
        </div>
      </div>
    </ng-template>`,
  styleUrl: 'TreeView.scss'
})
export class TreeViewComponent extends FrameworkElementComponent implements DoCheck {
  @ContentChild(TemplateRef)
  private _contentItemTemplate?: TemplateRef<any>;

  private _inputItemTemplate?: TemplateRef<any>;
  /** The template of an item's content; a `<ng-template let-item>` inside the TreeView does the same. */
  @Input() set ItemTemplate(value: TemplateRef<any> | undefined) {
    this._inputItemTemplate = value;
  }
  get ItemTemplate(): TemplateRef<any> | undefined {
    return this._inputItemTemplate ?? this._contentItemTemplate;
  }

  @Input() IsEnabled = true;

  /** The property of an item which holds its children. */
  @Input() ChildrenMemberPath = 'Children';

  /** The property of an item shown as its text when there is no item template. */
  @Input() DisplayMemberPath?: string;

  @Input() SelectionMode: TreeViewSelectionMode = 'Single';

  /** An item was clicked, or Enter pressed on it. */
  @Output() ItemInvoked = new EventEmitter<any>();

  /** A node is being expanded, by the user or by `Expand()` (not when `ExpandedItems` is set). */
  @Output() Expanding = new EventEmitter<any>();

  /** A node was collapsed, by the user or by `Collapse()` (not when `ExpandedItems` is set). */
  @Output() Collapsed = new EventEmitter<any>();

  private readonly _element: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _changeDetector = inject(ChangeDetectorRef);

  //The check states of Multiple mode, derived from SelectedItems and ItemsSource; dropped when either changes
  private _checkStates?: Map<any, boolean | null>;

  //The row which is the tree's tab stop (roving tabindex): the focused one, kept to a visible row
  private _focusTarget: any = null;

  //ItemsSource
  private _itemsSource: any[] = [];
  get ItemsSource() {
    return this._itemsSource;
  }
  @Input() set ItemsSource(value: any[]) {
    value = value ?? [];
    if (value === this._itemsSource) return;

    this._itemsSource = value;
    this._checkStates = undefined;
  }

  //Selected item (Single mode)
  private _selectedItem: any = null;
  get SelectedItem() {
    return this._selectedItem;
  }
  @Input() set SelectedItem(value: any) {
    if (value === undefined) value = null;
    if (value === this._selectedItem) return;

    this._selectedItem = value;
    this.SelectedItemChange.emit(value);
  }
  @Output() SelectedItemChange = new EventEmitter<any>();

  //Selected items (Multiple mode): every node whose check box is checked, leaves and fully selected parents alike
  private _selectedItems: any[] = [];
  get SelectedItems() {
    return this._selectedItems;
  }
  @Input() set SelectedItems(value: any[]) {
    value = value ?? [];
    if (TreeViewComponent.areSameItems(value, this._selectedItems)) return;

    this._selectedItems = value;
    this._checkStates = undefined;
    this.SelectedItemsChange.emit(value);
  }
  @Output() SelectedItemsChange = new EventEmitter<any[]>();

  //Expanded items
  private _expandedItems: any[] = [];
  get ExpandedItems() {
    return this._expandedItems;
  }
  @Input() set ExpandedItems(value: any[]) {
    value = value ?? [];
    if (TreeViewComponent.areSameItems(value, this._expandedItems)) return;

    this._expandedItems = value;
    this.ExpandedItemsChange.emit(value);
  }
  @Output() ExpandedItemsChange = new EventEmitter<any[]>();

  /** Expands a node, raising `Expanding`. */
  Expand(item: any) {
    if (this.isExpanded(item)) return;

    this.Expanding.emit(item);
    this.ExpandedItems = [...this._expandedItems, item];
  }

  /** Collapses a node, raising `Collapsed`. */
  Collapse(item: any) {
    if (!this.isExpanded(item)) return;

    //The tab stop goes to the collapsed node when it was inside it, as the focus does in WinUI
    if (this.getSubtree(item).includes(this._focusTarget)) this._focusTarget = item;
    this.ExpandedItems = this._expandedItems.filter(p => p !== item);
    this.Collapsed.emit(item);
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  protected readonly collapsedGlyph = CollapsedGlyph;
  protected readonly expandedGlyph = ExpandedGlyph;

  protected get focusTarget() {
    return this._focusTarget;
  }

  //Keep the tab stop on a visible row: the focused one, else the selected one, else the first
  ngDoCheck(): void {
    let visible = this.getVisibleItems();
    if (visible.includes(this._focusTarget)) return;

    let selected = this.SelectionMode === 'Single' && visible.includes(this.SelectedItem) ? this.SelectedItem : null;
    this._focusTarget = selected ?? visible[0] ?? null;
  }

  protected childrenOf(item: any): any[] {
    let children = item?.[this.ChildrenMemberPath];
    return Array.isArray(children) ? children : [];
  }

  protected hasChildren(item: any) {
    return this.childrenOf(item).length > 0;
  }

  protected isExpanded(item: any) {
    return this._expandedItems.includes(item);
  }

  protected isRowSelected(item: any) {
    switch (this.SelectionMode) {
      case 'Single':
        return item === this.SelectedItem;
      case 'Multiple':
        return this.checkState(item) === true;
      default:
        return false;
    }
  }

  /** The check state of a node in Multiple mode: true, false, or null for a partly selected subtree. */
  protected checkState(item: any): boolean | null {
    if (!this._checkStates) this._checkStates = this.computeCheckStates(this._selectedItems);
    let state = this._checkStates.get(item);
    return state === undefined ? false : state;
  }

  protected ariaChecked(item: any) {
    let state = this.checkState(item);
    return state === null ? 'mixed' : String(state);
  }

  protected onItemFocus(event: FocusEvent, item: any) {
    if (event.target === event.currentTarget) this._focusTarget = item;
  }

  protected onRowClick(item: any) {
    if (!this.IsEnabled) return;

    this._focusTarget = item;
    this.selectOrToggle(item);
    this.ItemInvoked.emit(item);
  }

  protected onChevronClick(event: Event, item: any) {
    if (!this.IsEnabled || !this.hasChildren(item)) return;

    event.stopPropagation();
    this._focusTarget = item;
    if (this.isExpanded(item)) this.Collapse(item);
    else this.Expand(item);
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (!this.IsEnabled) return;

    let target = event.target as HTMLElement;
    if (target.getAttribute('role') !== 'treeitem') return;

    let item = this._focusTarget;
    let visible = this.getVisibleItems();
    let index = visible.indexOf(item);
    if (index < 0) return;

    switch (event.key) {
      case 'ArrowDown':
        this.focusItem(visible[Math.min(index + 1, visible.length - 1)]);
        break;
      case 'ArrowUp':
        this.focusItem(visible[Math.max(index - 1, 0)]);
        break;
      case 'Home':
        this.focusItem(visible[0]);
        break;
      case 'End':
        this.focusItem(visible[visible.length - 1]);
        break;
      case 'ArrowRight':
        if (!this.hasChildren(item)) break;
        if (!this.isExpanded(item)) this.Expand(item);
        else this.focusItem(this.childrenOf(item)[0]);
        break;
      case 'ArrowLeft': {
        if (this.hasChildren(item) && this.isExpanded(item)) {
          this.Collapse(item);
          break;
        }
        let parent = this.findParent(item);
        if (parent !== undefined) this.focusItem(parent);
        break;
      }
      case ' ':
        this.selectOrToggle(item);
        break;
      case 'Enter':
        this.ItemInvoked.emit(item);
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  private selectOrToggle(item: any) {
    if (this.SelectionMode === 'Single') this.SelectedItem = item;
    else if (this.SelectionMode === 'Multiple') this.toggle(item);
  }

  //WinUI's multiple selection: checking a node (unchecked or partly checked) selects its whole subtree, unchecking it
  //clears the subtree and its ancestors; the parents then follow from their children
  private toggle(item: any) {
    let selected = new Set<any>();
    for (let [node, state] of this.computeCheckStates(this._selectedItems)) {
      if (state === true) selected.add(node);
    }

    let subtree = this.getSubtree(item);
    if (this.checkState(item) === true) {
      for (let node of subtree) selected.delete(node);
      for (let ancestor of this.findAncestors(item)) selected.delete(ancestor);
    }
    else {
      for (let node of subtree) selected.add(node);
    }

    let states = this.computeCheckStates([...selected]);
    this.SelectedItems = [...states].filter(p => p[1] === true).map(p => p[0]);
  }

  //Walks the tree in order: a node is checked when it is selected, under a selected node, or all its children are
  //checked; unchecked when none of its subtree is; else partly checked (null)
  private computeCheckStates(selectedItems: any[]) {
    let selected = new Set(selectedItems);
    let states = new Map<any, boolean | null>();

    let walk = (item: any, isInherited: boolean): boolean | null => {
      let isSelected = isInherited || selected.has(item);
      let children = this.childrenOf(item);
      states.set(item, isSelected); //takes its place in tree order, before its children
      let state: boolean | null = isSelected;

      if (children.length > 0) {
        let childStates = children.map(p => walk(p, isSelected));
        if (!isSelected) {
          if (childStates.every(p => p === true)) state = true;
          else if (childStates.every(p => p === false)) state = false;
          else state = null;
        }
      }

      states.set(item, state);
      return state;
    };

    for (let item of this._itemsSource) walk(item, false);
    return states;
  }

  private focusItem(item: any) {
    if (item === undefined) return;

    this._focusTarget = item;
    this._changeDetector.detectChanges();

    let index = this.getVisibleItems().indexOf(item);
    let element = this._element.nativeElement.querySelectorAll<HTMLElement>('[role="treeitem"]')[index];
    element?.focus();
  }

  //The rows shown, in order: the roots and the children of expanded nodes
  private getVisibleItems() {
    let result: any[] = [];
    let walk = (items: any[]) => {
      for (let item of items) {
        result.push(item);
        if (this.isExpanded(item)) walk(this.childrenOf(item));
      }
    };
    walk(this._itemsSource);
    return result;
  }

  private getSubtree(item: any) {
    let result = [item];
    for (let child of this.childrenOf(item)) result.push(...this.getSubtree(child));
    return result;
  }

  //The ancestors of an item, nearest first; empty for a root or an item not in the tree
  private findAncestors(item: any): any[] {
    let find = (items: any[], path: any[]): any[] | undefined => {
      for (let node of items) {
        if (node === item) return path;
        let found = find(this.childrenOf(node), [node, ...path]);
        if (found) return found;
      }
      return undefined;
    };
    return find(this._itemsSource, []) ?? [];
  }

  private findParent(item: any) {
    return this.findAncestors(item)[0];
  }

  private static areSameItems(a: any[], b: any[]) {
    return a === b || (a.length === b.length && a.every((p, i) => p === b[i]));
  }
}
