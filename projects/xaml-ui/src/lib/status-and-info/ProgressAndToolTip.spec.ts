import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenFilePicker } from '../dialogs-and-flyouts/OpenFilePicker';
import { ScrollViewerComponent, ScrollViewerViewChangedEventArgs } from '../scrolling/ScrollViewer';
import { StackPanelComponent } from '../layout/StackPanel';
import { ProgressBarComponent } from './ProgressBar';
import { ProgressRingComponent } from './ProgressRing';
import { ToolTipServiceModule } from './ToolTipService';

@Component({
  imports: [ProgressBarComponent, ProgressRingComponent, ToolTipServiceModule, ScrollViewerComponent, StackPanelComponent],
  template: `
    <ProgressBar [Value]="0.25" />
    <ProgressBar class="busy" [IsIndeterminate]="true" />
    <ProgressRing [Minimum]="0" [Maximum]="100" [Value]="40" />
    <span class="tip" [ToolTipService-ToolTip]="Tip" ToolTipService-Placement="Bottom">Tip</span>
    <ScrollViewer Height="100px" (ViewChanged)="Views.push($event)">
      <StackPanel><div style="height: 1000px">Tall</div></StackPanel>
    </ScrollViewer>`
})
class Host {
  Tip = 'First';
  Views: ScrollViewerViewChangedEventArgs[] = [];
}

const wait = (ms: number) => new Promise(p => setTimeout(p, ms));

describe('Progress, ToolTipService, ScrollViewer, OpenFilePicker', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('gives ProgressBar the progressbar role, its values and a track', () => {
    let bar = fixture.nativeElement.querySelector('ProgressBar') as HTMLElement;
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('1');
    expect(bar.getAttribute('aria-valuenow')).toBe('0.25');
    expect(bar.querySelector('.track')).not.toBeNull();

    let busy = fixture.nativeElement.querySelector('ProgressBar.busy') as HTMLElement;
    expect(busy.getAttribute('aria-valuenow')).toBeNull();
    expect(busy.getAttribute('aria-busy')).toBe('true');
  });

  it('gives ProgressRing the progressbar role, its values and a track ring', () => {
    let ring = fixture.nativeElement.querySelector('ProgressRing') as HTMLElement;
    expect(ring.getAttribute('role')).toBe('progressbar');
    expect(ring.getAttribute('aria-valuenow')).toBe('40');
    expect(ring.querySelector('.progress-ring-track')).not.toBeNull();
  });

  it('shows live tooltip content', async () => {
    let target = fixture.nativeElement.querySelector('.tip') as HTMLElement;
    target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    await wait(500);
    fixture.detectChanges();
    expect(document.querySelector('ToolTip')?.textContent).toContain('First');

    fixture.componentInstance.Tip = 'Second';
    fixture.detectChanges();
    expect(document.querySelector('ToolTip')?.textContent).toContain('Second');

    target.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse' }));
    await wait(250);
  });

  it('shows no tooltip on touch hover', async () => {
    let target = fixture.nativeElement.querySelector('.tip') as HTMLElement;
    target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' }));
    await wait(500);
    expect(document.querySelector('ToolTip')).toBeNull();
  });

  it('raises ViewChanged while scrolling and at rest', async () => {
    let content = fixture.nativeElement.querySelector('ScrollViewer .content') as HTMLElement;
    content.scrollTop = 200;
    content.dispatchEvent(new Event('scroll'));
    await wait(250);
    let views = fixture.componentInstance.Views;
    expect(views.some(p => p.IsIntermediate && p.VerticalOffset === 200)).toBeTrue();
    expect(views[views.length - 1].IsIntermediate).toBeFalse();
  });

  it('accepts the extensions in the file input fallback', () => {
    let accept = OpenFilePicker.ToAcceptAttribute([{ description: 'GeoJSON', accept: { 'application/geo+json': ['.geojson', '.json'] } }]);
    expect(accept).toBe('application/geo+json,.geojson,.json');
  });
});
