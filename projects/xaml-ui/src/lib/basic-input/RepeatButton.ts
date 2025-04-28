import { Component, HostListener, Input, OnDestroy } from "@angular/core";
import { ButtonComponent } from "./Button";

@Component({
  selector: 'RepeatButton',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class RepeatButtonComponent extends ButtonComponent implements OnDestroy {
  @Input() Delay: number = 250;
  @Input() Interval: number = 250;

  private _delayTimer: any;
  private _intervalTimer: any;

  @HostListener('pointerdown', ['$event'])
  private onPointerDown(event: PointerEvent) {
    if (!this.IsEnabled) return;

    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.Click.emit();

    this._delayTimer = setTimeout(() => {
      this.Click.emit();

      this._intervalTimer = setInterval(() => {
        this.Click.emit();
      }, this.Interval);
    }, this.Delay);
  }

  @HostListener('pointerup', ['$event'])
  private onPointerUp() {
    this.clearTimers();
  }

  private clearTimers() {
    if (this._delayTimer !== undefined) clearTimeout(this._delayTimer);
    if (this._intervalTimer !== undefined) clearInterval(this._intervalTimer);
  }

  protected override onHostPointerEvent(event: Event) {
    //Disable pointer event handling on the base button
  }
  
  ngOnDestroy(): void {
    this.clearTimers();
  }
}