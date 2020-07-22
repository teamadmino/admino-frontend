import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CoreRoutingModule } from "./core-routing.module";
import { CoreComponent } from "./core.component";
import { AdminoModule } from "admino";

@NgModule({
  declarations: [CoreComponent],
  imports: [CommonModule, CoreRoutingModule, AdminoModule],
})
export class CoreModule {}
