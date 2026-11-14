import { Component, HostBinding, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemContainerComponent } from "../primitives/ItemContainer";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { trigger, transition, animate, keyframes, style } from "@angular/animations";
import { ScrollViewerComponent } from "../scrolling/ScrollViewer";
import { GridModule } from "../layout/Grid";
import { Orientation } from "../Common";

@Component({
  selector: 'GridView',
  imports: [CommonModule, ScrollViewerComponent, GridModule, ItemContainerComponent],
  template: `<ScrollViewer>
    <Grid [Orientation]="Orientation" [ColumnDefinitions]="columnDefinitions" [RowDefinitions]="rowDefinitions" RowSpacing="3px" ColumnSpacing="3px">
      <ItemContainer #container *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" (click)="onItemClick($event, index, item)" role="option" [attr.tabindex]="getItemTabIndex(index)" [attr.aria-selected]="index == SelectedIndex" (focus)="onItemFocus(index)" (keydown)="onItemKeyDown($event, index, item)" [ngClass]="{'selected': index == SelectedIndex}" [id]="'xaml-selector-'+_id+'-item-'+index" @itemFading>
        <div class="item-content" [ngStyle]="{'align-content': alignContent, 'justify-content': justifyContent}">${SelectorItemTemplate}</div>
        <div class="selection-indicator" *ngIf="index == SelectedIndex"></div>
      </ItemContainer>
    </Grid>
  </ScrollViewer>`,
  animations: [
    trigger('itemFading', [
      transition(':enter', [animate(
        '500ms ease-in',
        keyframes([
          style({ opacity: 0, height: 0 }),
          style({ opacity: 0, height: '*' }),
          style({ opacity: 1, height: '*' }),
        ]),
      )]),
      transition(':leave', [animate(
        '500ms ease-out',
        keyframes([
          style({ opacity: 1, height: '*' }),
          style({ opacity: 0, height: '*' }),
          style({ opacity: 0, height: 0 }),
        ]),
      )]),
    ])
  ],
  styleUrl: 'GridView.scss',
  host: { 'role': 'listbox' }
})
export class GridViewComponent extends SelectorComponent {
  @Input() MaximumRowsOrColumns: number = 2;
  @Input() Orientation: Orientation = "Horizontal";

  protected get columnDefinitions() {
    return this.Orientation == "Horizontal" ? `repeat(${this.MaximumRowsOrColumns}, 1fr)` : undefined;
  }

  protected get rowDefinitions() {
    return this.Orientation == "Vertical" ? `repeat(${this.MaximumRowsOrColumns}, 1fr)` : undefined;
  }
}
