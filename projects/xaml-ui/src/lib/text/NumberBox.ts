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
  template: `<label>
    <div *ngIf="SpinButtonPlacementMode !== 'None'" class="spin-button">&#xEC8F;</div>
    <input class="text-box" #input size="1" type="text" role="spinbutton" autocomplete="off" spellcheck="false" [attr.inputmode]="InputMode === 'Integer' ? 'numeric' : 'decimal'" [attr.aria-label]="AutomationName" [attr.aria-valuenow]="ariaValueNow" [attr.aria-valuemin]="ariaValueMin" [attr.aria-valuemax]="ariaValueMax" [disabled]="!IsEnabled" [value]="Text" (change)="onChange()" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}" (blur)="onBlur()" (keydown)="onKeyDown($event)"/>
    <Flyout *ngIf="SpinButtonPlacementMode !== 'None'" #flyout Padding="2px" Placement="Left" ShowMode="Transient" [HasBackdrop]="false" [Target]="flyoutTarget">
      <RepeatButton Class="InlineButtonStyle" [IsTabStop]="false" (Click)="onIncreaseClick()" [Delay]="500" [Interval]="50"  (pointerdown)="onButtonPress()" (pointerup)="onButtonPress()"><FontIcon Glyph="&#xE70E;"/></RepeatButton>
      <RepeatButton Class="InlineButtonStyle" [IsTabStop]="false" (Click)="onDecreaseClick()" [Delay]="500" [Interval]="50"  (pointerdown)="onButtonPress()" (pointerup)="onButtonPress()"><FontIcon Glyph="&#xE70D;"/></RepeatButton>
    </Flyout>
    <div *ngIf="Unit !== undefined" class="unit">{{Unit}}</div>
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

  /** The accessible name of the box (WinUI's `AutomationProperties.Name`), when no visible label names it. */
  @Input('AutomationProperties-Name') AutomationName?: string;

  @Output() ValueChange = new EventEmitter<number>();

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

  @ViewChild('input', { static: true })
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

  //Empty text clears the value (NaN); text that is not a number puts the last value back, as WinUI's NumberBox does
  //(ValidationMode InvalidInputOverwritten)
  protected onChange() {
    let value = NumberBoxComponent.parse(this._input.nativeElement.value);
    if (value !== undefined && this.InputMode === 'Integer') value = Math.round(value);

    if (value === undefined) {
      this.updateText();
      this._input.nativeElement.value = this._text;
      return;
    }

    this.setValue(value);

    //Show the value as committed: clamped and formatted, also when the value itself did not change
    this.updateText();
    this._input.nativeElement.value = this._text;
  }

  /** Reads typed text as a number: NaN for empty text, undefined for text that is not a number. */
  static parse(text: string): number | undefined {
    text = text.trim();
    if (text === '') return NaN;

    //A decimal comma is read as a decimal point when there is no point
    if (/^[-+]?\d*,\d+$/.test(text)) text = text.replace(',', '.');

    let value = Number(text);
    return Number.isFinite(value) ? value : undefined;
  }

  protected get ariaValueNow() {
    return Number.isNaN(this.Value) ? null : this.Value;
  }

  protected get ariaValueMin() {
    return Number.isFinite(this.Minimum) ? this.Minimum : null;
  }

  protected get ariaValueMax() {
    return Number.isFinite(this.Maximum) ? this.Maximum : null;
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
  private onContextMenu(event: Event) {
    event.stopPropagation();
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }
}