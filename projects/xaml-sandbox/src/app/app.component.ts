import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { GridModule, ListViewComponent, ScrollViewerComponent, XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { Galleries, IGallery } from './galleries/Galleries';

/**
 * The sandbox: a list of galleries on the left, the chosen one on the right. `?gallery=<Name>` in the address opens
 * a gallery directly (used for screenshots and by people checking one control).
 */
@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, GridModule, ListViewComponent, ScrollViewerComponent, NgComponentOutlet],
  template: `<XamlRoot>
    <Grid ColumnDefinitions="200px 1fr" RowDefinitions="minmax(0, 1fr)">
      <ListView [ItemSource]="Galleries" DisplayMemberPath="Name" SelectedValuePath="Name" [SelectedValue]="Selected.Name" (SelectedValueChange)="OnSelect($event)" />
      <ScrollViewer HorizontalScrollMode="Disabled" VerticalScrollMode="Auto">
        <ng-container *ngComponentOutlet="Selected.Component" />
      </ScrollViewer>
    </Grid>
  </XamlRoot>`
})
export class AppComponent {
  protected readonly Galleries = Galleries;
  protected Selected: IGallery;

  constructor() {
    let name = new URLSearchParams(window.location.search).get('gallery');
    this.Selected = Galleries.find(p => p.Name === name) ?? Galleries[0];
  }

  protected OnSelect(name: string) {
    let gallery = Galleries.find(p => p.Name === name);
    if (!gallery || gallery === this.Selected) return;

    this.Selected = gallery;
    let url = new URL(window.location.href);
    url.searchParams.set('gallery', name);
    window.history.replaceState(null, '', url);
  }
}
