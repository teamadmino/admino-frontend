import { MaterialModulesModule } from "./../material-modules/material-modules.module";
import { AdminoScreenModule } from "./../admino-screen/admino-screen.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoUniversalEditorComponent } from "./admino-universal-editor/admino-universal-editor.component";
import { AdminoUniversalEditorPopupComponent } from "./admino-universal-editor-popup/admino-universal-editor-popup.component";

@NgModule({
  declarations: [AdminoUniversalEditorComponent, AdminoUniversalEditorPopupComponent],
  imports: [CommonModule, AdminoScreenModule, MaterialModulesModule],
  exports: [AdminoUniversalEditorComponent],
  entryComponents: [AdminoUniversalEditorPopupComponent],
})
export class AdminoUniversalEditorModule {}
