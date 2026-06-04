import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { Component, ContentChild, EventEmitter, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
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
  @ViewChild('xaml-dialog-presenter') private _dialogPresenter?: DialogPresenter;

  IsBackdropDismissEnabled = false;

  static Create<T extends Dialog>(type: { new(...args: any[]): T }, container: ViewContainerRef): T {
    let component = container.createComponent(type);
    component.instance._overlay = container.injector.get(Overlay);
    component.instance._viewContainerRef = container.injector.get(ViewContainerRef);
    component.instance.Closed.subscribe(() => component.destroy());
    return component.instance;
  }

  async ShowAsync(): Promise<any> {
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
    await resume_on_event(this.Closed);

    //Fade-out
    if (this._dialogPresenter) {
      this._dialogPresenter.IsVisible = false;
      await resume_after(DialogPresenter.TransitionDuration);
    }

    //Cleanup
    backdropContextMenuSubscription();
    overlayRef.detach();
  }

  Hide() {
    this.Closed.emit();
  }
}