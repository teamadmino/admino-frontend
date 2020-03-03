import { AdminoScreenComponent } from './modules/admino-screen/admino-screen.component';
import { Subscription } from 'rxjs';
import { ScreenElementScreen } from './modules/admino-screen/admino-screen.interfaces';
import { FormGroup } from '@angular/forms';


export interface AdminoMenuItem {
  id: string;
  label: string;
  action?: AdminoAction;
  icon?: string;
  children?: AdminoMenuItem[];

  _isActive?: boolean;
}
export interface AdminoMenuEvent {
  url?: string;
  newWindow?: boolean;
  menuItem?: AdminoMenuItem;
}
export interface AdminoButton {
  label: string;
  action?: AdminoAction;
  icon?: string;
  color: 'primary' | 'accent' | 'warn';
}

export interface ThemeConfig {
  themeColor: 'gold' | 'purple' | 'blue';
  isDark?: boolean;
}

export interface AdminoConfig {
  server?: string;
  company?: string;
  theme?: ThemeConfig;
  loginScreen: string;
  translations: any;
}

////////////
export interface ActionEvent {
  action: AdminoAction;

  // form?: FormGroup;

  openScreens?: AdminoScreenComponent[];
  screenConfig?: ScreenElementScreen;
  initiatedBy?: any;
}
////////////

export interface ActionSubscription {
  actionEvent?: ActionEvent;
  subscription?: Subscription;
}
////////////
export interface AdminoAction {
  type: 'backend' | 'frontend' | 'url' | 'download';
  // backend
  backendAction?: any;
  // frontend
  frontendAction?: 'logout' | 'print';
  logoutScreen?: string;
  // url config
  url?: string;
  target?: '_blank' | '_self';
  // download config
  downloadId?: string;
  fileName?: string;
  fileType?: string;
  fileAction?: string; // open or download

  // updateOn?: 'change' | 'blur' | 'submit'; // nincs implementálva

  //
  filterValue?: any;
  // excludeValues: boolean;
  includeSchema?: boolean;
  // isBlocking?: boolean;
}



export interface BackendRequest {

  isFirstRequest: boolean;
  queryParams: {};
  screenValue: {};

  previousBackendAction?: string;

  backendAction?: string;


}

//////////////
export interface BackendResponse {

  setScreen: any;
  updateScreen: any;

  setCustomVars: any;
  updateCustomVars: any;

  setSid: string;
  setFirstName: string;
  setLastname: string;
  setMenu: AdminoMenuItem[];
  setQueryParams: { [id: string]: string; };
  setBottomButtons: AdminoButton[];
  setFocus: any;
  setPing: number;

  startAction: AdminoAction[];

  closePopup: boolean | string;


  setTheme: ThemeConfig;

}
