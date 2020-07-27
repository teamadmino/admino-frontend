import { AdminoKeyboardModule } from "./../admino-keyboard/admino-keyboard.module";
import { SuccessAnimationComponent } from "./elements/scanner/inputview/success-animation/success-animation.component";
import { AdminoOldTableModule } from "./../admino-old-table/admino-table.module";
import { SuperTableComponent } from "./elements/super-table/super-table.component";
import { AdminoPreloaderModule } from "./../admino-preloader/admino-preloader.module";
import { AdminoTable2Module } from "./../admino-table2/admino-table2.module";
import { AdminoModalModule } from "./../admino-modal/admino-modal.module";
import { AdminoDragModule } from "./../../directives/admino-drag/admino-drag.module";
import { AdminoGridModule } from "./../admino-grid/admino-grid.module";
import { AdminoFocusTrapModule } from "./../../directives/admino-focus-trap/admino-focus-trap.module";
import { AdminoVirtualTableModule } from "./../admino-virtual-table/admino-virtual-table.module";
import { AdminoCardModule } from "./../admino-card/admino-card.module";
import { MaterialModulesModule } from "./../material-modules/material-modules.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminoScreenComponent } from "./admino-screen.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminoScreenElementDirective } from "./admino-screen-element.directive";
import { ButtonComponent } from "./elements/button/button.component";
import { InputComponent } from "./elements/input/input.component";
import { TableComponent } from "./elements/table/table.component";
import { GroupComponent } from "./elements/group/group.component";
import { TimerComponent } from "./elements/timer/timer.component";
import { TextComponent } from "./elements/text/text.component";
import { CheckboxComponent } from "./elements/checkbox/checkbox.component";
import { RadiobuttonComponent } from "./elements/radiobutton/radiobutton.component";
import { ChartComponent } from "./elements/chart/chart.component";
import { ChartsModule } from "ng2-charts";
import { MapComponent } from "./elements/map/map.component";
import { NewTableComponent } from "./elements/new-table/new-table.component";
import { TextareaComponent } from "./elements/textarea/textarea.component";
import { DateComponent } from "./elements/date/date.component";
import { ScannerComponent } from "./elements/scanner/scanner.component";
import { ChartjsComponent } from "./elements/chartjs/chartjs.component";
import { ColorpickerComponent } from "./elements/colorpicker/colorpicker.component";
import { TabsComponent } from "./elements/tabs/tabs.component";
import { ImageComponent } from "./elements/image/image.component";
import { SelectComponent } from "./elements/select/select.component";
import { SliderComponent } from "./elements/slider/slider.component";
import { ToggleComponent } from "./elements/toggle/toggle.component";
import { CodeComponent } from "./elements/code/code.component";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { IframeComponent } from "./elements/iframe/iframe.component";
import { IconButtonComponent } from "./elements/icon-button/icon-button.component";
import { TableselectComponent } from "./elements/tableselect/tableselect.component";
import { OverlaycontentComponent } from "./elements/tableselect/overlaycontent/overlaycontent.component";
import { InputviewComponent } from "./elements/scanner/inputview/inputview.component";
import { LoginviewComponent } from "./elements/scanner/loginview/loginview.component";
import { ScannerView } from "./elements/scanner/scannerview";
import { FakkviewComponent } from "./elements/scanner/fakkview/fakkview.component";
import { UtcaviewComponent } from "./elements/scanner/utcaview/utcaview.component";
import { InfopanelComponent } from "./elements/scanner/infopanel/infopanel.component";
import { EventlistComponent } from "./elements/scanner/eventlist/eventlist.component";
import { ErroroverlayComponent } from "./elements/scanner/erroroverlay/erroroverlay.component";
import { NewmapComponent } from "./elements/newmap/newmap.component";
import { MapeditorComponent } from "./elements/mapeditor/mapeditor.component";
import { AdminoScreenElement } from "./elements/admino-screen-element";
import { PopupComponent } from "./elements/scanner/popup/popup.component";
import { DividerComponent } from "./elements/divider/divider.component";
import { AdminoTableModule } from "../admino-table/admino-table.module";
import { MenuComponent } from "./elements/menu/menu.component";
import { MatrixComponent } from "./elements/matrix/matrix.component";
import { StopWatchComponent } from "./elements/stopwatch/stopwatch.component";
import { ProgressBarComponent } from "./elements/progressbar/progressbar.component";
import { AdminoResizeModule } from "../../directives/admino-resize/admino-resize.module";
import { DaterangeComponent } from "./elements/daterange/daterange.component";

@NgModule({
  declarations: [
    AdminoScreenElement,
    AdminoScreenComponent,
    AdminoScreenElementDirective,
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
    UtcaviewComponent,
    ScannerView,
    SuccessAnimationComponent,
    FakkviewComponent,
    InfopanelComponent,
    EventlistComponent,
    ErroroverlayComponent,
    NewmapComponent,
    MapeditorComponent,
    PopupComponent,
    DividerComponent,
    MenuComponent,
    MatrixComponent,
    StopWatchComponent,
    ProgressBarComponent,
    DaterangeComponent,
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
    AdminoTable2Module,
    AdminoTableModule,
    ChartsModule,
    MonacoEditorModule,
    AdminoPreloaderModule,
    AdminoOldTableModule,
    AdminoKeyboardModule,
    AdminoResizeModule,
  ],
  exports: [AdminoScreenComponent, AdminoScreenElementDirective],
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
    OverlaycontentComponent,
    NewmapComponent,
    MapeditorComponent,
    DividerComponent,
    MenuComponent,
    MatrixComponent,
    StopWatchComponent,
    ProgressBarComponent,
    DaterangeComponent,
  ],
})
export class AdminoScreenModule {}
