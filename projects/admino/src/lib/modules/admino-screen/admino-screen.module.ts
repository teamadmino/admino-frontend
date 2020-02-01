import { AdminoModalModule } from './../admino-modal/admino-modal.module';
import { AdminoDragModule } from './../../directives/admino-drag/admino-drag.module';
import { AdminoGridModule } from './../admino-grid/admino-grid.module';
import { AdminoFocusTrapModule } from './../../directives/admino-focus-trap/admino-focus-trap.module';
import { AdminoVirtualTableModule } from './../admino-virtual-table/admino-virtual-table.module';
import { AdminoCardModule } from './../admino-card/admino-card.module';
import { MaterialModulesModule } from './../material-modules/material-modules.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoScreenComponent } from './admino-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminoScreenElementDirective } from './admino-screen-element.directive';
import { ButtonComponent } from './elements/button/button.component';
import { InputComponent } from './elements/input/input.component';
import { TableComponent } from './elements/table/table.component';
import { GroupComponent } from './elements/group/group.component';
import { TimerComponent } from './elements/timer/timer.component';
import { TextComponent } from './elements/text/text.component';
import { PopupComponent } from './elements/popup/popup.component';
import { CheckboxComponent } from './elements/checkbox/checkbox.component';
import { RadiobuttonComponent } from './elements/radiobutton/radiobutton.component';
import { ChartComponent } from './elements/chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { MapComponent } from './elements/map/map.component';

@NgModule({
  declarations: [AdminoScreenComponent, AdminoScreenElementDirective,
    ButtonComponent,
    InputComponent,
    TableComponent,
    GroupComponent,
    TimerComponent,
    TextComponent,
    PopupComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    ChartComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModulesModule,
    AdminoCardModule,
    AdminoVirtualTableModule,
    AdminoFocusTrapModule,
    AdminoGridModule,
    AdminoDragModule,
    AdminoModalModule,
    ChartsModule

  ],
  exports: [
    AdminoScreenComponent
  ],
  entryComponents: [
    ButtonComponent,
    InputComponent,
    TableComponent,
    GroupComponent,
    TimerComponent,
    TextComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    ChartComponent,
    MapComponent

  ]
})
export class AdminoScreenModule { }
