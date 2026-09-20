import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, HostListener, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

@Component({
  selector: 'MenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon">{{Icon}}<ng-content select="[Icon]"/></div>
  <div class="text">{{Text}}</div>
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class MenuFlyoutItemComponent extends MenuFlyoutItemBase {
  @Input() IsEnabled = true;
  @Input() Text = '';
  @Input() Icon?: string;
  @Output() Click = new EventEmitter();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('click', [])
  private onClick() {
    if (!this.IsEnabled) return;
    this.Click.emit();
  }
}