import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { ButtonComponent } from "./Button";

@Component({
  selector: 'ToggleButton',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class ToggleButtonComponent extends ButtonComponent {
  @Input() @HostBinding('class.checked') IsChecked: boolean = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    this.IsChecked = !this.IsChecked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}