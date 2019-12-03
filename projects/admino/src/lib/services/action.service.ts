import { AdminoUserService } from './user.service';
import { ConfigService } from './config.service';
import { BackendRequest, BackendResponse } from './../interfaces';
import { AdminoApiService } from './api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AdminoAction, ActionEvent } from '../interfaces';
import { BehaviorSubject } from 'rxjs';
import { ScreenConfig } from '../modules/admino-screen/admino-screen.interfaces';
import { encodeParams, decodeParams } from '../utils/encodeparams';

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
    this.backendRequest(this.cs.config.loginScreen);
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = decodeParams(params);
    });
  }

  handleAction(actionEvent: ActionEvent) {
    if (typeof actionEvent.action === 'string') {
      // this.router.navigate([], { queryParams: { screen: actionEvent.action } });
    } else if (actionEvent.action.type === 'screen') {
      // this.router.navigate([], { queryParams: { screen: actionEvent.action.config.id } });
      // this.handleFrontendAction(actionEvent.action.config, actionEvent.form);
      const screenValue = actionEvent.form ? actionEvent.form.value : null;
      console.log(actionEvent.action.id);
      this.backendRequest(actionEvent.action.id, screenValue);
    } else if (actionEvent.action.type === 'frontend') {
      // console.log(actionEvent);
      this.handleFrontendAction(actionEvent.action);
    }
  }
  backendRequest(screen, screenValue = null) {
    // const backendRequest: BackendRequest = {};
    this.api.request(screen, screenValue, this.currentQueryParams).subscribe((response: BackendResponse) => {
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
    });
  }

  handleFrontendAction(action: AdminoAction, form = null) {
    if (action.actionType === 'login') {
      this.api.login(form.value).subscribe((params) => {
      });
    } else if (action.actionType === 'logout') {
      this.user.logout();
      this.redrawScreen.next(null);
      this.backendRequest(this.cs.config.loginScreen);

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
