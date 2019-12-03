import { AdminoPrintDirective } from './admino-print.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AdminoPrintDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AdminoPrintDirective
  ],
})
export class AdminoPrintModule { }
