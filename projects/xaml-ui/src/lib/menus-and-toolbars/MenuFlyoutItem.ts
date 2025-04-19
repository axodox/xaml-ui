import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

@Component({
  selector: 'MenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon">{{Icon}}</div>
  <div class="text">{{Text}}</div>
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class MenuFlyoutItemComponent extends MenuFlyoutItemBase {
  @Input() IsEnabled = true;
  @Input() Text = '';
  @Input() Icon?: string;
  @Input() Tag: any;
  @Output() Click = new EventEmitter<any>();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('click', [])
  private onClick() {
    this.Click.emit(this.Tag);
  }
}