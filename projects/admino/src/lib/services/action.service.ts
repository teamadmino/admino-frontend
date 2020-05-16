import { cloneDeep } from 'lodash';
import { AdminoUserService } from './user.service';
import { ConfigService } from './config.service';
import { BackendRequest, BackendResponse } from './../interfaces';
import { AdminoApiService } from './api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AdminoAction, ActionEvent } from '../interfaces';
import { BehaviorSubject, Observable, Subscription, Subject } from 'rxjs';
import { ScreenElementScreen } from '../modules/admino-screen/admino-screen.interfaces';
import { encodeParams, decodeParams } from '../utils/encodeparams';
import { map } from 'rxjs/operators';
import { wrapIntoObservable } from '../utils/wrap-into-observable';
import { isObject } from '../utils/isobject';
import { propExists } from '../utils/propExists';
import { deepMerge } from '../utils/deepmerge';
import { AdminoThemeService } from './theme.service';
import { HttpResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminoActionService {
  redrawScreen: BehaviorSubject<ScreenElementScreen> = new BehaviorSubject(null);
  updateScreen: BehaviorSubject<any> = new BehaviorSubject(null);
  snackbarEvent: Subject<any> = new Subject();

  showToolbar: BehaviorSubject<boolean> = new BehaviorSubject(true);

  setFocus: BehaviorSubject<string> = new BehaviorSubject('');
  currentQueryParams = null;
  activeRequests: { sub: Subscription }[] = [];
  customVars: any = {};

  activeScreenId = '';
  pingFrequency = new BehaviorSubject(0);


  constructor(private router: Router, private route: ActivatedRoute,
    private user: AdminoUserService, private http: HttpClient,
    private api: AdminoApiService, private cs: ConfigService, private ts: AdminoThemeService) { }

  init() {
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = decodeParams(params);
    });



    if (this.currentQueryParams && Object.keys(this.currentQueryParams).indexOf('scanner') > -1) {
      const params = window.location.href.substring(window.location.href.indexOf('?'));
      this.backendGetRequest(this.cs.config.loginScreen + params).subscribe();
    } else {
      this.backendRequest(this.cs.config.loginScreen).subscribe();
    }

    // get request ha benne van scannerGetId

  }

  handleAction(actionEvent: ActionEvent): Observable<any> {
    if (!actionEvent.action) {
      console.warn('No action defined');
      return wrapIntoObservable(null);
    }
    if (typeof actionEvent.action === 'string') {
      // return wrapIntoObservable(null);
    } else if (actionEvent.action.type === 'backend') {

      let screenValue: any = {};
      // screenValue = actionEvent.openScreens ? cloneDeep(actionEvent.openScreens[0].group.value) : null;
      let a = 0;
      if (actionEvent.openScreens) {
        for (const scr of actionEvent.openScreens) {
          const id = scr.screenElement.id ? scr.screenElement.id : 'ID_WAS_NOT_PROVIDED_' + a.toString();
          // console.log(JSON.stringify(scr.group.value))
          screenValue[id] = JSON.parse(JSON.stringify(this.addTypesToValueKeys(scr.group.value, scr.screenElement)));
          a++;
        }
      }
      screenValue = this.removeNull(screenValue);

      // screenValue = this.filterScreenValue(actionEvent.action.filterValue, screenValue);
      // console.log(screenValue)

      let schema = null;
      if (actionEvent.action.includeSchema) {
        schema = actionEvent.screenConfig;
      }
      const requestingScreen = actionEvent.screenConfig ? actionEvent.screenConfig.id : null;
      return this.backendRequest(actionEvent.action.backendAction, requestingScreen, schema, screenValue, actionEvent.initiatedBy,
        actionEvent.trigger, actionEvent.key);
    } else if (actionEvent.action.type === 'frontend') {
      return this.handleFrontendAction(actionEvent.action);

    } else if (actionEvent.action.type === 'url') {
      this.handleUrlAction(actionEvent.action);
    } else if (actionEvent.action.type === 'download') {
      this.api.downloadFile(actionEvent.action.downloadId).subscribe((data) => {
        if (actionEvent.action.fileAction === 'open') {
          this.openFile(data, actionEvent.action.fileName, actionEvent.action.fileType);
        } else {
          this.saveFile(data, actionEvent.action.fileName, actionEvent.action.fileType);
        }
        // const blob = new Blob([data], { type: actionEvent.action.fileType });
        // const url = window.URL.createObjectURL(blob);
        // window.open(url);
      });
    }
    return wrapIntoObservable(null);
  }
  openFile(data, fileName, fileType = '') {
    const file = new Blob([data], { type: fileType });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }
  saveFile(data, fileName, fileType = '') {
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    const blob = new Blob([data], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  backendRequest(screen, requestingScreen = '', schema = null, screenValue = null, initiatedBy = null, trigger: string = null, key: string = null) {
    return this.api.request(screen, requestingScreen, screenValue, schema,
      initiatedBy, trigger, key, this.currentQueryParams, this.customVars).pipe(map((response: BackendResponse) => {
        this.handleResponse(response);
        return response;
      }));
  }

  backendGetRequest(screen) {

    return this.api.getRequest(screen).pipe(map((response: BackendResponse) => {
      this.handleResponse(response);
      return response;
    }));
  }
  handleResponse(response: BackendResponse) {
    if (response.setScreen !== undefined) {
      this.activeScreenId = response.setScreen.id;
      this.setQueryParams({});
      this.redrawScreen.next(response.setScreen);
    }
    if (response.updateScreen !== undefined) {
      this.updateScreen.next(response.updateScreen);
    }
    if (response.setSid !== undefined) {
      this.user.sid = response.setSid;
    }
    if (response.setMenu !== undefined) {
      this.user.setMenu(response.setMenu);
    }
    if (response.showToolbar !== undefined) {
      this.showToolbar.next(response.showToolbar);
    }
    if (response.setTheme !== undefined) {
      const color = response.setTheme.themeColor ? response.setTheme.themeColor : this.ts.currentTheme;
      const isDark = response.setTheme.isDark !== undefined ? response.setTheme.isDark : this.ts.isDarkTheme;
      this.ts.setTheme(color, isDark);
    }
    if (response.setBottomButtons !== undefined) {
      this.user.setBottomButtons(response.setBottomButtons);
    }
    if (response.setFirstName !== undefined) {
      this.user.firstname = response.setFirstName;
    }
    if (response.setLastname !== undefined) {
      this.user.lastname = response.setLastname;
    }
    if (response.setCustomVars !== undefined) {
      this.customVars = response.setCustomVars;
    }
    if (response.updateCustomVars !== undefined) {
      deepMerge(this.customVars, response.updateCustomVars);
    }
    if (response.setQueryParams !== undefined) {
      this.setQueryParams(response.setQueryParams);
    }
    if (response.setFocus !== undefined) {
      this.setFocus.next(response.setFocus);
      // this.user.sid = response.setSid;
    }
    if (response.setPing !== undefined) {
      // this.pingFrequency.next(response.setPing);
    }
    if (response.setSnackbars !== undefined) {
      this.snackbarEvent.next(response.setSnackbars);
      // this.setQueryParams(response.setQueryParams);
    }

    if (response.startAction !== undefined) {
      for (const action of response.startAction) {
        this.handleAction({ action }).subscribe();
      }
      // this.api.downloadFile(response.downloadFile.url).subscribe((data) => {
      //   const blob = new Blob([data], { type: response.downloadFile.type });
      //   const url = window.URL.createObjectURL(blob);
      //   window.open(url);
      // });
    }
  }

  handleFrontendAction(action: AdminoAction, form = null) {
    if (action.frontendAction === 'logout') {
      this.user.logout();
      this.redrawScreen.next({});
      const logoutScreen = action.logoutScreen !== undefined ? action.logoutScreen : this.cs.config.loginScreen;
      this.activeScreenId = '';
      this.pingFrequency.next(0);
      return this.backendRequest(logoutScreen);
    } else {
      return wrapIntoObservable(null);
    }
  }

  handleUrlAction(action: AdminoAction, form = null) {
    window.open(action.url, action.target ? action.target : '_blank');
  }


  setQueryParams(params) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: encodeParams(params),
        // queryParamsHandling: 'merge'
      });
  }
  setSid(params) { }
  setFirstName(params) { }
  setLastName(params) { }



  removeNull(value) {
    if (!propExists(value)) {
      return value;
    }
    value = cloneDeep(value);
    for (const key of Object.keys(value)) {
      const prop = value[key];
      if (isObject(prop)) {
        value[key] = this.removeNull(prop);
      } else if (prop === null) {
        delete value[key];
      }
    }
    return value;
  }

  filterScreenValue(filters: any, value: any, filtered = {}) {
    if (!filters || Object.keys(filters).length === 0) {
      return value;
    }
    for (const key of Object.keys(filters)) {
      // const element = parentElement && parentElement.elements.find((el: Element) => {
      //   return el.id === key;
      // });
      if (!isObject(filters[key])) {
        // if (filters[key] === false && filters[key] !== undefined) {
        filtered[key] = value[key];
        // } else {
        //   const config = cloneDeep(element);
        //   delete config.value;
        //   filtered[key] = { config, value: value[key] };
        // }
      } else {
        const filteredSubObject = this.filterScreenValue(filters[key], value[key], filtered[key]);
        if (Object.keys(filteredSubObject).length > 0) {
          filtered[key] = filteredSubObject;
        }
      }
    }
    return filtered;
  }
  addTypesToValueKeys(value: any, schema: ScreenElementScreen, newScreenVal = {}) {

    for (const key of Object.keys(value)) {
      const found = schema.elements.find((el) => {
        return el.id === key;
      });
      if (found) {
        if (found.type === 'group') {
          newScreenVal[key + ':' + found.type] = this.addTypesToValueKeys(value[key], found);
        } else {

          newScreenVal[key + ':' + found.type] = value[key];
        }
      } else {
        console.log('NOT FOUND ELEMENT BY ID WHEN ADDING TYPES TO VALUEKEYS');
      }

    }

    return newScreenVal;
  }

}
