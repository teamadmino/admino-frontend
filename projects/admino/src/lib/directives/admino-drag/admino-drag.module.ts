import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoDragDirective } from './admino-drag.directive';



@NgModule({
  declarations: [AdminoDragDirective],
  imports: [
    CommonModule
  ],
  exports: [AdminoDragDirective]
})
export class AdminoDragModule { }
