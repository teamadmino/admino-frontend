import { AdminoUserService } from './user.service';
import { ConfigService } from './config.service';
import { BackendRequest, BackendResponse } from './../interfaces';
import { AdminoApiService } from './api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AdminoAction, ActionEvent } from '../interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenConfig } from '../modules/admino-screen/admino-screen.interfaces';
import { encodeParams, decodeParams } from '../utils/encodeparams';
import { map } from 'rxjs/operators';
import { wrapIntoObservable } from '../utils/wrap-into-observable';

@Injectable({
  providedIn: 'root'
})
export class AdminoActionService {
  redrawScreen: BehaviorSubject<ScreenConfig> = new BehaviorSubject(null);
  updateScreen: BehaviorSubject<any> = new BehaviorSubject(null);

  currentQueryParams = null;

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
    } else if (actionEvent.action.type === 'screen') {
      const screenValue = actionEvent.form ? actionEvent.form.value : null;
      return this.backendRequest(actionEvent.action.requestedScreen, screenValue);
    } else if (actionEvent.action.type === 'frontend') {
      return this.handleFrontendAction(actionEvent.action);
    }
    return wrapIntoObservable(null);

  }
  backendRequest(screen, screenValue = null) {
    // const backendRequest: BackendRequest = {};
    return this.api.request(screen, screenValue, this.currentQueryParams).pipe(map((response: BackendResponse) => {
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
    if (action.frontendAction === 'login') {
      return this.api.login(form.value).pipe(map((params) => {
      }));
    } else if (action.frontendAction === 'logout') {
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



}
