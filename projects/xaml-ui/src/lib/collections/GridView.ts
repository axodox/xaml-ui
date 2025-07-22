import { Component, HostBinding, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemContainerComponent } from "../primitives/ItemContainer";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { trigger, transition, animate, keyframes, style } from "@angular/animations";

@Component({
  selector: 'GridView',
  imports: [CommonModule, ItemContainerComponent],
  template: `<ItemContainer #container *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" (click)="onItemClick($event, index, item)" [id]="'xaml-selector-'+_id+'-item-'+index" @itemFading>
    <div class="item-content" [ngStyle]="{'align-content': alignContent, 'justify-content': justifyContent}">${SelectorItemTemplate}</div>
    <div class="selection-indicator" *ngIf="index == SelectedIndex"></div>
  </ItemContainer>`,
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
  styleUrl: 'GridView.scss'
})
export class GridView extends SelectorComponent {
  ColumnCount = input.required<number>();

  @HostBinding('style.grid-template-columns')
  get Columns() {
    return `repeat(${this.ColumnCount()}, ${100 / this.ColumnCount()}%)`;
  }
}
