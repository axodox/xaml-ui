import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { TextAlignment } from "../Common";
import { RepeatButtonComponent } from "../basic-input/RepeatButton";
import { FontIconComponent } from "../icons/FontIcon";
import { CommonModule } from "@angular/common";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";

export type NumberInputMode = 'Float' | 'Integer';
export type NumberFormatter = (value: number) => string;
export type SpinButtonPlacementMode = 'None' | 'Compact';

@Component({
  selector: 'NumberBox',
  template: `<label [ngClass]="!showSpinButton()?'SpinButtonNone':''">
    <div class="icon" *ngIf="showSpinButton()">&#xEC8F;</div>
    <input class="text-box" #input size="1" type="text" [disabled]="!IsEnabled" [value]="Text" (change)="onChange()" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}" (blur)="onBlur()" (keydown)="onKeyDown($event)"/>
    <Flyout #flyout Padding="2px" Placement="Left" [HasBackdrop]="false" *ngIf="SpinButtonPlacementMode !== 'None'">
      <RepeatButton Class="InlineButtonStyle" (Click)="onIncreaseClick()" [Delay]="500" [Interval]="50"  (pointerdown)="onButtonPress()" (pointerup)="onButtonPress()"><FontIcon Glyph="&#xE70E;"/></RepeatButton>
      <RepeatButton Class="InlineButtonStyle" (Click)="onDecreaseClick()" [Delay]="500" [Interval]="50"  (pointerdown)="onButtonPress()" (pointerup)="onButtonPress()"><FontIcon Glyph="&#xE70D;"/></RepeatButton>
    </Flyout>
    <div class="unit" *ngIf="Unit !== undefined">{{Unit}}</div>
  </label>`,
  styleUrls: ['TextBox.scss', 'NumberBox.scss'],
  imports: [CommonModule, RepeatButtonComponent, FontIconComponent, FlyoutComponent]
})
export class NumberBoxComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;

  @Input() PlaceholderText: string = '';
  @Input() IsPlaceholderEditable: boolean = false;
  @Input() TextAlignment?: TextAlignment = 'Left';

  @Input() InputMode: NumberInputMode = 'Float';
  @Input() Minimum: number = -Infinity;
  @Input() Maximum: number = Infinity;
  @Input() SmallChange: number = 1;
  @Input() LargeChange: number = 10;
  @Input() Unit?: string;
  @Input() SpinButtonPlacementMode: SpinButtonPlacementMode = 'Compact';

  @Output() ValueChange = new EventEmitter<number>();
  /** Right mouse button (WinUI `RightTapped`); e.g. bind it to copy the field's value. */
  @Output() RightTapped = new EventEmitter<MouseEvent>();

  ngAfterViewInit() {
    if (this._flyout)
      this._flyout.Target = this.flyoutTarget;
  }

  private _numberFormatter = (value: number) => value.toString();
  get NumberFormatter() {
    return this._numberFormatter;
  }

  @Input() set NumberFormatter(value: NumberFormatter) {
    this._numberFormatter = value;
    this.updateText();
  }

  protected get flyoutTarget() {
    return this._input?.nativeElement;
  }

  @ViewChild('input')
  private _input!: ElementRef<HTMLInputElement>;

  @ViewChild('flyout')
  private _flyout?: FlyoutComponent;

  private _text = '';
  get Text() {
    return this._text;
  }

  private _value: number = NaN;
  get Value() {
    return this._value;
  }
  @Input() set Value(value: number) {
    this.setValue(value);
    this.updateText();
  }

  private setValue(value: number) {
    value = this.clampValue(value);
    if (value == this.Value) return;

    this._value = value;
    this.ValueChange.emit(value);
  }

  constructor() {
    super();
    this.TextAlignment = 'Right';
  }

  protected showSpinButton(): boolean {
    return this.SpinButtonPlacementMode !== 'None' && this.IsEnabled;
  }

  protected onChange() {
    this._text = this._input.nativeElement.value;

    let value: number | undefined;
    switch (this.InputMode) {
      case 'Float':
        value = parseFloat(this._text);
        break;
      case 'Integer':
        value = parseInt(this._text);
        break;
    }

    this.setValue(value);
  }

  private clampValue(value: number) {
    if (!Number.isNaN(value)) {
      if (this.Minimum !== undefined && value < this.Minimum) value = this.Minimum;
      if (this.Maximum !== undefined && value > this.Maximum) value = this.Maximum;
    }
    return value;
  }

  protected onIncreaseClick() {
    this.Value += this.SmallChange;
  }

  protected onDecreaseClick() {
    this.Value -= this.SmallChange;
  }

  protected onButtonPress() {
    this._input.nativeElement.focus();
    setTimeout(() => this.cancelFlyoutDismiss(), 0);
  }

  private _blurTimeout: any;

  private cancelFlyoutDismiss() {
    if (this._blurTimeout) {

      clearTimeout(this._blurTimeout);
      this._blurTimeout = undefined;
    }
  }

  private scheduleFlyoutDismiss() {
    this.cancelFlyoutDismiss();

    this._blurTimeout = setTimeout(() => {
      this._flyout?.Hide();
    }, 0);
  }

  protected onBlur() {
    this.updateText();
    this._input.nativeElement.value = this._text;

    if (this.IsPlaceholderEditable && this.PlaceholderText && this._input.nativeElement.value === this.PlaceholderText) {
      this._input.nativeElement.value = '';
      this.onChange();
    }

    this.scheduleFlyoutDismiss();
  }

  protected onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.Value += this.SmallChange;
        break;
      case 'ArrowDown':
        this.Value -= this.SmallChange;
        break;
      case 'PageUp':
        this.Value += this.LargeChange;
        break;
      case 'PageDown':
        this.Value -= this.LargeChange;
        break;
    }
  }

  @HostListener('click', [])
  private onClick() {
    this._input.nativeElement.focus();
  }

  @HostListener('focusin', [])
  private onFocusIn() {
    if (this.IsPlaceholderEditable && this.PlaceholderText && Number.isNaN(this.Value)) {
      this._input.nativeElement.value = this.PlaceholderText;
      this.onChange();
    }

    this._flyout?.Show();
    this._input.nativeElement.select();
  }

  private updateText() {
    this._text = Number.isNaN(this.Value) ? '' : this._numberFormatter(this.Value);
  }

  @HostListener('contextmenu', ['$event'])
  private onContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.RightTapped.emit(event);
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }
}