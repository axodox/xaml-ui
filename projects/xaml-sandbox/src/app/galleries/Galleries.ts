import { Type } from '@angular/core';
import { OverviewGallery } from './OverviewGallery';
import { FocusGallery } from './FocusGallery';
import { FlyoutGallery } from './FlyoutGallery';
import { MenuFlyoutGallery } from './MenuFlyoutGallery';
import { InputGallery } from './InputGallery';
import { StatusGallery } from './StatusGallery';
import { InfoBadgeGallery } from './InfoBadgeGallery';
import { TabViewGallery } from './TabViewGallery';
import { TreeViewGallery } from './TreeViewGallery';
import { DataGridGallery } from './DataGridGallery';

export interface IGallery {
  Name: string;
  Component: Type<unknown>;
}

/** Every gallery of the sandbox, in the order of the list. */
export const Galleries: IGallery[] = [
  { Name: 'Overview', Component: OverviewGallery },
  { Name: 'Focus', Component: FocusGallery },
  { Name: 'Flyout', Component: FlyoutGallery },
  { Name: 'MenuFlyout', Component: MenuFlyoutGallery },
  { Name: 'Input', Component: InputGallery },
  { Name: 'Status', Component: StatusGallery },
  { Name: 'InfoBadge', Component: InfoBadgeGallery },
  { Name: 'TabView', Component: TabViewGallery },
  { Name: 'TreeView', Component: TreeViewGallery },
  { Name: 'DataGrid', Component: DataGridGallery },
];
