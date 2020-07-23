import { AdminoResizeModule } from "./../../directives/admino-resize/admino-resize.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoOldTableComponent } from "./admino-table/admino-table.component";
import { AdminoTooltipModule } from "../admino-tooltip/admino-tooltip.module";
import { MaterialModulesModule } from "../material-modules/material-modules.module";

@NgModule({
  declarations: [AdminoOldTableComponent],
  imports: [CommonModule, MaterialModulesModule, AdminoTooltipModule, AdminoResizeModule],
  exports: [AdminoOldTableComponent],
})
export class AdminoOldTableModule {}
