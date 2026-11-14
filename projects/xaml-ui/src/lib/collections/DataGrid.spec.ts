import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataGridComponents, DataGridGridLinesVisibility, DataGridHeadersVisibility } from './DataGrid';

interface IRow {
  Name: string;
  Detail: { Phase: string };
  Strength: number;
}

@Component({
  imports: [DataGridComponents],
  template: `<DataGrid Width="300px" [ItemsSource]="Rows" [HeadersVisibility]="Headers" [GridLinesVisibility]="Lines" [FrozenColumnCount]="1"
      [(SelectedIndex)]="Index" [(SelectedItem)]="Item">
      <DataGridTextColumn Header="Name" Binding="Name" Width="150px" />
      <DataGridTextColumn Header="Phase" Binding="Detail.Phase" Width="Auto" TextWrapping="Wrap" />
      <DataGridTemplateColumn Width="200px">
        <ng-template DataGridColumnHeader><b class="rich">Strength</b></ng-template>
        <ng-template let-item><i class="strength">{{ item.Strength }}</i></ng-template>
      </DataGridTemplateColumn>
    </DataGrid>`
})
class Host {
  Rows: IRow[] = [
    { Name: 'Alpha', Detail: { Phase: 'One' }, Strength: 10 },
    { Name: 'Bravo', Detail: { Phase: 'Two' }, Strength: 20 },
    { Name: 'Charlie', Detail: { Phase: 'Three' }, Strength: 30 }
  ];
  Headers: DataGridHeadersVisibility = 'Column';
  Lines: DataGridGridLinesVisibility = 'All';
  Index = -1;
  Item: IRow | null = null;
}

describe('DataGrid', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  let grid = () => fixture.nativeElement.querySelector('[role="grid"]') as HTMLElement;
  let itemRows = () => Array.from(fixture.nativeElement.querySelectorAll('.item-row')) as HTMLElement[];
  let key = (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is a grid of rows, column headers and cells with their counts', () => {
    expect(grid().getAttribute('aria-rowcount')).toBe('4');
    expect(grid().getAttribute('aria-colcount')).toBe('3');
    let headers = Array.from(grid().querySelectorAll('[role="columnheader"]')) as HTMLElement[];
    expect(headers.map(p => p.textContent?.trim())).toEqual(['Name', 'Phase', 'Strength']);
    expect(headers[2].querySelector('.rich')).not.toBeNull();
    expect(itemRows().length).toBe(3);
    expect(itemRows()[0].getAttribute('role')).toBe('row');
    expect(itemRows()[0].getAttribute('aria-rowindex')).toBe('2');
    let cells = Array.from(itemRows()[1].querySelectorAll('[role="gridcell"]')) as HTMLElement[];
    expect(cells.map(p => p.textContent?.trim())).toEqual(['Bravo', 'Two', '20']);
    expect(cells[2].querySelector('.strength')).not.toBeNull();
  });

  it('lines the rows up in one grid of the column widths', () => {
    expect(grid().style.gridTemplateColumns).toBe('150px max-content 200px');
    let first = itemRows()[0].querySelectorAll('[role="gridcell"]')[2].getBoundingClientRect();
    let header = grid().querySelectorAll('[role="columnheader"]')[2].getBoundingClientRect();
    expect(first.left).toBe(header.left);
    expect(first.width).toBe(200);
  });

  it('hides the header row when HeadersVisibility is None', () => {
    host.Headers = 'None';
    fixture.detectChanges();
    expect(grid().querySelector('[role="columnheader"]')).toBeNull();
    expect(grid().getAttribute('aria-rowcount')).toBe('3');
  });

  it('selects a row on click, both ways', () => {
    itemRows()[1].click();
    fixture.detectChanges();
    expect(host.Index).toBe(1);
    expect(host.Item).toBe(host.Rows[1]);
    expect(itemRows().map(p => p.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);

    host.Index = 2;
    fixture.detectChanges();
    expect(host.Item).toBe(host.Rows[2]);
    expect(itemRows()[2].classList).toContain('selected');
  });

  it('moves the selection with the arrow keys, keeping one tab stop', () => {
    expect(itemRows().map(p => p.tabIndex)).toEqual([0, -1, -1]);
    itemRows()[0].focus();
    key(itemRows()[0], 'ArrowDown');
    expect(host.Index).toBe(0);
    key(itemRows()[0], 'ArrowDown');
    expect(host.Index).toBe(1);
    expect(document.activeElement).toBe(itemRows()[1]);
    key(itemRows()[1], 'End');
    expect(host.Index).toBe(2);
    key(itemRows()[2], 'ArrowDown');
    expect(host.Index).toBe(2);
    key(itemRows()[2], 'ArrowUp');
    expect(host.Index).toBe(1);
    expect(itemRows().map(p => p.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('deselects an item which leaves the list', () => {
    host.Index = 1;
    fixture.detectChanges();
    host.Rows = [host.Rows[0], host.Rows[2]];
    fixture.detectChanges();
    expect(host.Item).toBeNull();
    expect(host.Index).toBe(-1);
  });

  it('draws the grid lines asked for and freezes the first column', () => {
    let host = fixture.nativeElement.querySelector('DataGrid') as HTMLElement;
    expect(host.classList).toContain('horizontal-lines');
    expect(host.classList).toContain('vertical-lines');
    let firstCell = itemRows()[0].querySelector('[role="gridcell"]') as HTMLElement;
    expect(firstCell.classList).toContain('frozen');
    expect(getComputedStyle(firstCell).position).toBe('sticky');
  });

  it('wraps text only in a column which asks for it', () => {
    let cells = itemRows()[0].querySelectorAll('[role="gridcell"]');
    expect(getComputedStyle(cells[0].querySelector('.cell-text')!).whiteSpace).toBe('nowrap');
    expect(getComputedStyle(cells[1].querySelector('.cell-text')!).whiteSpace).not.toBe('nowrap');
  });
});
