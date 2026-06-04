import { Component } from "@angular/core";
import { FlyoutBaseComponent, PopupTemplate } from "../primitives/FlyoutBase";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "../primitives/FlyoutPresenter";
import { XamlRootComponent } from "../XamlRoot";

@Component({
  selector: 'Flyout',
  imports: [FlyoutPresenter, XamlRootComponent],
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

