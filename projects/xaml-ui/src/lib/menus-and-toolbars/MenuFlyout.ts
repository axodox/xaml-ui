import { Component, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverlayRef } from "@angular/cdk/overlay";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "../primitives/FlyoutPresenter";
import { PopupTemplate } from "../primitives/FlyoutBase";
import { XamlRootComponent } from "../XamlRoot";

/**
 * A menu of commands and options. Its presenter has the `menu` role and takes the focus when it opens; opened from the
 * keyboard (its button had the keyboard focus), the first item takes it. Keys as in WinUI: **↓** / **↑** move between
 * the items that are enabled and wrap around, **Home** / **End** go to the first and last, **Enter** or **Space**
 * chooses, **Esc** closes. The pointer moves the focus along with it.
 *
 * Choosing an enabled item closes the menu; a click on a disabled item, a header, a separator or the menu's edge leaves
 * it open. Items are found by their role (`menuitem`, `menuitemcheckbox`, `menuitemradio`, with `aria-disabled`), so
 * custom items that set them work the same.
 */
@Component({
  selector: 'MenuFlyout',
  imports: [CommonModule, FlyoutPresenter, XamlRootComponent],
  template: PopupTemplate,
  styleUrls: ['MenuFlyout.scss'],
  providers: [{ provide: 'xaml-flyout', useExisting: MenuFlyoutComponent }]
})
export class MenuFlyoutComponent extends FlyoutComponent implements OnDestroy {

  private static readonly _itemSelector = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

  private _overlaySubscriptions: (() => void)[] = [];

  protected override get transitionAnimation(): FlyoutPresenterAnimation {
    return 'Default';
  }

  protected override OnOverlay(overlay: OverlayRef): void {
    this.unsubscribe();

    let element = overlay.overlayElement;
    this._overlaySubscriptions.push(
      this._renderer.listen(element, 'click', p => this.onMenuClick(p)),
      this._renderer.listen(element, 'keydown', p => this.onMenuKeyDown(p)),
      this._renderer.listen(element, 'pointermove', p => this.onMenuPointerMove(p))
    );
  }

  protected override OnOpened(overlay: OverlayRef, focusOrigin: HTMLElement | null | undefined): void {
    let presenter = this.GetPresenter(overlay);
    if (!presenter) return;

    presenter.setAttribute('role', 'menu');
    presenter.tabIndex = -1;

    //An owner that has already focused an item (the current choice) keeps it
    if (presenter.contains(document.activeElement)) return;

    //Opened from the keyboard: the first item takes the focus, else the menu itself does
    let first = focusOrigin?.matches(':focus-visible') ? this.getItems(presenter)[0] : undefined;
    (first ?? presenter).focus({ preventScroll: true });
  }

  //Fading out, it is no longer the open menu
  protected override OnClosing(overlay: OverlayRef): void {
    this.GetPresenter(overlay)?.removeAttribute('role');
  }

  private getItems(presenter: Element) {
    return Array.from(presenter.querySelectorAll<HTMLElement>(MenuFlyoutComponent._itemSelector))
      .filter(p => p.getAttribute('aria-disabled') !== 'true');
  }

  private getItem(target: EventTarget | null) {
    return (target as Element | null)?.closest?.<HTMLElement>(MenuFlyoutComponent._itemSelector) ?? null;
  }

  private onMenuClick(event: Event) {
    event.stopPropagation();

    let item = this.getItem(event.target);
    if (!item || item.getAttribute('aria-disabled') === 'true') return;

    this.IsOpen = false;
  }

  private onMenuKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    let presenter = (event.currentTarget as Element).querySelector('FlyoutPresenter');
    if (!presenter) return;

    let items = this.getItems(presenter);
    let current = this.getItem(document.activeElement);
    let index = current ? items.indexOf(current) : -1;

    let next: HTMLElement | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = items[(index + 1) % items.length];
        break;
      case 'ArrowUp':
        next = items[index <= 0 ? items.length - 1 : index - 1];
        break;
      case 'Home':
        next = items[0];
        break;
      case 'End':
        next = items[items.length - 1];
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (current && index >= 0 && !event.repeat) current.click();
        return;
      case 'Tab':
        //The keyboard leaves the menu: it closes, and the focus goes back to its button
        event.preventDefault();
        this.Hide();
        return;
      default:
        return;
    }

    event.preventDefault();
    next?.focus({ preventScroll: true });
    next?.scrollIntoView({ block: 'nearest' });
  }

  private onMenuPointerMove(event: PointerEvent) {
    let item = this.getItem(event.target);
    if (item && item !== document.activeElement && item.getAttribute('aria-disabled') !== 'true') {
      item.focus({ preventScroll: true });
    }
  }

  private unsubscribe() {
    for (let unsubscribe of this._overlaySubscriptions) unsubscribe();
    this._overlaySubscriptions = [];
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribe();
  }
}
