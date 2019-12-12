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

@Injectable({
  providedIn: 'root'
})
export class AdminoActionService {
  redrawScreen: BehaviorSubject<ScreenElementScreen> = new BehaviorSubject(null);
  updateScreen: BehaviorSubject<any> = new BehaviorSubject(null);

  currentQueryParams = null;

  activeRequests: { sub: Subscription }[] = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private user: AdminoUserService, private api: AdminoApiService, private cs: ConfigService) { }

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
      let screenValue = actionEvent.form ? actionEvent.form.value : null;
      screenValue = this.filterScreenValue(actionEvent.action.filterValue, screenValue);

      let schema = null;
      if (actionEvent.action.includeSchema) {
        schema = actionEvent.screenConfig;
      }

      return this.backendRequest(actionEvent.action.backendAction, schema, screenValue);
    } else if (actionEvent.action.type === 'frontend') {
      return this.handleFrontendAction(actionEvent.action);
    }
    return wrapIntoObservable(null);
  }
  backendRequest(screen, schema = null, screenValue = null) {
    // const backendRequest: BackendRequest = {};
    return this.api.request(screen, screenValue, schema, this.currentQueryParams).pipe(map((response: BackendResponse) => {
      if (response.setScreen) {
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
      if (response.setBottomButtons) {
        this.user.setBottomButtons(response.setBottomButtons);
      }
      if (response.setFirstName) {
        this.user.firstname = response.setFirstName;
      }
      if (response.setLastname) {
        this.user.lastname = response.setLastname;
      }
      if (response.setQueryParams) {
        this.setQueryParams(response.setQueryParams);
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

}
