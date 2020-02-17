import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoTableComponent } from './admino-table/admino-table.component';
import { AdminoTooltipModule } from '../admino-tooltip/admino-tooltip.module';
import { AdminoTableSorterComponent } from './admino-table/admino-table-sorter/admino-table-sorter.component';
import { MaterialModulesModule } from '../material-modules/material-modules.module';



@NgModule({
  declarations: [AdminoTableComponent, AdminoTableSorterComponent],
  imports: [
    CommonModule,
    MaterialModulesModule,
    AdminoTooltipModule
  ],
  exports: [
    AdminoTableComponent
  ]
})
export class AdminoTableModule { }
