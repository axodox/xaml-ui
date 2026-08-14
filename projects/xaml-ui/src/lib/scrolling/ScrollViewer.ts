import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, Input, NgZone, OnDestroy, TemplateRef, TrackByFunction, ViewChild } from "@angular/core";
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
 *
 * Performance: the component is `OnPush` and the scrollbar is driven by **cached** metrics that are
 * refreshed only on scroll and on `ResizeObserver` notifications (both outside Angular). It never reads
 * layout (`scrollHeight` / `clientHeight` / …) during ordinary change detection, so unrelated app
 * activity — clicks, flyout animations — can't make it thrash layout.
 */
@Component({
  selector: 'ScrollViewer',
  imports: [CommonModule, ScrollBarComponent, CdkScrollable, ScrollingModule],
  template: `@if (IsListMode) {
      @if (IsVirtualizing) {
        <cdk-virtual-scroll-viewport #virtualContent class="content-virtual" [itemSize]="ItemSize"
          [minBufferPx]="MinBufferPx" [maxBufferPx]="MaxBufferPx" (scroll)="onScroll()">
          <div class="virtual-row " *cdkVirtualFor="let item of Items; let i = index; trackBy: TrackByFn" [style.padding]="Spacing" [style.height.px]="ItemSize">
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
  styleUrl: 'ScrollViewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollViewerComponent extends FrameworkElementComponent implements AfterViewInit, OnDestroy {
  @Input() HorizontalScrollMode: ScrollMode = 'Auto';
  @Input() VerticalScrollMode: ScrollMode = 'Auto';

  /**
   * When true (the default), a list ({@link Items} + item template) is rendered through a CDK
   * virtual-scroll viewport so only the visible rows live in the DOM. Set false to render every row in
   * a plain scrolling panel. Ignored for plain projected content (which always renders as-is).
   */
  @Input() IsVirtualizing: boolean = true;

  /**
   * Gap around each virtualized row, applied as padding **inside** {@link ItemSize} (the row is
   * `border-box`). It deliberately isn't a margin: a margin would add to the row's pitch while the
   * virtual scroller still positions rows every `ItemSize` px, so the rendered rows drift past the
   * scrollable range and the tail of the list becomes unreachable. Size {@link ItemSize} to include
   * the gap (e.g. 34px of content + 3px above/below → `ItemSize = 40`, `Spacing = "3px 0"`).
   */
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

  // Cached scroll metrics, refreshed only by measure() (on scroll / resize). The template binds these
  // cached fields so change detection never touches layout.
  private _extentWidth = 0;
  private _extentHeight = 0;
  private _viewportWidth = 0;
  private _viewportHeight = 0;
  private _horizontalOffset = 0;
  private _verticalOffset = 0;

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
    return this._extentWidth;
  }

  get ExtentHeight() {
    // When virtualizing, the CDK viewport doesn't expose the true total via `scrollHeight` reliably
    // (and it sizes it asynchronously). For fixed-size rows the total is exact arithmetic — no layout
    // read — so derive it from the inputs; the plain panel uses the measured content height.
    if (this.IsListMode && this.IsVirtualizing) return (this.Items?.length ?? 0) * this.ItemSize;
    return this._extentHeight;
  }

  get ViewportWidth() {
    return this._viewportWidth;
  }

  get ViewportHeight() {
    return this._viewportHeight;
  }

  get HorizontalOffset() {
    return this._horizontalOffset;
  }

  set HorizontalOffset(value: number) {
    const el = this._scrollElement;
    if (el) {
      el.scrollLeft = value;
      this._horizontalOffset = el.scrollLeft;
    }
  }

  get VerticalOffset() {
    return this._verticalOffset;
  }

  set VerticalOffset(value: number) {
    const el = this._scrollElement;
    if (el) {
      el.scrollTop = value;
      this._verticalOffset = el.scrollTop;
    }
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

  private _resizeObserver?: ResizeObserver;
  private _observedElements: Element[] = [];
  private _destroyed = false;

  constructor(private _changeDetector: ChangeDetectorRef, private _zone: NgZone) {
    super();
  }

  // Scroll fires (via the template binding) inside Angular, so the event already marks this OnPush
  // component for check; refresh the cached offsets so the scrollbar reflects the new position.
  protected onScroll() {
    this.measure();
  }

  /** Scrolls a virtualized row into view by its index. No-op unless virtualizing a list. */
  ScrollToIndex(index: number): void {
    this._viewport?.scrollToIndex(index);
  }

  ngAfterViewInit(): void {
    this.measure();
    this.observe();
    // help the layout finish itself
    this._changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    this._resizeObserver?.disconnect();
  }

  // Read the scroll element's live geometry into the cached fields. Cheap when called from a scroll or
  // ResizeObserver callback (layout is already settled there); never called during change detection.
  private measure(): void {
    const el = this._scrollElement;
    if (!el) return;
    this._extentWidth = el.scrollWidth;
    this._extentHeight = el.scrollHeight;
    this._viewportWidth = el.clientWidth;
    this._viewportHeight = el.clientHeight;
    this._horizontalOffset = el.scrollLeft;
    this._verticalOffset = el.scrollTop;
  }

  // Watch the scroll element and its content for size changes (viewport resized, content grown /
  // shrunk) so the scrollbar stays correct without polling layout on every change-detection cycle.
  // Runs outside Angular; re-measures and refreshes just this view when something changes.
  private observe(): void {
    const el = this._scrollElement;
    if (!el || typeof ResizeObserver === 'undefined') return;

    this._zone.runOutsideAngular(() => {
      this._resizeObserver = new ResizeObserver(() => {
        if (this._destroyed) return;
        this.measure();
        // OnPush + outside the zone: check just this view so the scrollbar updates without a global tick.
        this._changeDetector.detectChanges();
      });
      // The element gives us the viewport size; its content child gives us the extent (scrollHeight).
      this._observedElements = [el, el.firstElementChild].filter(Boolean) as Element[];
      for (const target of this._observedElements) this._resizeObserver.observe(target);
    });
  }
}
