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

@NgModule({
  declarations: [AdminoScreenComponent, AdminoScreenElementDirective,
    ButtonComponent,
    InputComponent,
    TableComponent,
    GroupComponent,
    TimerComponent,
    TextComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModulesModule,
    AdminoCardModule,
    AdminoVirtualTableModule
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
    TextComponent
  ]
})
export class AdminoScreenModule { }
