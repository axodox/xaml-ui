import { Component, HostListener, Input, OnDestroy } from "@angular/core";
import { ButtonComponent, ButtonTemplate } from "./Button";
import { CommonModule } from "@angular/common";
import { TextBlockComponent } from "../text/TextBlock";

@Component({
  selector: 'RepeatButton',
  imports: [CommonModule, TextBlockComponent],
  template: ButtonTemplate,
  styleUrl: 'Button.scss'
})
export class RepeatButtonComponent extends ButtonComponent implements OnDestroy {
  @Input() Delay: number = 250;
  @Input() Interval: number = 250;

  private _delayTimer: any;
  private _intervalTimer: any;

  protected override onPointerDown(event: PointerEvent) {
    if (!this.IsEnabled) return;
    if (event.button !== 0) return;

    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.Click.emit();

    this._delayTimer = setTimeout(() => {
      this.Click.emit();

      this._intervalTimer = setInterval(() => {
        this.Click.emit();
      }, this.Interval);
    }, this.Delay);
  }

  protected override onPointerUp(event: PointerEvent) {
    if (event.button !== 0) return;
    this.clearTimers();
  }

  private clearTimers() {
    if (this._delayTimer !== undefined) clearTimeout(this._delayTimer);
    if (this._intervalTimer !== undefined) clearInterval(this._intervalTimer);
  }

  protected override onClick(event: Event) {
    //Disable pointer event handling on the base button
  }

  //Each key press clicks once; a held key repeats at the keyboard's own rate
  protected override onKeyDown(event: KeyboardEvent) {
    if (event.target !== this._element.nativeElement || !this.IsEnabled) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this.Click.emit();
  }

  protected override onKeyUp(event: KeyboardEvent) {
  }
  
  ngOnDestroy(): void {
    this.clearTimers();
  }
}