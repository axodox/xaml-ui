import { Component, DoCheck, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

export type PasswordRevealMode = 'Peek' | 'Hidden' | 'Visible';

@Component({
  selector: 'PasswordBox',
  imports: [CommonModule],
  template: `<input class="text-box" #input [type]="isRevealed ? 'text' : 'password'" size="1" [autocomplete]="AutoComplete" [attr.name]="Name" [disabled]="!IsEnabled" [value]="Password" (input)="onInput()" [placeholder]="PlaceholderText"/>
  <div *ngIf="isRevealButtonVisible" class="reveal-button" (pointerdown)="onRevealPress($event)" (pointerup)="onRevealRelease()" (pointerleave)="onRevealRelease()" (pointercancel)="onRevealRelease()">&#xF78D;</div>`,
  styleUrls: ['TextBox.scss', 'PasswordBox.scss']
})
export class PasswordBoxComponent extends FrameworkElementComponent implements DoCheck {
  @Input() IsEnabled: boolean = true;
  @Input() PlaceholderText: string = '';
  @Input() PasswordRevealMode: PasswordRevealMode = 'Peek';

  //Tells password managers what to fill, e.g. 'new-password' on a sign-up form
  @Input() AutoComplete: string = 'current-password';

  //Form field name, e.g. to read the value with FormData
  @Input() Name?: string;

  @ViewChild('input')
  private _input!: ElementRef<HTMLInputElement>;

  private _password = '';
  get Password() {
    return this._password;
  }
  @Input() set Password(value: string) {
    if (value == this._password) return;

    this._password = value;
    this.PasswordChange.emit(value);
  }
  @Output() PasswordChange = new EventEmitter<string>();

  private _isPeeking = false;

  protected get isRevealed() {
    return this.PasswordRevealMode === 'Visible' || (this.PasswordRevealMode === 'Peek' && this._isPeeking);
  }

  protected get isRevealButtonVisible() {
    return this.PasswordRevealMode === 'Peek' && this.IsEnabled && this.Password !== '';
  }

  ngDoCheck() {
    //The reveal button can be removed while pressed (password cleared, disabled, mode changed),
    //so its release events never fire. Drop the stale peek before the view is checked.
    if (!this.isRevealButtonVisible) this._isPeeking = false;
  }

  protected onInput() {
    this.Password = this._input.nativeElement.value;
  }

  protected onRevealPress(event: PointerEvent) {
    //Keep the focus and the caret in the input
    event.preventDefault();
    this._isPeeking = true;
  }

  protected onRevealRelease() {
    this._isPeeking = false;
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('click', [])
  private onClick() {
    this._input.nativeElement.focus();
  }

  @HostListener('contextmenu', ['$event'])
  private onContextMenu(event: Event) {
    event.stopPropagation();
  }

  Focus() {
    setTimeout(() => {
      this._input.nativeElement.focus();
    }, 0);
  }
}
