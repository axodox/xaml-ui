import { Component, Injector } from "@angular/core";
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
      <ItemContainer #container *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" [ngClass]="{'selected': index == SelectedIndex}" (click)="onItemClick($event, index, item)" [id]="'xaml-selector-'+_id+'-item-'+index" @itemFading>
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
}