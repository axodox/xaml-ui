import { Component, HostListener } from "@angular/core";

@Component({
  selector: 'XamlRoot',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;    
    overflow: hidden;
    user-select: none; 
    background-color: #f3f3f3;
    touch-action: none;

    &::ng-deep * {
      user-select: none;
      touch-action: none;      
    }

    @media (prefers-color-scheme: dark) {
      background-color: #202020;
    }
  }`
})
export class XamlRootComponent {

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }

}