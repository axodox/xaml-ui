import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { ScrollViewerComponent } from "../scrolling/ScrollViewer";
import { StackPanelComponent } from "../layout/StackPanel";
import { animate, keyframes, style, transition, trigger } from "@angular/animations";
import { ItemContainerComponent } from "../primitives/ItemContainer";

const ListViewItemAttributes = `class="item" [ngClass]="{'selected': index == SelectedIndex}" (click)="onItemClick($event, index, item)" role="option" [attr.tabindex]="getItemTabIndex(index)" [attr.aria-selected]="index == SelectedIndex" (focus)="onItemFocus(index)" (keydown)="onItemKeyDown($event, index, item)" [id]="'xaml-selector-'+_id+'-item-'+index"`;

const ListViewItemContent = `<div class="item-selector"></div>
        <div class="item-content" [ngStyle]="{'align-content': alignContent, 'justify-content': justifyContent}">${SelectorItemTemplate}</div>`;

@Component({
  selector: 'ListView',
  imports: [CommonModule, ScrollViewerComponent, StackPanelComponent, ItemContainerComponent],
  template: `<ScrollViewer>
    <StackPanel Padding="2px 0">
      <ng-container *ngIf="IsItemTransitionEnabled">
        <ItemContainer #container *ngFor="let item of ItemSource; index as index; trackBy: getValue" ${ListViewItemAttributes} @itemFading>${ListViewItemContent}</ItemContainer>
      </ng-container>
      <ng-container *ngIf="!IsItemTransitionEnabled">
        <ItemContainer #container *ngFor="let item of ItemSource; index as index; trackBy: getValue" ${ListViewItemAttributes}>${ListViewItemContent}</ItemContainer>
      </ng-container>
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
  styleUrl: 'ListView.scss',
  host: { 'role': 'listbox' }
})
export class ListViewComponent extends SelectorComponent {
  /**
   * Whether rows fade in and out as they are added and removed (WinUI's item container transitions). Off, rows come and
   * go at once: for a list that changes while it is not shown (a ComboBox's), whose queued fades would keep old rows.
   */
  @Input() IsItemTransitionEnabled = true;
}