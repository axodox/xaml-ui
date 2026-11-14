import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBoxComponent } from '../collections/ListBox';

interface IRule { Id: string; Name: string; }

const Fires: IRule[] = [{ Id: 'no-fire', Name: 'No fire' }, { Id: 'observed', Name: 'Observed fire only' }];
const Movement: IRule[] = [{ Id: 'no-entry', Name: 'No entry' }, { Id: 'escort', Name: 'Escorted only' }];

@Component({
  imports: [ListBoxComponent],
  template: `
    <ListBox class="value-first" [SelectedValue]="Rule" [ItemSource]="Rules" DisplayMemberPath="Name" SelectedValuePath="Id" (SelectedValueChange)="Rule = $event" />
    <ListBox class="list-first" [ItemSource]="Rules2" [SelectedValue]="Rule2" DisplayMemberPath="Name" SelectedValuePath="Id" (SelectedValueChange)="Rule2 = $event" />`
})
class Host {
  Rules = Fires;
  Rule: string | null = 'observed';
  Rules2 = Fires;
  Rule2: string | null = 'observed';
}

describe('Selector', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function selected(css: string) {
    return (fixture.nativeElement.querySelector(`${css} [aria-selected="true"]`) as HTMLElement | null)?.textContent?.trim();
  }

  it('keeps the choice when the value is set before its new list', async () => {
    let host = fixture.componentInstance;
    host.Rules = Movement;
    host.Rule = 'escort';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.Rule).toBe('escort');
    expect(selected('.value-first')).toBe('Escorted only');
  });

  it('keeps the choice when the list is set before the value meant for it', async () => {
    let host = fixture.componentInstance;
    host.Rules2 = Movement;
    host.Rule2 = 'no-entry';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.Rule2).toBe('no-entry');
    expect(selected('.list-first')).toBe('No entry');
  });

  it('keeps the choice when the new list has it', async () => {
    let host = fixture.componentInstance;
    host.Rules = [...Fires, ...Movement];
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.Rule).toBe('observed');
  });

  it('clears the choice when the new list lacks it and no value comes', async () => {
    let host = fixture.componentInstance;
    host.Rules = Movement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.Rule).toBeNull();
    expect(selected('.value-first')).toBeUndefined();
  });

  it('clears the choice when the value is not in the list', async () => {
    let host = fixture.componentInstance;
    host.Rule = 'unknown';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.Rule).toBeNull();
  });

  it('is one tab stop whose arrow keys move the focus and the selection', () => {
    let rows = Array.from(fixture.nativeElement.querySelectorAll('.value-first [role="option"]')) as HTMLElement[];
    expect(rows.map(p => p.getAttribute('tabindex'))).toEqual(['-1', '0']);

    rows[1].focus();
    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.Rule).toBe('no-fire');
    expect(document.activeElement).toBe(rows[0]);
  });
});
