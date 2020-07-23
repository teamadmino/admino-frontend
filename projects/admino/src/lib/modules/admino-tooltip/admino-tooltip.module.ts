import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoTooltipComponent } from "./admino-tooltip/admino-tooltip.component";
import { AdminoTooltipContainerComponent } from "./admino-tooltip-container/admino-tooltip-container.component";
import { AdminoTooltipDirective } from "./admino-tooltip.directive";

@NgModule({
  declarations: [AdminoTooltipComponent, AdminoTooltipContainerComponent, AdminoTooltipDirective],
  imports: [CommonModule],
  exports: [AdminoTooltipComponent, AdminoTooltipContainerComponent, AdminoTooltipDirective],
})
export class AdminoTooltipModule {}
