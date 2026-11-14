import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, QueryList, TemplateRef, ViewChild, forwardRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { FrameworkElementComponent } from "../FrameworkElement";

/** How a TabView sizes its tabs, as WinUI's `TabViewWidthMode`. */
export type TabViewWidthMode = 'Equal' | 'SizeToContent' | 'Compact';

/** What `TabCloseRequested` reports: the tab whose close button or close key was used, and its index. */
export interface TabViewTabCloseRequestedEventArgs {
  Tab: TabViewItemComponent;
  Index: number;
}

/**
 * A row of tabs over the content of the selected one, as WinUI 3's `TabView`. Its `TabViewItem` children give the
 * tabs; only the selected one's content shows, the others stay in the page (hidden) and keep their state.
 */
@Component({
  selector: 'TabView',
  imports: [CommonModule],
  template: `<div class="strip">
    <div class="strip-header"><ng-content select="[TabStripHeader]"/></div>
    <div #tabList class="tabs" role="tablist" [attr.aria-disabled]="IsEnabled ? null : 'true'" (keydown)="onKeyDown($event)">
      <div *ngFor="let tab of tabs; index as index" class="tab" role="tab"
        [id]="tab.tabElementId" [attr.aria-controls]="tab.panelElementId" [attr.aria-selected]="index === SelectedIndex"
        [attr.title]="isHeaderCollapsed(tab, index) ? (tab.Header ?? null) : null"
        [attr.tabindex]="IsEnabled ? (index === focusIndex ? 0 : -1) : null"
        [ngClass]="{ 'selected': index === SelectedIndex, 'closable': tab.IsClosable, 'collapsed': isHeaderCollapsed(tab, index) }"
        (click)="onTabClick(index)" (auxclick)="onTabAuxClick($event, index)">
        <span class="tab-icon"><ng-container [ngTemplateOutlet]="tab.iconTemplate"/></span>
        <span class="tab-header"><ng-container [ngTemplateOutlet]="tab.headerTemplate"/></span>
        <span *ngIf="tab.IsClosable" class="close-button" aria-hidden="true" (click)="onCloseClick($event, index)">&#xE711;</span>
      </div>
    </div>
    <button *ngIf="IsAddTabButtonVisible" type="button" class="add-button" aria-label="Add tab" [disabled]="!IsEnabled" (click)="AddTabButtonClick.emit()">&#xE710;</button>
    <div class="strip-footer"><ng-content select="[TabStripFooter]"/></div>
  </div>
  <div class="panels"><ng-content/></div>`,
  styleUrl: 'TabView.scss'
})
export class TabViewComponent extends FrameworkElementComponent implements AfterContentInit, AfterContentChecked, OnDestroy {
  @Input() IsEnabled = true;

  /** How wide the tabs are: equal (between 100 and 240px), as wide as their header, or compact (icons only, but the selected tab). */
  @Input() TabWidthMode: TabViewWidthMode = 'Equal';

  /** Whether the strip has a button to add a tab; it raises `AddTabButtonClick` and the owner adds one. */
  @Input() IsAddTabButtonVisible = false;

  @Output() AddTabButtonClick = new EventEmitter<void>();

  /** A tab's close button, or Delete or Ctrl+F4 on it, was used; the owner removes the tab. */
  @Output() TabCloseRequested = new EventEmitter<TabViewTabCloseRequestedEventArgs>();

  @ContentChildren(forwardRef(() => TabViewItemComponent))
  private _items?: QueryList<TabViewItemComponent>;

  @ViewChild('tabList')
  private _tabList?: ElementRef<HTMLElement>;

  private _itemsSubscription?: Subscription;
  private readonly _changeDetector = inject(ChangeDetectorRef);

  /** The tabs, in order. */
  get Items(): TabViewItemComponent[] {
    return this._items?.toArray() ?? [];
  }

  //The live query list, a stable reference for the template (Items copies)
  protected get tabs() {
    return this._items;
  }

  //Selected index
  private _selectedIndex = 0;
  get SelectedIndex() {
    return this._selectedIndex;
  }
  @Input() set SelectedIndex(value: number) {
    if (value === undefined || value === null) value = -1;
    if (value === this._selectedIndex) return;

    this._selectedIndex = value;
    this.SelectedIndexChange.emit(value);
  }
  @Output() SelectedIndexChange = new EventEmitter<number>();

  /** The selected tab, if any. */
  get SelectedItem(): TabViewItemComponent | null {
    return this.Items[this.SelectedIndex] ?? null;
  }

  //The tab which takes the focus when tabbing into the strip: the selected one, else the first
  protected get focusIndex() {
    let count = this._items?.length ?? 0;
    return this.SelectedIndex >= 0 && this.SelectedIndex < count ? this.SelectedIndex : 0;
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostBinding('class.equal')
  private get isEqual() {
    return this.TabWidthMode === 'Equal';
  }

  protected isHeaderCollapsed(tab: TabViewItemComponent, index: number) {
    return this.TabWidthMode === 'Compact' && index !== this.SelectedIndex && tab.Icon !== undefined;
  }

  ngAfterContentInit(): void {
    //When tabs go, keep a tab selected (WinUI selects a neighbour of a closed tab); deferred, as the list
    //changes while the owner's view is being checked
    this._itemsSubscription = this._items?.changes.subscribe(() => {
      queueMicrotask(() => {
        let count = this._items?.length ?? 0;
        if (this.SelectedIndex >= count) this.SelectedIndex = count - 1;
        else if (this.SelectedIndex < 0 && count > 0) this.SelectedIndex = 0;
        this._changeDetector.markForCheck();
      });
    });
  }

  //Shows the selected panel and hides the others. Done here, once the tab list is up to date, rather than by a binding
  //on each tab: a tab added by the owner's @for is checked before the list knows it
  ngAfterContentChecked(): void {
    this._items?.forEach((tab, index) => tab.setPanelVisibility(index === this.SelectedIndex));
  }

  ngOnDestroy(): void {
    this._itemsSubscription?.unsubscribe();
  }

  protected onTabClick(index: number) {
    if (!this.IsEnabled) return;
    this.SelectedIndex = index;
  }

  //A middle click closes a closable tab, as in WinUI
  protected onTabAuxClick(event: MouseEvent, index: number) {
    if (event.button !== 1) return;
    event.preventDefault();
    this.requestClose(index);
  }

  protected onCloseClick(event: Event, index: number) {
    event.stopPropagation();
    this.requestClose(index);
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (!this.IsEnabled) return;

    let tabs = this.Items;
    let index = tabs.findIndex(p => document.getElementById(p.tabElementId) === event.target);
    if (index < 0) return;

    let next: number | undefined;
    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      case 'Delete':
        this.requestClose(index);
        break;
      case 'F4':
        if (event.ctrlKey) this.requestClose(index);
        else return;
        break;
      case 'Enter':
      case ' ':
        this.SelectedIndex = index;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (next === undefined) return;

    //Selection follows the focus
    this.SelectedIndex = next;
    this._changeDetector.detectChanges();
    this.getTabElement(next)?.focus();
  }

  private requestClose(index: number) {
    let tab = this.Items[index];
    if (!this.IsEnabled || !tab?.IsClosable) return;

    tab.CloseRequested.emit();
    this.TabCloseRequested.emit({ Tab: tab, Index: index });
  }

  private getTabElement(index: number) {
    return this._tabList?.nativeElement.querySelectorAll<HTMLElement>('[role="tab"]')[index];
  }
}

/**
 * A tab of a `TabView`: its `Header` and `Icon` (or projected `[TabViewItemHeader]` / `[TabViewItemIcon]` content)
 * make the tab, its other content the panel shown while it is selected.
 */
@Component({
  selector: 'TabViewItem',
  template: `<ng-template #iconTemplate>
      <span *ngIf="Icon" class="glyph" aria-hidden="true">{{Icon}}</span>
      <ng-content select="[TabViewItemIcon]"/>
    </ng-template>
    <ng-template #headerTemplate>{{Header}}<ng-content select="[TabViewItemHeader]"/></ng-template>
    <ng-content/>`,
  imports: [CommonModule],
  styles: `:host {
    display: grid;
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .glyph {
    font-family: var(--SymbolFontFamily);
    font-size: 16px;
    line-height: 16px;
  }`
})
export class TabViewItemComponent extends FrameworkElementComponent {
  /** The tab's text. */
  @Input() Header?: string;

  /** A Segoe Fluent Icons glyph shown before the header (WinUI's `IconSource`). */
  @Input() Icon?: string;

  /** Whether the tab has a close button (and Delete or Ctrl+F4 closes it). */
  @Input() IsClosable = true;

  /** The tab's close button, or a close key, was used; see also `TabView.TabCloseRequested`. */
  @Output() CloseRequested = new EventEmitter<void>();

  @ViewChild('iconTemplate', { static: true })
  /** @internal */ iconTemplate!: TemplateRef<unknown>;

  @ViewChild('headerTemplate', { static: true })
  /** @internal */ headerTemplate!: TemplateRef<unknown>;

  private readonly _owner = inject(TabViewComponent, { optional: true });

  /** Whether this is the selected tab of its TabView. */
  get IsSelected() {
    return this._owner?.SelectedItem === this;
  }

  /** @internal */
  get tabElementId() {
    return `xaml-tabview-tab-${this._id}`;
  }

  /** @internal */
  get panelElementId() {
    return `xaml-tabview-panel-${this._id}`;
  }

  @HostBinding('attr.id')
  private get id() {
    return this.panelElementId;
  }

  @HostBinding('attr.role')
  private readonly role = 'tabpanel';

  @HostBinding('attr.aria-labelledby')
  private get ariaLabelledBy() {
    return this.tabElementId;
  }

  private readonly _element: ElementRef<HTMLElement> = inject(ElementRef);

  /** @internal Called by the TabView: shows the panel of the selected tab, keeps the others in the page but hidden. */
  setPanelVisibility(isVisible: boolean) {
    this._element.nativeElement.hidden = !isVisible;
  }
}
