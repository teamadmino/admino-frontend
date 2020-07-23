import { AdminoResizeModule } from "./../../directives/admino-resize/admino-resize.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoTableComponent } from "./admino-table/admino-table.component";
import { AdminoTooltipModule } from "../admino-tooltip/admino-tooltip.module";
import { MaterialModulesModule } from "../material-modules/material-modules.module";

@NgModule({
  declarations: [AdminoTableComponent],
  imports: [CommonModule, MaterialModulesModule, AdminoTooltipModule, AdminoResizeModule],
  exports: [AdminoTableComponent],
})
export class AdminoTableModule {}
