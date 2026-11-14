import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../basic-input/Button';
import { SplitButtonComponent } from '../basic-input/SplitButton';
import { FlyoutComponent } from '../dialogs-and-flyouts/Flyout';
import { MenuFlyoutComponent } from './MenuFlyout';
import { MenuFlyoutItemComponent } from './MenuFlyoutItem';
import { MenuFlyoutSeparator } from './MenuFlyoutSeparator';
import { RadioMenuFlyoutItemComponent } from './RadioMenuFlyoutItem';
import { ToggleMenuFlyoutItemComponent } from './ToggleMenuFlyoutItem';

@Component({
  imports: [ButtonComponent, FlyoutComponent, MenuFlyoutComponent, MenuFlyoutItemComponent, MenuFlyoutSeparator, RadioMenuFlyoutItemComponent, ToggleMenuFlyoutItemComponent, SplitButtonComponent],
  template: `
    <Button class="menu-button">Menu
      <MenuFlyout #menu>
        <MenuFlyoutItem Text="Save" KeyboardAcceleratorTextOverride="Ctrl+S" (Click)="Chosen = 'Save'" />
        <MenuFlyoutItem Text="Restore" Note="nothing saved" [IsEnabled]="false" (Click)="Chosen = 'Restore'" />
        <MenuFlyoutSeparator />
        <ToggleMenuFlyoutItem Text="Grid" [(IsChecked)]="Grid" />
        <RadioMenuFlyoutItem GroupName="m" Text="A" [IsChecked]="true" />
        <RadioMenuFlyoutItem GroupName="m" Text="B" />
      </MenuFlyout>
    </Button>
    <Button class="flyout-button">Flyout
      <Flyout #flyout><span class="flyout-content">Content</span></Flyout>
    </Button>
    <SplitButton (DropDownClick)="Arrow = Arrow + 1">Split</SplitButton>
    <XamlButton class="self-closed" Content="Self-closed" (Click)="Chosen = 'XamlButton'" />`
})
class Host {
  Chosen = '';
  Grid = false;
  Arrow = 0;
  @ViewChild('menu') Menu!: MenuFlyoutComponent;
  @ViewChild('flyout') Flyout!: FlyoutComponent;
}

const wait = (ms: number) => new Promise(p => setTimeout(p, ms));

describe('MenuFlyout and Flyout', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  afterEach(async () => {
    fixture.componentInstance.Menu.Hide();
    fixture.componentInstance.Flyout.Hide();
    await wait(300);
  });

  async function openMenu() {
    fixture.componentInstance.Menu.Show();
    fixture.detectChanges();
    await wait(50);
    fixture.detectChanges();
    return document.querySelector('FlyoutPresenter.visible') as HTMLElement;
  }

  function key(target: Element, name: string) {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('has the menu role, items with roles, the accelerator text and the note', async () => {
    let presenter = await openMenu();
    expect(presenter.getAttribute('role')).toBe('menu');
    let roles = Array.from(presenter.querySelectorAll('[role^="menuitem"]')).map(p => p.getAttribute('role'));
    expect(roles).toEqual(['menuitem', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'menuitemradio']);
    expect(presenter.querySelector('.accelerator')?.textContent).toContain('Ctrl+S');
    expect(presenter.textContent).toContain('nothing saved');
  });

  it('stays open on a click on a disabled item or a separator, closes on an enabled one', async () => {
    let presenter = await openMenu();
    (presenter.querySelector('MenuFlyoutItem[aria-disabled="true"]') as HTMLElement).click();
    (presenter.querySelector('MenuFlyoutSeparator') as HTMLElement).click();
    expect(fixture.componentInstance.Menu.IsOpen).toBeTrue();
    expect(fixture.componentInstance.Chosen).toBe('');

    (presenter.querySelector('MenuFlyoutItem') as HTMLElement).click();
    expect(fixture.componentInstance.Menu.IsOpen).toBeFalse();
    expect(fixture.componentInstance.Chosen).toBe('Save');
  });

  it('moves with the arrow keys past disabled items, wraps, and chooses with Enter', async () => {
    let presenter = await openMenu();
    key(presenter, 'ArrowDown');
    expect(document.activeElement?.textContent).toContain('Save');
    key(presenter, 'ArrowDown');
    expect(document.activeElement?.textContent).toContain('Grid');
    key(presenter, 'ArrowUp');
    key(presenter, 'ArrowUp');
    expect(document.activeElement?.textContent).toContain('B');
    key(presenter, 'Home');
    key(presenter, 'ArrowDown');
    key(presenter, 'Enter');
    expect(fixture.componentInstance.Grid).toBeTrue();
    expect(fixture.componentInstance.Menu.IsOpen).toBeFalse();
  });

  it('checks one radio item of a group', async () => {
    let presenter = await openMenu();
    let radios = presenter.querySelectorAll('RadioMenuFlyoutItem');
    (radios[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
  });

  it('closes on Esc', async () => {
    let presenter = await openMenu();
    key(presenter, 'Escape');
    expect(fixture.componentInstance.Menu.IsOpen).toBeFalse();
  });

  it('shows one presenter when reopened while it fades out', async () => {
    let flyout = fixture.componentInstance.Flyout;
    flyout.Show();
    await wait(50);
    flyout.Hide();
    flyout.Show();
    await wait(50);
    fixture.detectChanges();
    //The fading presenter and the new one: only the new one is visible
    expect(document.querySelectorAll('FlyoutPresenter').length).toBe(2);
    expect(document.querySelectorAll('FlyoutPresenter.visible').length).toBe(1);
  });

  it('takes the focus and gives it back to its button', async () => {
    let button = fixture.nativeElement.querySelector('.flyout-button') as HTMLElement;
    button.focus();
    button.click();
    await wait(50);
    expect(document.activeElement?.closest('FlyoutPresenter')).not.toBeNull();
    fixture.componentInstance.Flyout.Hide();
    expect(document.activeElement).toBe(button);
  });

  it('raises the split button arrow event without a flyout, and the arrow is a named tab stop', () => {
    let arrow = fixture.nativeElement.querySelector('SplitButton DropDownButton') as HTMLElement;
    expect(arrow.getAttribute('tabindex')).toBe('0');
    expect(arrow.getAttribute('aria-label')).toBe('More options');
    arrow.click();
    expect(fixture.componentInstance.Arrow).toBe(1);
  });

  it('clicks a self-closed XamlButton with Enter', () => {
    let button = fixture.nativeElement.querySelector('.self-closed') as HTMLElement;
    expect(button.getAttribute('role')).toBe('button');
    expect(button.getAttribute('tabindex')).toBe('0');
    button.focus();
    key(button, 'Enter');
    expect(fixture.componentInstance.Chosen).toBe('XamlButton');
  });
});
