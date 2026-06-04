import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "../primitives/FlyoutPresenter";
import { PopupTemplate } from "../primitives/FlyoutBase";
import { OverlayRef } from "@angular/cdk/overlay-module.d-CSrPj90C";
import { XamlRootComponent } from "../XamlRoot";

@Component({
  selector: 'MenuFlyout',
  imports: [CommonModule, FlyoutPresenter, XamlRootComponent],
  template: PopupTemplate,
  styleUrls: ['MenuFlyout.scss'],
  providers: [{ provide: 'xaml-flyout', useExisting: MenuFlyoutComponent }]
})
export class MenuFlyoutComponent extends FlyoutComponent {

  private _menuClickSubscription?: () => void;

  protected override get transitionAnimation(): FlyoutPresenterAnimation {
    return 'Default';
  }

  protected override OnOverlay(overlay: OverlayRef): void {
    if (this._menuClickSubscription) this._menuClickSubscription();

    this._menuClickSubscription = this._renderer.listen(overlay.overlayElement, 'click', p => this.onMenuClick(p));
  }

  private onMenuClick(event: Event) {
    this.IsOpen = false;
    event.stopPropagation();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this._menuClickSubscription) this._menuClickSubscription();
  }
}