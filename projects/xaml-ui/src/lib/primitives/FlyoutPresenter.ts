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

  @Input() IsVisible: boolean = false;

  @HostBinding('class.transition-default')
  private get isDefault() { return this.TransitionAnimation === 'Default'; }

  @HostBinding('class.transition-slideup')
  private get isSlideUp() { return this.TransitionAnimation === 'SlideUp'; }

  @HostBinding('class.transition-slidedown')
  private get isSlideDown() { return this.TransitionAnimation === 'SlideDown'; }

  @HostBinding('class.transition-slideleft')
  private get isSlideLeft() { return this.TransitionAnimation === 'SlideLeft'; }

  @HostBinding('class.transition-slideright')
  private get isSlideRight() { return this.TransitionAnimation === 'SlideRight'; }

  @HostBinding('class.visible')
  private get visible() {    
    return this.IsVisible;
  }

  @HostListener('contextmenu', ['$event'])
  private onContextMenu(event: Event) {
    event.preventDefault();
  }
}