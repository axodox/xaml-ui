import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent, TreeViewSelectionMode } from './TreeView';

interface INode {
  Name: string;
  Children?: INode[];
}

@Component({
  imports: [TreeViewComponent],
  template: `<TreeView [ItemsSource]="Nodes" DisplayMemberPath="Name" [SelectionMode]="Mode"
    [(SelectedItem)]="Selected" [(SelectedItems)]="SelectedItems" [(ExpandedItems)]="Expanded"
    (ItemInvoked)="Invoked = $event" (Expanding)="Events.push('Expanding ' + $event.Name)" (Collapsed)="Events.push('Collapsed ' + $event.Name)" />`
})
class Host {
  Leaf1: INode = { Name: 'Leaf 1' };
  Leaf2: INode = { Name: 'Leaf 2' };
  Branch: INode = { Name: 'Branch', Children: [this.Leaf1, this.Leaf2] };
  Root: INode = { Name: 'Root', Children: [this.Branch, { Name: 'Leaf 3' }] };
  Other: INode = { Name: 'Other' };
  Nodes: INode[] = [this.Root, this.Other];

  Mode: TreeViewSelectionMode = 'Single';
  Selected: INode | null = null;
  SelectedItems: INode[] = [];
  Expanded: INode[] = [];
  Invoked?: INode;
  Events: string[] = [];
}

describe('TreeView', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  let rows = () => Array.from(fixture.nativeElement.querySelectorAll('[role="treeitem"]')) as HTMLElement[];
  let row = (name: string) => rows().find(p => p.querySelector(':scope > .row .item-content')?.textContent?.trim() === name)!;
  let key = (key: string) => {
    let target = document.activeElement as HTMLElement;
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };
  let focused = () => (document.activeElement as HTMLElement).querySelector(':scope > .row .item-content')?.textContent?.trim();

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is a tree of treeitems with levels, expanded states and groups', () => {
    expect(fixture.nativeElement.querySelector('[role="tree"]')).not.toBeNull();
    expect(rows().length).toBe(2);
    expect(row('Root').getAttribute('aria-level')).toBe('1');
    expect(row('Root').getAttribute('aria-expanded')).toBe('false');
    expect(row('Other').hasAttribute('aria-expanded')).toBeFalse();

    host.Expanded = [host.Root];
    fixture.detectChanges();
    expect(row('Root').getAttribute('aria-expanded')).toBe('true');
    expect(row('Root').querySelector(':scope > [role="group"]')).not.toBeNull();
    expect(row('Branch').getAttribute('aria-level')).toBe('2');
  });

  it('is one tab stop (roving tabindex)', () => {
    expect(rows().map(p => p.tabIndex)).toEqual([0, -1]);
  });

  it('selects on click in Single mode and reports the invoked item', () => {
    (row('Other').querySelector('.row') as HTMLElement).click();
    fixture.detectChanges();
    expect(host.Selected).toBe(host.Other);
    expect(host.Invoked).toBe(host.Other);
    expect(row('Other').getAttribute('aria-selected')).toBe('true');
    expect(row('Root').getAttribute('aria-selected')).toBe('false');
  });

  it('expands and collapses from its chevron, raising Expanding and Collapsed', () => {
    let chevron = () => row('Root').querySelector('.chevron') as HTMLElement;
    chevron().click();
    fixture.detectChanges();
    expect(host.Expanded).toEqual([host.Root]);
    expect(rows().length).toBe(4);
    chevron().click();
    fixture.detectChanges();
    expect(host.Expanded).toEqual([]);
    expect(host.Events).toEqual(['Expanding Root', 'Collapsed Root']);
    expect(host.Selected).toBeNull();
  });

  it('follows WinUI keyboard navigation', () => {
    rows()[0].focus();
    key('ArrowRight');
    expect(host.Expanded).toEqual([host.Root]);
    expect(focused()).toBe('Root');
    key('ArrowRight');
    expect(focused()).toBe('Branch');
    key('ArrowRight');
    key('ArrowRight');
    expect(focused()).toBe('Leaf 1');
    key('ArrowDown');
    expect(focused()).toBe('Leaf 2');
    key(' ');
    expect(host.Selected).toBe(host.Leaf2);
    key('Enter');
    expect(host.Invoked).toBe(host.Leaf2);
    key('ArrowLeft');
    expect(focused()).toBe('Branch');
    key('ArrowLeft');
    expect(host.Expanded).toEqual([host.Root]);
    key('End');
    expect(focused()).toBe('Other');
    key('Home');
    expect(focused()).toBe('Root');
    key('ArrowUp');
    expect(focused()).toBe('Root');
    expect(rows().filter(p => p.tabIndex === 0).length).toBe(1);
  });

  it('checks subtrees in Multiple mode, with partly checked parents', () => {
    host.Mode = 'Multiple';
    host.Expanded = [host.Root, host.Branch];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="tree"]').getAttribute('aria-multiselectable')).toBe('true');
    expect(row('Leaf 1').querySelector('CheckBox')).not.toBeNull();

    //A leaf: its parents are partly checked
    (row('Leaf 1').querySelector('.row') as HTMLElement).click();
    fixture.detectChanges();
    expect(host.SelectedItems).toEqual([host.Leaf1]);
    expect(row('Leaf 1').getAttribute('aria-checked')).toBe('true');
    expect(row('Branch').getAttribute('aria-checked')).toBe('mixed');
    expect(row('Root').getAttribute('aria-checked')).toBe('mixed');
    expect((row('Branch').querySelector(':scope > .row input') as HTMLInputElement).indeterminate).toBeTrue();

    //The other leaf completes its parent
    row('Leaf 2').focus();
    key(' ');
    expect(host.SelectedItems).toEqual([host.Branch, host.Leaf1, host.Leaf2]);
    expect(row('Branch').getAttribute('aria-checked')).toBe('true');

    //A partly checked parent checks its whole subtree
    (row('Root').querySelector('.row') as HTMLElement).click();
    fixture.detectChanges();
    expect(row('Root').getAttribute('aria-checked')).toBe('true');
    expect(host.SelectedItems.length).toBe(5);
    expect(row('Other').getAttribute('aria-checked')).toBe('false');

    //Unchecking a node clears its subtree and its parents
    (row('Branch').querySelector('.row') as HTMLElement).click();
    fixture.detectChanges();
    expect(host.SelectedItems.map(p => p.Name)).toEqual(['Leaf 3']);
    expect(row('Root').getAttribute('aria-checked')).toBe('mixed');
    expect(row('Leaf 1').getAttribute('aria-checked')).toBe('false');
  });

  it('expands from ExpandedItems set by its owner, without raising Expanding', () => {
    host.Expanded = [host.Root, host.Branch];
    fixture.detectChanges();
    expect(rows().map(p => p.querySelector(':scope > .row .item-content')?.textContent?.trim())).toEqual(['Root', 'Branch', 'Leaf 1', 'Leaf 2', 'Leaf 3', 'Other']);
    expect(host.Events).toEqual([]);
  });
});
