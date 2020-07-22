import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoModalComponent } from "./admino-modal/admino-modal.component";
import { PortalModule } from "@angular/cdk/portal";
import { AdminoCardModule } from "../admino-card/admino-card.module";
import { AffirmationModalComponent } from "./modal-types/affirmation-modal/affirmation-modal.component";
import { AdminoModalContainerComponent } from "./admino-modal-container/admino-modal-container.component";

@NgModule({
  declarations: [
    AdminoModalComponent,
    AffirmationModalComponent,
    AdminoModalContainerComponent,
  ],
  imports: [CommonModule, PortalModule, AdminoCardModule],
  exports: [
    AdminoModalComponent,
    AffirmationModalComponent,
    AdminoModalContainerComponent,
  ],
  entryComponents: [AdminoModalComponent, AffirmationModalComponent],
})
export class AdminoModalModule {}
