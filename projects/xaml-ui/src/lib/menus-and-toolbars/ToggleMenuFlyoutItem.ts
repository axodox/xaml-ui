import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

@Component({
  selector: 'ToggleMenuFlyoutItem',
  template: `<div class="icon">{{IsChecked ? '\uE73E' : '' }}</div>
  <div class="text">{{Text}}</div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class ToggleMenuFlyoutItemComponent extends MenuFlyoutItemBase {
  @Input() IsEnabled = true;
  @Input() Text = '';
  @Input() @HostBinding('class.checked') IsChecked: boolean = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('pointerup', ['$event'])
  private onPointerUp(event: PointerEvent) {
    if (!this.IsEnabled) return;
    if (event.button !== 0) return; // left button only
    this.IsChecked = !this.IsChecked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}