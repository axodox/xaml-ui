import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboBoxComponent } from './ComboBox';

interface IRule { Id: string; Name: string; }

const Fires: IRule[] = [{ Id: 'no-fire', Name: 'No fire' }, { Id: 'observed', Name: 'Observed fire only' }];
const Movement: IRule[] = [{ Id: 'no-entry', Name: 'No entry' }, { Id: 'escort', Name: 'Escorted only' }];

@Component({
  imports: [ComboBoxComponent],
  template: `<ComboBox [SelectedValue]="Rule" [ItemSource]="Rules" DisplayMemberPath="Name" SelectedValuePath="Id" (SelectedValueChange)="Rule = $event" />`
})
class Host {
  Rules = Fires;
  Rule: string | null = 'observed';
}

const wait = (ms: number) => new Promise(p => setTimeout(p, ms));

describe('ComboBox', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function shown() {
    return (fixture.nativeElement.querySelector('ComboBox ItemContainer') as HTMLElement).textContent?.trim();
  }

  async function change(rules: IRule[], rule: string) {
    fixture.componentInstance.Rules = rules;
    fixture.componentInstance.Rule = rule;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('keeps its choice when its list and value change together, also after a choice in its list', async () => {
    //Choose in the list: the current item, so the index the box gives its list stays the same afterwards
    (fixture.nativeElement.querySelector('ComboBox DropDownButton') as HTMLElement).click();
    await wait(50);
    fixture.detectChanges();
    (document.querySelectorAll('FlyoutPresenter.visible [role="option"]')[1] as HTMLElement).click();
    fixture.detectChanges();
    await wait(300);

    await change(Movement, 'escort');
    expect(shown()).toBe('Escorted only');
    await change(Fires, 'observed');
    expect(shown()).toBe('Observed fire only');
    expect(fixture.componentInstance.Rule).toBe('observed');
  });
});
