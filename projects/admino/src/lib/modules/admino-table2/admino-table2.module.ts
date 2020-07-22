import { AdminoResizeModule } from "./../../directives/admino-resize/admino-resize.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoTable2Component } from "./admino-table2/admino-table2.component";
import { AdminoTooltipModule } from "../admino-tooltip/admino-tooltip.module";
import { MaterialModulesModule } from "../material-modules/material-modules.module";

@NgModule({
  declarations: [AdminoTable2Component],
  imports: [
    CommonModule,
    MaterialModulesModule,
    AdminoTooltipModule,
    AdminoResizeModule,
  ],
  exports: [AdminoTable2Component],
})
export class AdminoTable2Module {}
