import { Component, HostListener, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'XamlRoot',
  template: `<ng-content/>`,
  styleUrl: 'XamlRoot.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'xaml-themed'
  }
})
export class XamlRootComponent {

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }

}
