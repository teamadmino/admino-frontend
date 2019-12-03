import { MaterialModulesModule } from './../material-modules/material-modules.module';
import { AdminoPrintModule } from '../../directives/admino-print/admino-print.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoCardComponent } from './admino-card/admino-card.component';



@NgModule({
  declarations: [AdminoCardComponent],
  imports: [
    CommonModule,
    AdminoPrintModule,
    MaterialModulesModule
  ],
  exports: [AdminoCardComponent]
})
export class AdminoCardModule { }
