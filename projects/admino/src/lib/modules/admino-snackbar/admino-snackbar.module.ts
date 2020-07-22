import { MaterialModulesModule } from "./../material-modules/material-modules.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoSnackbarContainerComponent } from "./admino-snackbar-container/admino-snackbar-container.component";
import { AdminoSnackbarComponent } from "./admino-snackbar-container/admino-snackbar/admino-snackbar.component";
import { AdminoScreenModule } from "../admino-screen/admino-screen.module";

@NgModule({
  declarations: [AdminoSnackbarComponent, AdminoSnackbarContainerComponent],
  imports: [CommonModule, AdminoScreenModule, MaterialModulesModule],
  exports: [AdminoSnackbarComponent, AdminoSnackbarContainerComponent],
})
export class AdminoSnackbarModule {}
