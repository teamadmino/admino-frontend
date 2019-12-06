import { ScreenElement } from './modules/admino-screen/admino-screen.interfaces';
import { FormGroup } from '@angular/forms';


export interface AdminoMenuItem {
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
  form?: FormGroup;
}

////////////
export interface AdminoAction {
  type: 'backend' | 'screen' | 'frontend' | 'url';
  // backend
  backendAction?: string;
  // screen
  requestedScreen?: any;
  // frontend
  frontendAction?: 'login' | 'logout' | 'print';
  //url config
  url?: string;
  target?: '_blank' | '_self';
}

export interface BackendRequest {

  isFirstRequest: boolean;
  queryParams: {};
  screenValue: {};

  baseScreen?: string;
  requestedScreen?: string;


  // bizonylat: 'jancsi',
  // table: {
  //   cursor:
  //   index:
  // },
  // chart: {
  //   type: "bar"
  // }

}

//////////////
export interface BackendResponse {
  // screenSchema: any;
  // commands: BackendCommands;
  setScreen: any;
  updateScreen: { [id: string]: ScreenElement; };

  setSid: string;
  setFirstName: string;
  setLastname: string;
  setThemeColor: ThemeConfig;
  setMenu: AdminoMenuItem[];
  setBottomButtons: AdminoButton[];
  setQueryParams: { [id: string]: string; };

}
