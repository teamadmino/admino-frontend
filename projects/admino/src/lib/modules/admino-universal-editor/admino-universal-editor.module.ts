import { AdminoScreenModule } from './../admino-screen/admino-screen.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoUniversalEditorComponent } from './admino-universal-editor/admino-universal-editor.component';



@NgModule({
  declarations: [AdminoUniversalEditorComponent],
  imports: [
    CommonModule,
    AdminoScreenModule
  ],
  exports: [AdminoUniversalEditorComponent]
})
export class AdminoUniversalEditorModule { }
