import { AfterContentInit, AfterViewInit, Component, Input } from "@angular/core";
import { FlyoutBaseComponent, PopupTemplate } from "../primitives/FlyoutBase";
import { FlyoutPlacementMode } from "../Common";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "../primitives/FlyoutPresenter";
import { ConnectedPosition } from "@angular/cdk/overlay";

@Component({
  selector: 'Flyout',
  imports: [FlyoutPresenter],
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: FlyoutComponent }],
  styles: `FlyoutPresenter { padding: 16px; }`
})
export class FlyoutComponent extends FlyoutBaseComponent {

  protected override get transitionAnimation(): FlyoutPresenterAnimation {
    switch (this.Placement) {
      case "Top":
      case "TopEdgeAlignedLeft":
      case "TopEdgeAlignedRight":
        return 'SlideUp';

      case "Bottom":
      case "BottomEdgeAlignedLeft":
      case "BottomEdgeAlignedRight":
        return 'SlideDown';

      case "Left":
      case "LeftEdgeAlignedTop":
      case "LeftEdgeAlignedBottom":
        return 'SlideLeft';

      case "Right":
      case "RightEdgeAlignedTop":
      case "RightEdgeAlignedBottom":
        return 'SlideRight';

      default:
        return 'Default';
    }
  }
}