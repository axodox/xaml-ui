import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { ScrollMode } from "../Common";
import { ScrollBarComponent } from "./ScrollBar";
import { CdkScrollable } from "@angular/cdk/scrolling";

@Component({
  selector: 'ScrollViewer',
  imports: [CommonModule, ScrollBarComponent, CdkScrollable],
  template: `<div #content class="content" [ngStyle]="contentStyle" (scroll)="onScroll()" cdkScrollable><ng-content/></div>
    <ScrollBar *ngIf="IsVerticalScrollBarVisible" HorizontalAlignment="Right" class="scrollbar" Orientation="Vertical" [ScrollSize]="ExtentHeight" [ViewportSize]="ViewportHeight" [(Value)]="VerticalOffset"/>
    <ScrollBar *ngIf="IsHorizontalScrollBarVisible" VerticalAlignment="Bottom" class="scrollbar" Orientation="Horizontal" [ScrollSize]="ExtentWidth" [ViewportSize]="ViewportWidth" [(Value)]="HorizontalOffset"/>`,
  styleUrl: 'ScrollViewer.scss'
})
export class ScrollViewerComponent extends FrameworkElementComponent implements AfterViewInit {
  @Input() HorizontalScrollMode: ScrollMode = 'Auto';
  @Input() VerticalScrollMode: ScrollMode = 'Auto';

  @ViewChild('content')
  private _content!: ElementRef<HTMLDivElement>;

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
    return this._content?.nativeElement.scrollWidth;
  }

  get ExtentHeight() {
    return this._content?.nativeElement.scrollHeight;
  }

  get ViewportWidth() {
    return this._content?.nativeElement.clientWidth;
  }

  get ViewportHeight() {
    return this._content?.nativeElement.clientHeight;
  }

  get HorizontalOffset() {
    return this._content?.nativeElement.scrollLeft;
  }

  set HorizontalOffset(value: number) {
    if (this._content) this._content.nativeElement.scrollLeft = value;
  }

  get VerticalOffset() {
    return this._content?.nativeElement.scrollTop;
  }

  set VerticalOffset(value: number) {
    if (this._content) this._content.nativeElement.scrollTop = value;
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

  constructor(private _changeDetector: ChangeDetectorRef) {
    super();
  }

  protected onScroll() {
    //trigger change detect on scroll
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }
}