import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoBadgeComponent } from './InfoBadge';

@Component({
  imports: [InfoBadgeComponent],
  template: `<InfoBadge id="value" [Value]="Value" [Icon]="Icon" />
    <InfoBadge id="styled" Class="CriticalIconInfoBadgeStyle" />
    <InfoBadge id="labelled" [Value]="3" aria-label="3 new alerts" />`
})
class Host {
  Value = 5;
  Icon?: string = undefined;
}

describe('InfoBadge', () => {
  let fixture: ComponentFixture<Host>;
  let badge: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    badge = fixture.nativeElement.querySelector('#value');
  });

  it('shows its value when it is 0 or more', () => {
    expect(badge.textContent?.trim()).toBe('5');
    expect(badge.classList).toContain('value-badge');
    fixture.componentInstance.Value = 0;
    fixture.detectChanges();
    expect(badge.textContent?.trim()).toBe('0');
  });

  it('shows its icon, hidden from assistive technology, when there is no value', () => {
    fixture.componentInstance.Value = -1;
    fixture.componentInstance.Icon = '\uE7BA';
    fixture.detectChanges();
    let glyph = badge.querySelector('.glyph') as HTMLElement;
    expect(glyph.textContent).toBe('\uE7BA');
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
    expect(badge.classList).toContain('icon-badge');
  });

  it('is a dot with neither', () => {
    fixture.componentInstance.Value = -1;
    fixture.detectChanges();
    expect(badge.textContent?.trim()).toBe('');
    expect(badge.classList).toContain('dot-badge');
    expect(badge.getBoundingClientRect().width).toBeLessThan(10);
  });

  it('is 16px high with a value', () => {
    expect(badge.getBoundingClientRect().height).toBe(16);
    expect(badge.getBoundingClientRect().width).toBeGreaterThanOrEqual(16);
  });

  it('takes the icon of a WinUI icon style when it has none of its own', () => {
    let styled = fixture.nativeElement.querySelector('#styled') as HTMLElement;
    expect(styled.querySelector('.glyph')?.textContent).toBe('\uE711');
  });

  it('has no name or role unless the owner gives it a label', () => {
    expect(badge.hasAttribute('aria-label')).toBeFalse();
    expect(badge.hasAttribute('role')).toBeFalse();
    let labelled = fixture.nativeElement.querySelector('#labelled') as HTMLElement;
    expect(labelled.getAttribute('aria-label')).toBe('3 new alerts');
    expect(labelled.getAttribute('role')).toBe('img');
  });
});
