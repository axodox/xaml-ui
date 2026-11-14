import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberBoxComponent } from './NumberBox';

@Component({
  imports: [NumberBoxComponent],
  template: `<NumberBox [Minimum]="0" [Maximum]="120" AutomationProperties-Name="Time budget" [(Value)]="Value" />`
})
class Host {
  Value = 15;
}

describe('NumberBox', () => {
  let fixture: ComponentFixture<Host>;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  function commit(text: string) {
    input.value = text;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  it('puts the last value back for text that is not a number (WinUI)', () => {
    commit('abc');
    expect(fixture.componentInstance.Value).toBe(15);
    expect(input.value).toBe('15');

    commit('12abc');
    expect(fixture.componentInstance.Value).toBe(15);
  });

  it('clears the value for empty text', () => {
    commit('');
    expect(fixture.componentInstance.Value).toBeNaN();
  });

  it('reads a decimal comma', () => {
    commit('2,5');
    expect(fixture.componentInstance.Value).toBe(2.5);
  });

  it('clamps and shows the committed value', () => {
    commit('500');
    expect(fixture.componentInstance.Value).toBe(120);
    expect(input.value).toBe('120');
  });

  it('is a named spin button with its range and value', () => {
    expect(input.getAttribute('role')).toBe('spinbutton');
    expect(input.getAttribute('aria-label')).toBe('Time budget');
    expect(input.getAttribute('aria-valuemin')).toBe('0');
    expect(input.getAttribute('aria-valuemax')).toBe('120');
    expect(input.getAttribute('aria-valuenow')).toBe('15');
  });

  it('parses like WinUI', () => {
    expect(NumberBoxComponent.parse(' 42 ')).toBe(42);
    expect(NumberBoxComponent.parse('-1.5')).toBe(-1.5);
    expect(NumberBoxComponent.parse('')).toBeNaN();
    expect(NumberBoxComponent.parse('1,000.5')).toBeUndefined();
    expect(NumberBoxComponent.parse('x')).toBeUndefined();
  });
});
