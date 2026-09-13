import { Component, HostBinding, HostListener, Input } from "@angular/core";

export type FlyoutPresenterAnimation = 'Default' | 'SlideLeft' | 'SlideRight' | 'SlideUp' | 'SlideDown';

@Component({
  selector: 'FlyoutPresenter',
  template: `<ng-content/>`,
  styleUrl: 'FlyoutPresenter.scss'
})
export class FlyoutPresenter {
  static TransitionDuration = 250;

  @Input() TransitionAnimation: FlyoutPresenterAnimation = 'Default';
  @Input() @HostBinding('style.padding') Padding?: string;

  @Input() @HostBinding('class.visible') IsVisible: boolean = false;

  @HostBinding('class')
  private get transitionClass() {
    return 'transition-' + this.TransitionAnimation.toLowerCase();
  }

  @HostListener('contextmenu', ['$event'])
  private onContextMenu(event: Event) {
    event.preventDefault();
  }
}