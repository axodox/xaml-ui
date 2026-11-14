import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckBoxComponent } from './CheckBox';
import { ToggleSwitchComponent } from './ToggleSwitch';

@Component({
  imports: [CheckBoxComponent, ToggleSwitchComponent],
  template: `<CheckBox [(IsChecked)]="Checked" [IsThreeState]="ThreeState">Label</CheckBox>
    <ToggleSwitch [(IsChecked)]="Switched">Switch</ToggleSwitch>`
})
class Host {
  Checked: boolean | null = false;
  ThreeState = false;
  Switched = false;
}

describe('CheckBox', () => {
  let fixture: ComponentFixture<Host>;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('CheckBox input');
  });

  it('keeps its native input focusable, named by its content', () => {
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(getComputedStyle(input).display).not.toBe('none');
    expect(input.closest('label')?.textContent?.trim()).toBe('Label');
  });

  it('does not put its glyph into its text', () => {
    fixture.componentInstance.Checked = true;
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('CheckBox') as HTMLElement).textContent?.trim()).toBe('Label');
  });

  it('toggles from its input (a click or Space)', () => {
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Checked).toBeTrue();
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Checked).toBeFalse();
  });

  it('cycles unchecked, checked, indeterminate when three-state', () => {
    fixture.componentInstance.ThreeState = true;
    fixture.detectChanges();
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Checked).toBeTrue();
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Checked).toBeNull();
    expect(input.indeterminate).toBeTrue();
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Checked).toBeFalse();
    expect(input.indeterminate).toBeFalse();
  });

  it('shows indeterminate when set to null, and a click unchecks it (WinUI)', () => {
    fixture.componentInstance.Checked = null;
    fixture.detectChanges();
    expect(input.indeterminate).toBeTrue();
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Checked).toBeFalse();
  });

  it('gives ToggleSwitch the switch role', () => {
    let toggle = fixture.nativeElement.querySelector('ToggleSwitch input') as HTMLInputElement;
    expect(toggle.getAttribute('role')).toBe('switch');
    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.Switched).toBeTrue();
  });
});
