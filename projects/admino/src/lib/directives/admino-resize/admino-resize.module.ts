import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoResizeObserverDirective } from './resize-observer.directive';

@NgModule({
  declarations: [AdminoResizeObserverDirective],
  imports: [
    CommonModule
  ],
  exports: [AdminoResizeObserverDirective]
})
export class AdminoResizeModule { }
