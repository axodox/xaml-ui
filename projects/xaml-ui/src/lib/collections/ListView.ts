import { Component, Injector, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { ScrollViewerComponent } from "../scrolling/ScrollViewer";
import { StackPanelComponent } from "../layout/StackPanel";
import { animate, keyframes, style, transition, trigger } from "@angular/animations";
import { ItemContainerComponent } from "../primitives/ItemContainer";

@Component({
  selector: 'ListView',
  imports: [CommonModule, ScrollViewerComponent, StackPanelComponent, ItemContainerComponent],
  template: `<ScrollViewer>
    <StackPanel Padding="2px 0">
      <ItemContainer #container *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" [ngClass]="{'selected': index == SelectedIndex, 'highlighted': index == HighlightedIndex}" (click)="onItemClick($event, index, item)" [id]="'xaml-selector-'+_id+'-item-'+index" @itemFading>
        <div class="item-selector"></div>
        <div class="item-content" [ngStyle]="{'align-content': alignContent, 'justify-content': justifyContent}">${SelectorItemTemplate}</div>
      </ItemContainer>
    </StackPanel>
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
  styleUrl: 'ListView.scss'
})
export class ListViewComponent extends SelectorComponent {
  /**
   * Index of the item shown with a hover-like highlight without being selected —
   * used for keyboard type-ahead, where a match is previewed but only committed
   * on confirm. -1 means no highlight.
   */
  @Input() HighlightedIndex: number = -1;
}