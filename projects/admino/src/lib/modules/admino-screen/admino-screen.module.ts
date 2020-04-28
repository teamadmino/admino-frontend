import { SuccessAnimationComponent } from './elements/scanner/inputview/success-animation/success-animation.component';
import { AdminoOldTableModule } from './../admino-old-table/admino-table.module';
import { SuperTableComponent } from './elements/super-table/super-table.component';
import { AdminoPreloaderModule } from './../admino-preloader/admino-preloader.module';
import { AdminoTableModule } from './../admino-table/admino-table.module';
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
import { CheckboxComponent } from './elements/checkbox/checkbox.component';
import { RadiobuttonComponent } from './elements/radiobutton/radiobutton.component';
import { ChartComponent } from './elements/chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { MapComponent } from './elements/map/map.component';
import { NewTableComponent } from './elements/new-table/new-table.component';
import { TextareaComponent } from './elements/textarea/textarea.component';
import { DateComponent } from './elements/date/date.component';
import { ScannerComponent } from './elements/scanner/scanner.component';
import { ChartjsComponent } from './elements/chartjs/chartjs.component';
import { ColorpickerComponent } from './elements/colorpicker/colorpicker.component';
import { TabsComponent } from './elements/tabs/tabs.component';
import { ImageComponent } from './elements/image/image.component';
import { SelectComponent } from './elements/select/select.component';
import { SliderComponent } from './elements/slider/slider.component';
import { ToggleComponent } from './elements/toggle/toggle.component';
import { CodeComponent } from './elements/code/code.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { IframeComponent } from './elements/iframe/iframe.component';
import { IconButtonComponent } from './elements/icon-button/icon-button.component';
import { TableselectComponent } from './elements/tableselect/tableselect.component';
import { OverlaycontentComponent } from './elements/tableselect/overlaycontent/overlaycontent.component';
import { InputviewComponent } from './elements/scanner/inputview/inputview.component';
import { LoginviewComponent } from './elements/scanner/loginview/loginview.component';
import { UtcafakkviewComponent } from './elements/scanner/utcafakkview/utcafakkview.component';
import { ScannerView } from './elements/scanner/scannerview';

@NgModule({
  declarations: [AdminoScreenComponent, AdminoScreenElementDirective,
    ButtonComponent,
    InputComponent,
    TableComponent,
    GroupComponent,
    TimerComponent,
    TextComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    ChartComponent,
    MapComponent,
    NewTableComponent,
    TextareaComponent,
    DateComponent,
    ScannerComponent,
    ChartjsComponent,
    ColorpickerComponent,
    TabsComponent,
    ImageComponent,
    SelectComponent,
    SliderComponent,
    ToggleComponent,
    CodeComponent,
    IframeComponent,
    IconButtonComponent,
    SuperTableComponent,
    TableselectComponent,
    OverlaycontentComponent,
    InputviewComponent,
    LoginviewComponent,
    UtcafakkviewComponent,
    ScannerView,
    SuccessAnimationComponent
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
    AdminoTableModule,
    ChartsModule,
    MonacoEditorModule,
    AdminoPreloaderModule,
    AdminoOldTableModule
  ],
  exports: [
    AdminoScreenComponent,
    AdminoScreenElementDirective
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
    MapComponent,
    NewTableComponent,
    TextareaComponent,
    DateComponent,
    ScannerComponent,
    ChartjsComponent,
    ColorpickerComponent,
    TabsComponent,
    ImageComponent,
    SelectComponent,
    SliderComponent,
    ToggleComponent,
    CodeComponent,
    IframeComponent,
    IconButtonComponent,
    SuperTableComponent,
    TableselectComponent,
    OverlaycontentComponent


  ]
})
export class AdminoScreenModule { }
