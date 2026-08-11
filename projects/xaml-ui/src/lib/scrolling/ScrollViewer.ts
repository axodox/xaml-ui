import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, Input, TemplateRef, TrackByFunction, ViewChild } from "@angular/core";
import { ScrollMode } from "../Common";
import { ScrollBarComponent } from "./ScrollBar";
import { CdkScrollable, CdkVirtualScrollViewport, ScrollingModule } from "@angular/cdk/scrolling";

/**
 * A scrolling panel with the themed WinUI overlay scrollbar.
 *
 * Two ways to use it:
 *  - **Arbitrary content** — project any markup as `<ng-content>`; it scrolls as a plain panel
 *    (the original behaviour, unchanged).
 *  - **A list** — bind {@link Items} and provide a per-item `<ng-template let-item let-i="index">`.
 *    The list then renders through a CDK **virtual-scroll** viewport (only the visible rows exist in
 *    the DOM) when {@link IsVirtualizing} is true (the default), or as a plain panel with every row
 *    rendered when it is false.
 *
 * Either way the same overlay {@link ScrollBarComponent} is drawn over the content; virtualization
 * requires the host to be height-bounded (as any virtual scroller does).
 */
@Component({
  selector: 'ScrollViewer',
  imports: [CommonModule, ScrollBarComponent, CdkScrollable, ScrollingModule],
  template: `@if (IsListMode) {
      @if (IsVirtualizing) {
        <cdk-virtual-scroll-viewport #virtualContent class="content-virtual" [itemSize]="ItemSize"
          [minBufferPx]="MinBufferPx" [maxBufferPx]="MaxBufferPx" (scroll)="onScroll()">
          <div class="virtual-row " *cdkVirtualFor="let item of Items; let i = index; trackBy: TrackByFn" [style.margin]="Spacing" [style.height.px]="ItemSize">
            <ng-container [ngTemplateOutlet]="ItemTemplate!" [ngTemplateOutletContext]="{ $implicit: item, index: i }" />
          </div>
        </cdk-virtual-scroll-viewport>
      } @else {
        <div #content class="content" [ngStyle]="contentStyle" (scroll)="onScroll()" cdkScrollable>
          @for (item of Items; track $index) {
            <ng-container [ngTemplateOutlet]="ItemTemplate!" [ngTemplateOutletContext]="{ $implicit: item, index: $index }" />
          }
        </div>
      }
    } @else {
      <div #content class="content" [ngStyle]="contentStyle" (scroll)="onScroll()" cdkScrollable><ng-content/></div>
    }
    <ScrollBar *ngIf="IsVerticalScrollBarVisible" HorizontalAlignment="Right" class="scrollbar" Orientation="Vertical" [ScrollSize]="ExtentHeight" [ViewportSize]="ViewportHeight" [(Value)]="VerticalOffset"/>
    <ScrollBar *ngIf="IsHorizontalScrollBarVisible" VerticalAlignment="Bottom" class="scrollbar" Orientation="Horizontal" [ScrollSize]="ExtentWidth" [ViewportSize]="ViewportWidth" [(Value)]="HorizontalOffset"/>`,
  styleUrl: 'ScrollViewer.scss'
})
export class ScrollViewerComponent extends FrameworkElementComponent implements AfterViewInit {
  @Input() HorizontalScrollMode: ScrollMode = 'Auto';
  @Input() VerticalScrollMode: ScrollMode = 'Auto';

  /**
   * When true (the default), a list ({@link Items} + item template) is rendered through a CDK
   * virtual-scroll viewport so only the visible rows live in the DOM. Set false to render every row in
   * a plain scrolling panel. Ignored for plain projected content (which always renders as-is).
   */
  @Input() IsVirtualizing: boolean = true;

  @Input() Spacing: string = "0px";

  /** The items to display as a list. When null, arbitrary projected `<ng-content>` is scrolled instead. */
  @Input() Items: readonly unknown[] | null = null;

  /**
   * The row height (px) when virtualized. Each row is pinned to this height (content taller than it is
   * clipped), which is also the fixed size the CDK strategy assumes — so setting this sets the row
   * height, and the two can't drift apart (a mismatch makes the scroll position slip).
   */
  @Input() ItemSize: number = 32;

  /** Buffer sizes (px) the virtual scroller keeps rendered beyond the viewport. */
  @Input() MinBufferPx: number = 200;
  @Input() MaxBufferPx: number = 400;

  /**
   * How the list identifies rows, so DOM/state is reused across changes (as `*ngFor`/`*cdkVirtualFor`
   * `trackBy`). Defaults to index. Set this when {@link Items} is rebuilt with fresh objects each time
   * but rows have a stable key, to avoid re-rendering every visible row on each change.
   */
  @Input() TrackBy?: TrackByFunction<unknown>;

  protected readonly TrackByFn: TrackByFunction<unknown> = (index, item) =>
    this.TrackBy ? this.TrackBy(index, item) : index;

  /** The per-item template, e.g. `<ng-template let-item let-i="index">…</ng-template>`. */
  @ContentChild(TemplateRef) protected ItemTemplate?: TemplateRef<unknown>;

  @ViewChild('content')
  private _content?: ElementRef<HTMLDivElement>;

  @ViewChild(CdkVirtualScrollViewport)
  private _viewport?: CdkVirtualScrollViewport;

  /** True when used as a list (items + an item template) rather than a plain content panel. */
  protected get IsListMode(): boolean {
    return this.Items != null && !!this.ItemTemplate;
  }

  // The element that actually scrolls: the CDK viewport when virtualizing a list, else the plain panel.
  private get _scrollElement(): HTMLElement | undefined {
    if (this.IsListMode && this.IsVirtualizing) return this._viewport?.elementRef.nativeElement;
    return this._content?.nativeElement;
  }

  get IsHorizontalScrollBarVisible() {
    switch (this.HorizontalScrollMode) {
      case 'Disabled':
        return false;
      case 'Auto':
        return this.ViewportWidth < this.ExtentWidth;
      case 'Enabled':
        return true;
    }
  }

  get IsVerticalScrollBarVisible() {
    switch (this.VerticalScrollMode) {
      case 'Disabled':
        return false;
      case 'Auto':
        return this.ViewportHeight < this.ExtentHeight;
      case 'Enabled':
        return true;
    }
  }

  get ExtentWidth() {
    return this._scrollElement?.scrollWidth ?? 0;
  }

  get ExtentHeight() {
    return this._scrollElement?.scrollHeight ?? 0;
  }

  get ViewportWidth() {
    return this._scrollElement?.clientWidth ?? 0;
  }

  get ViewportHeight() {
    return this._scrollElement?.clientHeight ?? 0;
  }

  get HorizontalOffset() {
    return this._scrollElement?.scrollLeft ?? 0;
  }

  set HorizontalOffset(value: number) {
    const el = this._scrollElement;
    if (el) el.scrollLeft = value;
  }

  get VerticalOffset() {
    return this._scrollElement?.scrollTop ?? 0;
  }

  set VerticalOffset(value: number) {
    const el = this._scrollElement;
    if (el) el.scrollTop = value;
  }

  private static toOverflow(value: ScrollMode) {
    switch (value) {
      case 'Disabled':
        return 'hidden';
      case 'Enabled':
        return 'scroll';
      case 'Auto':
        return 'auto';
    }
  }

  protected get contentStyle() {
    return {
      'overflow-x': ScrollViewerComponent.toOverflow(this.HorizontalScrollMode),
      'overflow-y': ScrollViewerComponent.toOverflow(this.VerticalScrollMode)
    };
  }

  constructor(private _changeDetector: ChangeDetectorRef) {
    super();
  }

  protected onScroll() {
    //trigger change detect on scroll
  }

  /** Scrolls a virtualized row into view by its index. No-op unless virtualizing a list. */
  ScrollToIndex(index: number): void {
    this._viewport?.scrollToIndex(index);
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }
}
