import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, Input, OnDestroy, Output } from "@angular/core";
import { MenuFlyoutItemAcceleratorTemplate, MenuFlyoutItemComponent } from "./MenuFlyoutItem";

/**
 * One of a group of mutually exclusive options in a menu (WinUI's `RadioMenuFlyoutItem`): choosing it checks it and
 * unchecks the other items of the same `GroupName`; a bullet shows the checked one.
 */
@Component({
  selector: 'RadioMenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon" aria-hidden="true" [class.hidden]="!IsChecked"></div>
  <div class="text">{{Text}}</div>
  ${MenuFlyoutItemAcceleratorTemplate}
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class RadioMenuFlyoutItemComponent extends MenuFlyoutItemComponent implements OnDestroy {
  private static readonly _items = new Set<RadioMenuFlyoutItemComponent>();

  /** The group of options it belongs to. */
  @Input() GroupName = '';

  private _isChecked = false;
  get IsChecked() {
    return this._isChecked;
  }
  @Input() set IsChecked(value: boolean) {
    if (value === this._isChecked) return;

    this._isChecked = value;
    if (value) {
      for (let item of RadioMenuFlyoutItemComponent._items) {
        if (item !== this && item.GroupName === this.GroupName) item.IsChecked = false;
      }
    }
    this.IsCheckedChange.emit(value);
  }
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  constructor() {
    super();
    RadioMenuFlyoutItemComponent._items.add(this);
  }

  @HostBinding('class.checked')
  private get checked() {
    return this.IsChecked;
  }

  @HostBinding('attr.aria-checked')
  private get ariaChecked() {
    return this.IsChecked;
  }

  protected override get role() {
    return 'menuitemradio';
  }

  //A click, Enter or Space checks it; then the menu closes
  protected override onClick() {
    if (!this.IsEnabled) return;

    this.IsChecked = true;
    this.Click.emit();
  }

  ngOnDestroy(): void {
    RadioMenuFlyoutItemComponent._items.delete(this);
  }
}
