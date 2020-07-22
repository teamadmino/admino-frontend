import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoMenuItemComponent } from "./admino-menu/admino-menu-item/admino-menu-item.component";
import { AdminoMenuComponent } from "./admino-menu/admino-menu.component";
import { MaterialModulesModule } from "../material-modules/material-modules.module";

@NgModule({
  declarations: [AdminoMenuItemComponent, AdminoMenuComponent],
  imports: [CommonModule, MaterialModulesModule],
  exports: [AdminoMenuComponent, AdminoMenuItemComponent],
})
export class AdminoMenuModule {}
