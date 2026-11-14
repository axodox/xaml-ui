import { Component, ContentChild, DoCheck, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, inject } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";

@Component({
  selector: 'AppBarButton',
  template: `<div class="icon" aria-hidden="true">{{Icon}}<ng-content select="[Icon]"/></div><div class="text">{{Text}}</div><ng-content/>`,
  styleUrl: 'AppBarButton.scss'
})
export class AppBarButtonComponent extends FrameworkElementComponent implements DoCheck {
  @Input() IsEnabled = true;
  @Input() Text?: string;
  @Input() Icon?: string;

  /** Whether the button is in the tab order (WinUI's `IsTabStop`); it can still take the focus from code. */
  @Input() IsTabStop = true;

  @Output() Click = new EventEmitter();

  private readonly _element: ElementRef<HTMLElement> = inject(ElementRef);

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  private get tabIndex(): string | null {
    if (!this.IsEnabled) return null;
    return this.IsTabStop ? '0' : '-1';
  }

  //Role, tab stop and state, unless the owner set them itself
  private readonly _ownerAttributes = new Set(['role', 'tabindex', 'aria-disabled', 'aria-haspopup'].filter(p => this._element.nativeElement.hasAttribute(p)));

  private manageAttribute(name: string, value: string | null) {
    if (this._ownerAttributes.has(name)) return;

    let element = this._element.nativeElement;
    if (element.getAttribute(name) === value) return;
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  ngDoCheck() {
    this.manageAttribute('role', 'button');
    this.manageAttribute('tabindex', this.tabIndex);
    this.manageAttribute('aria-disabled', this.IsEnabled ? null : 'true');

    let flyout = this._flyout;
    this.manageAttribute('aria-haspopup', flyout ? 'true' : null);
    if (flyout) {
      let element = this._element.nativeElement;
      let expanded = String(!!flyout.IsOpen);
      if (element.getAttribute('aria-expanded') !== expanded) element.setAttribute('aria-expanded', expanded);
    }
  }

  @ContentChild('xaml-flyout')
  private _flyout?: FlyoutBaseComponent;

  @HostListener('click', ['$event'])
  protected onHostPointerEvent(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit(event);
    this._flyout?.Show();
  }

  //Enter and Space click it, as they do a native button
  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent) {
    if (event.target !== this._element.nativeElement || (event.key !== 'Enter' && event.key !== ' ')) return;

    event.preventDefault();
    if (this.IsEnabled && !event.repeat) this._element.nativeElement.click();
  }

  /** Moves the keyboard focus to the button. */
  Focus() {
    this._element.nativeElement.focus();
  }
}
