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
  type: 'screen' | 'frontend' | 'url';

  // screen
  id?: any;
  popup?: boolean;
  data?: any;

  //frontend
  actionType?: 'login' | 'logout' | 'print';

  //url config
  url?: string;
  target?: '_blank' | '_self';
}
// export interface ScreenActionConfig {
//   id: string;
//   popup?: boolean;
//   data: any;
// }
// export interface FrontendActionConfig {
//   type: 'login' | 'logout' | 'print';

// }
// export interface UrlActionConfig {
//   url: string;
//   target: '_blank' | '_self';
// }


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
// export interface ElementUpdate {
//   value: any;
//   label: any;
// }
export interface BackendCommands {

  elementsUpdate: { [id: string]: ScreenElement; };

  // 'elementUpdate': {
  //   "user": {
  //     "value": "admin",
  //     "label": "valami"
  //   },
  //   "password": "pass",
  //   "timer": {
  //     "freq": 5,
  //     "action": 4
  //   }
  // },



  // "setQueryParams": {
  //   "screen": "CikkszamModositas",
  //   "id": { key1: "asasdasd", key2: "asdasdasd" },
  //   "screasden": "Screen1",
  //   "asd": "Screen1",
  //   "sidebarOpen": false
  // },

}
