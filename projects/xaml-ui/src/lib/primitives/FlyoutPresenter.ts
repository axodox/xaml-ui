import { Component, HostBinding, Input } from "@angular/core";

export type FlyoutPresenterAnimation = 'Default' | 'SlideLeft' | 'SlideRight' | 'SlideUp' | 'SlideDown';

@Component({
  selector: 'FlyoutPresenter',
  template: `<ng-content/>`,
  styleUrl: 'FlyoutPresenter.scss'
})
export class FlyoutPresenter {
  static TransitionDuration = 250;

  @Input() TransitionAnimation: FlyoutPresenterAnimation = 'Default';

  @Input() IsVisible: boolean = false;

  @HostBinding('class')
  private get transitionClass() {
    return 'transition-' + this.TransitionAnimation.toLowerCase();
  }

  @HostBinding('class.visible')
  private get visible() {
    return this.IsVisible;
  }
}