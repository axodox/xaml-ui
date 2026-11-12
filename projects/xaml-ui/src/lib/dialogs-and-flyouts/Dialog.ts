import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { Component, ComponentRef, ContentChild, EventEmitter, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { resume_after, resume_on_event } from "../Common";
import { TemplatePortal } from "@angular/cdk/portal";
import { DialogPresenter } from "../primitives/DialogPresenter";

@Component({
  template: ''
})
export abstract class Dialog {
  @Output() Closed = new EventEmitter();

  @ViewChild('template') private _template!: TemplateRef<any>;

  private _overlay!: Overlay;
  private _viewContainerRef!: ViewContainerRef;
  private _componentRef?: ComponentRef<Dialog>;
  private _isShown = false;
  @ViewChild('xaml-dialog-presenter') private _dialogPresenter?: DialogPresenter;

  IsBackdropDismissEnabled = false;

  static Create<T extends Dialog>(type: { new(...args: any[]): T }, container: ViewContainerRef): T {
    let component = container.createComponent(type);
    component.instance._overlay = container.injector.get(Overlay);
    component.instance._viewContainerRef = container.injector.get(ViewContainerRef);
    component.instance._componentRef = component;
    //If closed without ever being shown, there is no fade-out to wait for
    component.instance.Closed.subscribe(() => {
      if (!component.instance._isShown) component.destroy();
    });
    return component.instance;
  }

  async ShowAsync(): Promise<any> {
    this._isShown = true;

    //Subscribe before any await, so a Hide() during setup is not missed
    let closed = resume_on_event(this.Closed);

    //Wait for a layout cycle to ensure templates etc. are ready
    await resume_after(0);

    //Create overlay
    let positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    let config = new OverlayConfig({
      hasBackdrop: true,
      panelClass: 'xaml-overlay-pane',
      positionStrategy: positionStrategy,
      backdropClass: ['xaml-dialog-overlay-backdrop', 'xaml-themed']
    });

    let overlayRef = this._overlay.create(config);

    //Attach template
    let templatePortal = new TemplatePortal(
      this._template,
      this._viewContainerRef
    );

    overlayRef.attach(templatePortal);

    //Wait for UI to instantiate
    await resume_after(0);

    //Disable backdrop menu
    let renderer = this._viewContainerRef.injector.get(Renderer2);
    let backdropContextMenuSubscription = renderer.listen(overlayRef.backdropElement, 'contextmenu', p => p.preventDefault());

    //Backdrop dismiss
    if(this.IsBackdropDismissEnabled) overlayRef.backdropClick().subscribe(() => this.Hide());

    //Fade-in
    if (this._dialogPresenter) this._dialogPresenter.IsVisible = true;

    //Wait for close
    await closed;

    //Fade-out
    if (this._dialogPresenter) {
      this._dialogPresenter.IsVisible = false;
      await resume_after(DialogPresenter.TransitionDuration);
    }

    //Cleanup
    backdropContextMenuSubscription();
    overlayRef.detach();
    //Destroyed only now, as destroying on Closed would remove the content and its styles during the fade-out
    this._componentRef?.destroy();
  }

  Hide() {
    this.Closed.emit();
  }
}