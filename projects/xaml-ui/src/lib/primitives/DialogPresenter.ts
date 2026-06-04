import { Component, ContentChild, ElementRef, HostBinding, Input, ViewChild } from "@angular/core";
import { XamlRootComponent } from "../XamlRoot";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'DialogPresenter',
  template: `<XamlRoot>
    <div class="frame">
      <div #header class="header" [ngStyle]="{'display': isHeaderVisible ? 'grid' : 'none'}"><ng-content select="[Header]"/></div>
      <div class="body"><ng-content/></div>
      <div #footer class="footer" [ngStyle]="{'display': isFooterVisible ? 'grid' : 'none'}"><ng-content select="[Footer]"/></div>
    </div>
  </XamlRoot>`,
  styleUrls: ['DialogPresenter.scss'],
  imports: [CommonModule, XamlRootComponent],
  providers: [{ provide: 'xaml-dialog-presenter', useExisting: DialogPresenter }]
})
export class DialogPresenter extends XamlRootComponent {
  static TransitionDuration = 250;

  @ViewChild('header') private _header?: ElementRef<HTMLDivElement>;
  @ViewChild('footer') private _footer?: ElementRef<HTMLDivElement>;

  @Input() IsVisible: boolean = false;

  @HostBinding('class.visible')
  private get visible() {
    return this.IsVisible;
  }

  protected get isHeaderVisible() {
    return this._header?.nativeElement.children.length ?? 0 > 0;
  }

  protected get isFooterVisible() {
    return this._footer?.nativeElement.children.length ?? 0 > 0;
  }
}