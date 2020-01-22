import { cloneDeep } from 'lodash';
import { AdminoUserService } from './user.service';
import { ConfigService } from './config.service';
import { BackendRequest, BackendResponse } from './../interfaces';
import { AdminoApiService } from './api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AdminoAction, ActionEvent } from '../interfaces';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ScreenElementScreen } from '../modules/admino-screen/admino-screen.interfaces';
import { encodeParams, decodeParams } from '../utils/encodeparams';
import { map } from 'rxjs/operators';
import { wrapIntoObservable } from '../utils/wrap-into-observable';
import { isObject } from '../utils/isobject';
import { propExists } from '../utils/propExists';
import { deepMerge } from '../utils/deepmerge';
import { AdminoThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class AdminoActionService {
  redrawScreen: BehaviorSubject<ScreenElementScreen> = new BehaviorSubject(null);
  updateScreen: BehaviorSubject<any> = new BehaviorSubject(null);
  setFocus: BehaviorSubject<string> = new BehaviorSubject('');

  currentQueryParams = null;
  activeRequests: { sub: Subscription }[] = [];

  customVars: any = {};


  constructor(private router: Router, private route: ActivatedRoute,
    private user: AdminoUserService, private api: AdminoApiService, private cs: ConfigService, private ts: AdminoThemeService) { }

  init() {
    this.backendRequest(this.cs.config.loginScreen).subscribe();
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = decodeParams(params);
    });
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
          screenValue[id] = this.addTypesToValueKeys(scr.group.value, scr.screenElement);
          a++;
        }
      }
      // screenValue = this.removeNull(screenValue);
      screenValue = this.filterScreenValue(actionEvent.action.filterValue, screenValue);
      let schema = null;
      if (actionEvent.action.includeSchema) {
        schema = actionEvent.screenConfig;
      }
      const requestingScreen = actionEvent.screenConfig ? actionEvent.screenConfig.id : null;
      return this.backendRequest(actionEvent.action.backendAction, requestingScreen, schema, screenValue, actionEvent.initiatedBy);
    } else if (actionEvent.action.type === 'frontend') {

      return this.handleFrontendAction(actionEvent.action);

    }
    return wrapIntoObservable(null);
  }
  backendRequest(screen, requestingScreen = '', schema = null, screenValue = null, initiatedBy = null) {

    return this.api.request(screen, requestingScreen, screenValue, schema,
      initiatedBy, this.currentQueryParams, this.customVars).pipe(map((response: BackendResponse) => {
        if (response.setScreen) {
          this.setQueryParams({});
          this.redrawScreen.next(response.setScreen);
        }
        if (response.updateScreen) {
          this.updateScreen.next(response.updateScreen);
        }
        if (response.setSid) {
          this.user.sid = response.setSid;
        }
        if (response.setMenu) {
          this.user.setMenu(response.setMenu);
        }
        if (response.setTheme) {
          const color = response.setTheme.themeColor ? response.setTheme.themeColor : this.ts.currentTheme;
          const isDark = response.setTheme.isDark ? response.setTheme.isDark : this.ts.isDarkTheme;
          this.ts.setTheme(color, isDark);
        }
        if (response.setBottomButtons) {
          this.user.setBottomButtons(response.setBottomButtons);
        }
        if (response.setFirstName) {
          this.user.firstname = response.setFirstName;
        }
        if (response.setLastname) {
          this.user.lastname = response.setLastname;
        }
        if (response.setCustomVars) {
          this.customVars = response.setCustomVars;
        }
        if (response.updateCustomVars) {
          deepMerge(this.customVars, response.updateCustomVars);
        }
        if (response.setQueryParams) {
          this.setQueryParams(response.setQueryParams);
        }
        if (response.setFocus) {
          this.setFocus.next(response.setFocus);
          // this.user.sid = response.setSid;
        }
      }));
  }

  handleFrontendAction(action: AdminoAction, form = null) {
    if (action.frontendAction === 'logout') {
      this.user.logout();
      this.redrawScreen.next(null);
      return this.backendRequest(this.cs.config.loginScreen);
    }
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
    if (!filters) {
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
