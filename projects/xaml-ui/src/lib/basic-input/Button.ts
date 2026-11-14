import { Component, ContentChild, DoCheck, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, inject } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { HorizontalAlignment, ToAlignment, ToJustification, VerticalAlignment } from "../Common";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";
import { CommonModule } from "@angular/common";
import { TextBlockComponent } from "../text/TextBlock";

export const ButtonTemplate = `<TextBlock *ngIf="Content !== undefined" [Text]="Content"/>
  <ng-content/>`;

/**
 * A button. `<Button>` is a native `<button>` element (HTML element names are case-insensitive), which cannot be
 * self-closed in an Angular template: `<XamlButton Content="OK" />` is the same control as a custom element, for
 * where a self-closed tag is wanted.
 *
 * Buttons that are custom elements (`XamlButton` and the derived `DropDownButton`, `ToggleButton`, `HyperlinkButton`,
 * `RepeatButton`) behave like the native one: they are tab stops with the button role, and **Enter** or **Space**
 * clicks them.
 */
@Component({
  selector: 'Button, XamlButton',
  imports: [CommonModule, TextBlockComponent],
  template: ButtonTemplate,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent implements DoCheck {
  @Input() IsEnabled: boolean = true;
  @Input() Content?: string;

  /** A flyout to open on click, when it is not inside the button (WinUI's `Button.Flyout`). */
  @Input() Flyout?: FlyoutBaseComponent;

  /** Whether the button is in the tab order (WinUI's `IsTabStop`); it can still take the focus from code. */
  @Input() IsTabStop: boolean = true;

  @Output() Click = new EventEmitter();

  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  protected readonly _element: ElementRef<HTMLElement> = inject(ElementRef);

  //A native <button> brings its own focus, role and keys; a custom element gets them below
  private readonly _isNativeButton = this._element.nativeElement.tagName === 'BUTTON';

  @HostBinding('style.align-content')
  private get alignContent() {
    return ToAlignment(this.VerticalContentAlignment);
  }

  @HostBinding('style.justify-content')
  private get justifyContent() {
    return ToJustification(this.HorizontalContentAlignment);
  }

  @HostBinding('attr.type')
  private get type() {
    return this._isNativeButton ? 'button' : null;
  }

  protected get tabIndex(): string | null {
    if (this._isNativeButton) return this.IsTabStop ? null : '-1';
    if (!this.IsEnabled) return null;
    return this.IsTabStop ? '0' : '-1';
  }

  protected get role(): string | null {
    return this._isNativeButton ? null : 'button';
  }

  private get ariaDisabled() {
    return !this._isNativeButton && !this.IsEnabled ? 'true' : null;
  }

  //The attributes the button manages; one its owner sets (a swatch's `role="option"`, a roving tabindex) stays the owner's
  private readonly _ownAttributes = new Map<string, string | null>();
  private readonly _ownerAttributes = new Set(['role', 'tabindex', 'aria-disabled', 'aria-haspopup'].filter(p => this._element.nativeElement.hasAttribute(p)));

  private manageAttribute(name: string, value: string | null) {
    if (this._ownerAttributes.has(name)) return;

    let element = this._element.nativeElement;
    let current = element.getAttribute(name);
    if (this._ownAttributes.has(name) ? current !== this._ownAttributes.get(name) : current !== null) {
      this._ownerAttributes.add(name);
      return;
    }

    if (value === current) return;
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
    this._ownAttributes.set(name, value);
  }

  ngDoCheck() {
    this.manageAttribute('role', this.role);
    this.manageAttribute('tabindex', this.tabIndex);
    this.manageAttribute('aria-disabled', this.ariaDisabled);

    //A button that opens a flyout says so
    let flyout = this.flyout;
    this.manageAttribute('aria-haspopup', flyout ? 'true' : null);
    if (flyout) {
      let element = this._element.nativeElement;
      let expanded = String(!!flyout.IsOpen);
      if (element.getAttribute('aria-expanded') !== expanded) element.setAttribute('aria-expanded', expanded);
    }
  }

  @HostBinding('class.pressed')
  protected isPressed = false;

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent) {
    if (this.IsEnabled && event.button === 0) this.isPressed = true;
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  @HostListener('pointerleave', ['$event'])
  protected onPointerUp(event: PointerEvent) {
    this.isPressed = false;
  }

  //Enter clicks at once, Space when it is released, as on a native button
  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent) {
    if (this._isNativeButton || event.target !== this._element.nativeElement || !this.IsEnabled) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    if (event.key === ' ') {
      this.isPressed = true;
      return;
    }
    if (!event.repeat) this.onKeyboardClick();
  }

  @HostListener('keyup', ['$event'])
  protected onKeyUp(event: KeyboardEvent) {
    if (this._isNativeButton || event.target !== this._element.nativeElement || event.key !== ' ') return;

    event.preventDefault();
    if (!this.isPressed) return;

    this.isPressed = false;
    if (this.IsEnabled) this.onKeyboardClick();
  }

  /** A key clicked the button: by default the same as a click with the pointer. */
  protected onKeyboardClick() {
    this._element.nativeElement.click();
  }

  @HostBinding('attr.disabled')
  @HostBinding('class.disabled')
  private get disabled() {
    return this.IsEnabled ? undefined : true;
  }

  @HostBinding('class.flyout-open')
  private get flyoutOpen() {
    return this.flyout?.IsOpen;
  }

  @ContentChild('xaml-flyout')
  private _flyout?: FlyoutBaseComponent;

  private get flyout() {
    return this.Flyout ?? this._flyout;
  }

  @HostListener('click', ['$event'])
  protected onClick(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit(event);
    this.flyout?.Show();
  }

  /** Moves the keyboard focus to the button. */
  Focus() {
    this._element.nativeElement.focus();
  }
}
