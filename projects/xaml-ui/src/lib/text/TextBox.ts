import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { TextAlignment, TextWrapping, UpdateTrigger } from "../Common";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'TextBox',
  imports: [CommonModule],
  template: `<input class="text-box" #input *ngIf="TextWrapping === 'NoWrap'" type="text" size="1" [disabled]="!IsEnabled" [value]="Text" (input)="onInput()" (keydown.enter)="onEnter()" (blur)="onBlur()" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}"/>
  <textarea class="text-box" #input *ngIf="TextWrapping === 'Wrap'" [disabled]="!IsEnabled" [value]="Text" (input)="onInput()" (blur)="onBlur()" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}"></textarea>`,
  styleUrl: 'TextBox.scss'
})
export class TextBoxComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() PlaceholderText: string = '';
  @Input() IsPlaceholderEditable: boolean = false;
  @Input() TextAlignment?: TextAlignment = 'Left';
  @Input() TextWrapping: TextWrapping = 'NoWrap';
  @Input() UpdateTrigger: UpdateTrigger = 'PropertyChanged';
  @Input() Pattern?: string;

  @ViewChild('input')
  private _input!: ElementRef<HTMLInputElement>;

  private _text = '';
  get Text() {
    return this._text;
  }
  @Input() set Text(value: string) {
    if (value == this._text) return;

    this._text = value;
    this._validatedValue = value;
    this.TextChange.emit(value);
  }
  @Output() TextChange = new EventEmitter<string>();
  /** Right mouse button (WinUI `RightTapped`); e.g. bind it to copy the field's text. */
  @Output() RightTapped = new EventEmitter<MouseEvent>();

  private _validatedValue = '';
  protected onInput() {
    //Validate input
    if (this.Pattern) {
      let element = this._input.nativeElement;
      let regex = new RegExp(this.Pattern);
      if (!element.value.match(regex)) {
        element.value = this._validatedValue;
        return;
      }

      this._validatedValue = element.value;
    }

    if (this.UpdateTrigger == 'PropertyChanged') this.update();
  }

  protected onBlur() {

    if (this.IsPlaceholderEditable && this.PlaceholderText && this._input.nativeElement.value === this.PlaceholderText) {
      this._input.nativeElement.value = '';
      this.update();
    }

    if (this.UpdateTrigger == 'LostFocus') this.update();
  }

  // Enter commits the current value (like losing focus), regardless of UpdateTrigger — so e.g. a
  // LostFocus field applies on Enter without having to blur first. Multiline (textarea) keeps Enter as
  // a newline, so it isn't wired there.
  protected onEnter() {
    this.update();
  }

  protected update() {
    this.Text = this._input.nativeElement.value;
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
  private onContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.RightTapped.emit(event);
  }

  Focus() {
    setTimeout(() => {
      this._input.nativeElement.focus();
    }, 0);
  }

  @HostListener('focusin', [])
  private onFocusIn() {
    if (this.IsPlaceholderEditable && this.PlaceholderText && this.Text === '') {
      this._input.nativeElement.value = this.PlaceholderText;
      this.update();
    }
  }
}