import { AdminoCardModule } from './../admino-card/admino-card.module';
import { MaterialModulesModule } from './../material-modules/material-modules.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoVirtualTableComponent } from './admino-virtual-table/admino-virtual-table.component';
import { AdminoResizeModule } from '../../directives/admino-resize/admino-resize.module';
import { AdminoVirtualTableWrapperComponent } from './admino-virtual-table-wrapper/admino-virtual-table-wrapper.component';
import { AdminoVirtualScrollDirective } from './admino-virtual-scroll.directive';
import { AdminoFocusTrapModule } from '../../directives/admino-focus-trap/admino-focus-trap.module';
import { AdminoVirtualTableSorterComponent } from './admino-virtual-table/admino-virtual-table-sorter/admino-virtual-table-sorter.component';



@NgModule({
  declarations: [AdminoVirtualTableComponent, AdminoVirtualTableWrapperComponent, AdminoVirtualScrollDirective, AdminoVirtualTableSorterComponent],
  imports: [
    CommonModule,
    MaterialModulesModule,
    AdminoResizeModule,
    AdminoCardModule,
    AdminoFocusTrapModule

  ],
  exports: [AdminoVirtualTableComponent, AdminoVirtualTableWrapperComponent]
})
export class AdminoVirtualTableModule { }
