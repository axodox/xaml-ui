import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from "@angular/core";
import { ScrollMode } from "../Common";
import { ScrollBarComponent } from "./ScrollBar";
import { CdkScrollable } from "@angular/cdk/scrolling";

@Component({
  selector: 'ScrollViewer',
  imports: [CommonModule, ScrollBarComponent, CdkScrollable],
  template: `<div #content class="content" [ngStyle]="contentStyle" (scroll)="onScroll()" cdkScrollable><ng-content/></div>
    <ScrollBar *ngIf="IsVerticalScrollBarVisible" HorizontalAlignment="Right" class="scrollbar" Orientation="Vertical" [ScrollSize]="ExtentHeight" [ViewportSize]="ViewportHeight" [(Value)]="VerticalOffset"/>
    <ScrollBar *ngIf="IsHorizontalScrollBarVisible" VerticalAlignment="Bottom" class="scrollbar" Orientation="Horizontal" [ScrollSize]="ExtentWidth" [ViewportSize]="ViewportWidth" [(Value)]="HorizontalOffset"/>`,
  styleUrl: 'ScrollViewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollViewerComponent extends FrameworkElementComponent implements AfterViewInit, OnDestroy {
  @Input() HorizontalScrollMode: ScrollMode = 'Auto';
  @Input() VerticalScrollMode: ScrollMode = 'Auto';

  @ViewChild('content')
  private _content!: ElementRef<HTMLDivElement>;

  //Cached scroll metrics, refreshed by measure() on scroll and resize, so the template can bind them
  //without touching layout
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
    const element = this._content?.nativeElement;
    if (element) {
      element.scrollLeft = value;
      this._horizontalOffset = element.scrollLeft;
    }
  }

  get VerticalOffset() {
    return this._verticalOffset;
  }

  set VerticalOffset(value: number) {
    const element = this._content?.nativeElement;
    if (element) {
      element.scrollTop = value;
      this._verticalOffset = element.scrollTop;
    }
  }

  protected override get overflow() {
    return "hidden";
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
  private _mutationObserver?: MutationObserver;
  private _isDestroyed = false;

  constructor(private _changeDetector: ChangeDetectorRef, private _zone: NgZone) {
    super();
  }

  /** Scrolls to an absolute offset, leaving omitted axes where they are. */
  ScrollTo(horizontalOffset?: number, verticalOffset?: number) {
    if (horizontalOffset !== undefined) this.HorizontalOffset = horizontalOffset;
    if (verticalOffset !== undefined) this.VerticalOffset = verticalOffset;
  }

  /** Scrolls by an offset relative to the current position. */
  ScrollBy(horizontalDelta: number, verticalDelta: number) {
    this.ScrollTo(this.HorizontalOffset + horizontalDelta, this.VerticalOffset + verticalDelta);
  }

  /** Scrolls an element of the content into view. */
  ScrollToElement(element: Element, options: ScrollIntoViewOptions = { block: 'nearest' }) {
    element.scrollIntoView(options);
    this.measure();
  }

  protected onScroll() {
    //the scroll event already marks this component for check, just refresh the cached offsets
    this.measure();
  }

  ngAfterViewInit(): void {
    this.measure();
    this.observe();
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this._isDestroyed = true;
    this._resizeObserver?.disconnect();
    this._mutationObserver?.disconnect();
  }

  //Reads the live geometry of the content into the cached fields, called from scroll and observer
  //callbacks only, where the layout has already settled
  private measure() {
    const element = this._content?.nativeElement;
    if (!element) return;

    this._extentWidth = element.scrollWidth;
    this._extentHeight = element.scrollHeight;
    this._viewportWidth = element.clientWidth;
    this._viewportHeight = element.clientHeight;
    this._horizontalOffset = element.scrollLeft;
    this._verticalOffset = element.scrollTop;
  }

  //Watches the content for size changes - the viewport resized, the content grown or shrunk - so the
  //scrollbars stay correct without polling layout on every change detection cycle
  private observe() {
    const element = this._content?.nativeElement;
    if (!element || typeof ResizeObserver === 'undefined') return;

    this._zone.runOutsideAngular(() => {
      this._resizeObserver = new ResizeObserver(() => this.refresh());
      this.observeContent(element);

      if (typeof MutationObserver === 'undefined') return;

      //Children come and go as the projected content renders, and adding or removing one changes the
      //extent without resizing anything the ResizeObserver watches, so keep the watched set in sync
      this._mutationObserver = new MutationObserver(() => {
        if (this._isDestroyed) return;

        this.observeContent(element);
        this.refresh();
      });
      this._mutationObserver.observe(element, { childList: true });
    });
  }

  //The content element gives the viewport size and its children give the extent - any of them can be
  //the one which grows, so all of them are watched
  private observeContent(element: HTMLElement) {
    if (!this._resizeObserver) return;

    this._resizeObserver.disconnect();
    this._resizeObserver.observe(element);
    for (const child of Array.from(element.children)) this._resizeObserver.observe(child);
  }

  //Refreshes the cached metrics and renders just this view - the observers run outside the zone, so
  //nothing else would pick the change up, and a scrollbar is not worth a global tick
  private refresh() {
    if (this._isDestroyed) return;

    this.measure();
    this._changeDetector.detectChanges();
  }
}