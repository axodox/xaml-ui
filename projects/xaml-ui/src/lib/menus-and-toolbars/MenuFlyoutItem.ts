import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, inject } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

/**
 * The right column of a menu item: a note and the keyboard accelerator's text, or accelerator content projected with
 * the `KeyboardAccelerator` attribute. Written without white space so the cell is `:empty` when it has nothing.
 */
export const MenuFlyoutItemAcceleratorTemplate = `<div class="accelerator"><span *ngIf="Note" class="note">{{Note}}</span><span *ngIf="KeyboardAcceleratorTextOverride" class="key">{{KeyboardAcceleratorTextOverride}}</span><ng-content select="[KeyboardAccelerator]"/></div>`;

/**
 * A command in a `MenuFlyout`. Besides its icon and text it shows, on the right, a `Note` (dimmed and italic: *.xlsx*,
 * why it is not possible now) and its keyboard accelerator (`KeyboardAcceleratorTextOverride`, as WinUI: *Ctrl+S*).
 * Its cells line up with the other items' in the menu's table.
 */
@Component({
  selector: 'MenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon" aria-hidden="true">{{Icon}}<ng-content select="[Icon]"/></div>
  <div class="text">{{Text}}</div>
  ${MenuFlyoutItemAcceleratorTemplate}
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class MenuFlyoutItemComponent extends MenuFlyoutItemBase {
  @Input() IsEnabled = true;
  @Input() Text = '';
  @Input() Icon?: string;

  /** The keyboard accelerator's text, shown on the right (*Ctrl+S*). */
  @Input() KeyboardAcceleratorTextOverride?: string;

  /** A dimmed note on the right, before the accelerator. */
  @Input() Note?: string;

  /** The colour of its icon and text (a destructive command in the critical colour). */
  @Input() @HostBinding('style.color') Foreground?: string;

  @Output() Click = new EventEmitter();

  protected readonly _element: ElementRef<HTMLElement> = inject(ElementRef);

  @HostBinding('attr.role')
  protected get role() {
    return 'menuitem';
  }

  //Focusable from the menu's arrow keys, not a tab stop
  @HostBinding('attr.tabindex')
  protected readonly tabIndex = -1;

  @HostBinding('attr.aria-disabled')
  private get ariaDisabled() {
    return this.IsEnabled ? null : 'true';
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('click', [])
  protected onClick() {
    if (!this.IsEnabled) return;
    this.Click.emit();
  }

  /** Moves the keyboard focus to the item. */
  Focus() {
    this._element.nativeElement.focus({ preventScroll: true });
  }
}
