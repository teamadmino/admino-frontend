import { AdminoPreloaderModule } from "./../admino-preloader/admino-preloader.module";
import { AdminoDragModule } from "./../../directives/admino-drag/admino-drag.module";
import { MaterialModulesModule } from "./../material-modules/material-modules.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoGridComponent } from "./admino-grid/admino-grid.component";
import { AdminoGridItemComponent } from "./admino-grid-item/admino-grid-item.component";

@NgModule({
  declarations: [AdminoGridComponent, AdminoGridItemComponent],
  imports: [
    CommonModule,
    MaterialModulesModule,
    AdminoDragModule,
    AdminoPreloaderModule,
  ],
  exports: [AdminoGridComponent, AdminoGridItemComponent],
})
export class AdminoGridModule {}
