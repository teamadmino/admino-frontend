import { AdminoSnackbarModule } from "./modules/admino-snackbar/admino-snackbar.module";
import { AdminoTooltipModule } from "./modules/admino-tooltip/admino-tooltip.module";
import { AdminoGridModule } from "./modules/admino-grid/admino-grid.module";
import { AdminoVirtualTableModule } from "./modules/admino-virtual-table/admino-virtual-table.module";
import { AdminoFocusTrapModule } from "./directives/admino-focus-trap/admino-focus-trap.module";
import { AdminoMenuModule } from "./modules/admino-menu/admino-menu.module";
import { AdminoCardModule } from "./modules/admino-card/admino-card.module";
import { AdminoModalModule } from "./modules/admino-modal/admino-modal.module";
import { AdminoResizeModule } from "./directives/admino-resize/admino-resize.module";
import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe, CurrencyPipe, DatePipe } from "@angular/common";
import { DisableDefaultKeyEventsDirective } from "./directives/disable-default-key-events.directive";
import { ThemeEmitterComponent } from "./modules/main/theme-emitter/theme-emitter.component";
import { AdminoResizeObserverDirective } from "./directives/admino-resize/resize-observer.directive";
import { MaterialModulesModule } from "./modules/material-modules/material-modules.module";

import { ChartsModule } from "ng2-charts";

import { ToolbarComponent } from "./modules/main/toolbar/toolbar.component";
import { MainComponent } from "./modules/main/main.component";
import { AdminoPrintModule } from "./directives/admino-print/admino-print.module";
import { AdminoThemingModule } from "./modules/admino-theming/admino-theming.module";
import { AdminoMessagesComponent } from "./modules/main/admino-messages/admino-messages.component";
import { AdminoMessageComponent } from "./modules/main/admino-messages/admino-message/admino-message.component";
import { AdminoUniversalEditorModule } from "./modules/admino-universal-editor/admino-universal-editor.module";
import { FormatService } from "./services/format.service";
import { MonacoEditorModule } from "ngx-monaco-editor";

import { registerLocaleData } from "@angular/common";
import localeHu from "@angular/common/locales/hu";
registerLocaleData(localeHu, "hu");

@NgModule({
  declarations: [
    DisableDefaultKeyEventsDirective,
    ThemeEmitterComponent,

    ToolbarComponent,
    MainComponent,
    AdminoMessagesComponent,
    AdminoMessageComponent,
  ],
  imports: [
    CommonModule,

    AdminoPrintModule,
    AdminoThemingModule,
    AdminoResizeModule,

    AdminoModalModule,
    AdminoTooltipModule,

    AdminoCardModule,
    AdminoMenuModule,
    AdminoUniversalEditorModule,
    AdminoSnackbarModule,
    AdminoFocusTrapModule,
    AdminoVirtualTableModule,
    AdminoGridModule,
    MaterialModulesModule,
    MonacoEditorModule.forRoot(),
  ],

  exports: [
    MaterialModulesModule,
    DisableDefaultKeyEventsDirective,
    ThemeEmitterComponent,
    AdminoResizeObserverDirective,
    MainComponent,

    AdminoModalModule,
    AdminoCardModule,
    AdminoMenuModule,
    AdminoUniversalEditorModule,
    AdminoFocusTrapModule,
    AdminoVirtualTableModule,
    AdminoGridModule,
    AdminoSnackbarModule,
  ],
  providers: [DecimalPipe, CurrencyPipe, DatePipe, FormatService],
  // providers: [
  //   { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
  // ],
  // providers: [AdminoUserService, AdminoNavService, AdminoKeynavService, AdminoMenuService, AdminoSiteService, AdminoThemeService],
})
export class AdminoModule {}
