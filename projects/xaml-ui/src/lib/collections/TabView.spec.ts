import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewComponent, TabViewItemComponent, TabViewTabCloseRequestedEventArgs, TabViewWidthMode } from './TabView';

@Component({
  imports: [TabViewComponent, TabViewItemComponent],
  template: `<TabView [(SelectedIndex)]="Index" [TabWidthMode]="Mode" [IsAddTabButtonVisible]="true"
      (AddTabButtonClick)="Added = Added + 1" (TabCloseRequested)="Closed = $event">
      <button TabStripFooter id="footer">Footer</button>
      <TabViewItem Header="One" Icon="&#xE716;" [IsClosable]="false"><input id="input-one"></TabViewItem>
      @for (name of Names; track name) {
        <TabViewItem [Header]="name" Icon="&#xE8A5;">{{name}} content</TabViewItem>
      }
    </TabView>`
})
class Host {
  Index = 0;
  Mode: TabViewWidthMode = 'Equal';
  Names = ['Two', 'Three'];
  Added = 0;
  Closed?: TabViewTabCloseRequestedEventArgs;
}

describe('TabView', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  let closed = () => host.Closed;
  let tabs = () => Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];
  let panels = () => Array.from(fixture.nativeElement.querySelectorAll('[role="tabpanel"]')) as HTMLElement[];
  let key = (target: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('has a tablist of tabs tied to their panels', () => {
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).not.toBeNull();
    expect(tabs().length).toBe(3);
    tabs().forEach((tab, index) => {
      let panel = panels()[index];
      expect(tab.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    });
    expect(tabs().map(p => p.querySelector('.tab-header')?.textContent?.trim())).toEqual(['One', 'Two', 'Three']);
  });

  it('shows only the selected panel, keeping the others in the page', () => {
    expect(panels().map(p => p.hidden)).toEqual([false, true, true]);
    tabs()[2].click();
    fixture.detectChanges();
    expect(host.Index).toBe(2);
    expect(panels().map(p => p.hidden)).toEqual([true, true, false]);
    expect(tabs().map(p => p.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
  });

  it('keeps the state of a hidden panel', () => {
    let input = fixture.nativeElement.querySelector('#input-one') as HTMLInputElement;
    input.value = 'typed';
    host.Index = 1;
    fixture.detectChanges();
    host.Index = 0;
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('#input-one') as HTMLInputElement).value).toBe('typed');
  });

  it('is one tab stop, with the selected tab in the tab order', () => {
    host.Index = 1;
    fixture.detectChanges();
    expect(tabs().map(p => p.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('moves the focus and the selection with the arrow keys, Home and End', () => {
    tabs()[0].focus();
    key(tabs()[0], 'ArrowRight');
    expect(host.Index).toBe(1);
    expect(document.activeElement).toBe(tabs()[1]);
    key(tabs()[1], 'End');
    expect(host.Index).toBe(2);
    key(tabs()[2], 'ArrowRight');
    expect(host.Index).toBe(0);
    key(tabs()[0], 'ArrowLeft');
    expect(host.Index).toBe(2);
    key(tabs()[2], 'Home');
    expect(host.Index).toBe(0);
    expect(document.activeElement).toBe(tabs()[0]);
  });

  it('asks to close a closable tab with its button, Delete or Ctrl+F4', () => {
    key(tabs()[0], 'Delete');
    expect(closed()).toBeUndefined();

    key(tabs()[1], 'Delete');
    expect(closed()?.Index).toBe(1);
    expect(closed()?.Tab.Header).toBe('Two');

    host.Closed = undefined;
    key(tabs()[2], 'F4', { ctrlKey: true });
    expect(closed()?.Index).toBe(2);

    host.Closed = undefined;
    (tabs()[1].querySelector('.close-button') as HTMLElement).click();
    fixture.detectChanges();
    expect(closed()?.Index).toBe(1);
    expect(host.Index).toBe(0);
  });

  it('keeps a tab selected when the selected tab goes', async () => {
    host.Index = 2;
    fixture.detectChanges();
    host.Names = ['Two'];
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.Index).toBe(1);
    expect(panels().map(p => p.hidden)).toEqual([true, false]);
  });

  it('raises AddTabButtonClick from its add button', () => {
    (fixture.nativeElement.querySelector('.add-button') as HTMLButtonElement).click();
    expect(host.Added).toBe(1);
  });

  it('projects strip footer content', () => {
    expect(fixture.nativeElement.querySelector('.strip-footer #footer')).not.toBeNull();
  });

  it('shows only the icon of the unselected tabs in Compact mode, keeping their name', () => {
    host.Mode = 'Compact';
    fixture.detectChanges();
    let header = (index: number) => tabs()[index].querySelector('.tab-header') as HTMLElement;
    expect(header(0).getBoundingClientRect().width).toBeGreaterThan(1);
    expect(header(1).getBoundingClientRect().width).toBeLessThanOrEqual(1);
    expect(header(1).textContent).toBe('Two');
    expect(tabs()[1].getAttribute('title')).toBe('Two');
  });
});
