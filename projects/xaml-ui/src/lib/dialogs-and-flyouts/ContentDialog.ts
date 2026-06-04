import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DialogPresenter } from "../primitives/DialogPresenter";
import { GridModule } from "../layout/Grid";
import { ButtonComponent } from "../basic-input/Button";
import { CommonModule } from "@angular/common";
import { Dialog } from "./Dialog";
import { TextBlockComponent } from "../text/TextBlock";
import { XamlRootComponent } from "../XamlRoot";

export enum ContentDialogResult {
  None,
  Primary,
  Secondary
}

export enum ContentDialogButton {
  None,
  Primary,
  Secondary,
  Close
}

@Component({
  selector: 'ContentDialogPresenter',
  template: `<XamlRoot>
    <div class="frame">
      <div #header class="header">{{_dialog.Title}}</div>
      <div class="body">
        <TextBlock TextWrapping="Wrap">{{_dialog.Content}}</TextBlock>
        <ng-content/>
      </div>
      <div #footer class="footer" [ngStyle]="{'display': isFooterVisible ? 'grid' : 'none'}">
        <Grid Orientation="Horizontal" ColumnSpacing="6px" AutoColumnDefinition="minmax(0, 1fr)" Footer>
          <Button *ngIf="_dialog.PrimaryButtonText !== undefined" [IsEnabled]="_dialog.IsPrimaryButtonEnabled" (Click)="onPrimaryButtonClicked()" [class.AccentButtonStyle]="isPrimaryButtonDefault">{{_dialog.PrimaryButtonText}}</Button>
          <Button *ngIf="_dialog.SecondaryButtonText !== undefined" [IsEnabled]="_dialog.IsSecondaryButtonEnabled" (Click)="onSecondaryButtonClicked()" [class.AccentButtonStyle]="isSecondaryButtonDefault">{{_dialog.SecondaryButtonText}}</Button>
          <Button *ngIf="_dialog.CloseButtonText !== undefined" (Click)="onCloseButtonClicked()" [class.AccentButtonStyle]="isCloseButtonDefault">{{_dialog.CloseButtonText}}</Button>
        </Grid>
      </div>
    </div>
  </XamlRoot>`,
  styles: ``,
  imports: [GridModule, ButtonComponent, CommonModule, TextBlockComponent, XamlRootComponent],
  styleUrl: '../Primitives/DialogPresenter.scss',
  providers: [{ provide: 'xaml-dialog-presenter', useExisting: ContentDialogPresenter }]
})
export class ContentDialogPresenter extends DialogPresenter {
  protected _dialog: ContentDialog;

  constructor(
    dialog : ContentDialog)
  {
    super();
    this._dialog = dialog;
  }

  protected onPrimaryButtonClicked() {
    this._dialog.PrimaryButtonClicked.emit();
    this._dialog.Result = ContentDialogResult.Primary;
  }

  protected onSecondaryButtonClicked() {
    this._dialog.SecondaryButtonClicked.emit();
    this._dialog.Result = ContentDialogResult.Secondary;
  }

  protected onCloseButtonClicked() {
    this._dialog.CloseButtonClicked.emit();
    this._dialog.Result = ContentDialogResult.None;
  }

  protected get isPrimaryButtonDefault() {
    return this._dialog.DefaultButton === ContentDialogButton.Primary;
  }

  protected get isSecondaryButtonDefault() {
    return this._dialog.DefaultButton === ContentDialogButton.Secondary;
  }

  protected get isCloseButtonDefault() {
    return this._dialog.DefaultButton === ContentDialogButton.Close;
  }
}

@Component({
  selector: 'ContentDialog',
  template: `<ng-template #template>
    <ContentDialogPresenter/>
  </ng-template>`,
  styles: ``,
  imports: [CommonModule, ContentDialogPresenter]
})
export class ContentDialog extends Dialog {
  @Input() Title?: string;

  @Input() PrimaryButtonText?: string;
  @Input() IsPrimaryButtonEnabled: boolean = true;
  @Output() PrimaryButtonClicked = new EventEmitter();

  @Input() SecondaryButtonText?: string;
  @Input() IsSecondaryButtonEnabled: boolean = true;
  @Output() SecondaryButtonClicked = new EventEmitter();

  @Input() CloseButtonText?: string;
  @Output() CloseButtonClicked = new EventEmitter();

  @Input() Content: any;

  @Input() DefaultButton = ContentDialogButton.None;

  private _result = ContentDialogResult.None;

  get Result(): ContentDialogResult {
    return this._result;
  }

  set Result(value: ContentDialogResult) {
    this._result = value;
    this.Hide();
  }

  override async ShowAsync() {
    await super.ShowAsync();

    return this._result;
  }
}