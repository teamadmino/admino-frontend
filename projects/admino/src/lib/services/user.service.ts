import { AdminoButton } from './../interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AdminoSiteService } from './site.service';
import { AdminoMenuItem } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminoUserService {
  userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  requestedRouteOnInit;

  private _sid = '';
  firstname = '';
  lastname = '';
  homeScreen: AdminoMenuItem;
  requestedScreenName: string;

  menu: AdminoMenuItem[] = [];
  bottomButtons: AdminoButton[] = [];

  constructor(private site: AdminoSiteService) {
  }

  init() {
    const storedSid = localStorage.getItem('sid');
    if (storedSid) {
      this.sid = storedSid;
    }
  }

  public set sid(v: string) {
    this._sid = v;
    if (this.sid) {
      localStorage.setItem('sid', this.sid);
      this.setLoginState(true);
    } else {
      this.logout();
    }
  }

  public get sid(): string {
    return this._sid;
  }

  setLoginState(bool: boolean) {
    if (bool === true) {
      if (!this.site.isMobile) {
        this.site.isSideNavOpen.next(true);
      }
      this.userLoggedIn.next(true);
    }
  }

  setMenu(menu) {
    this.menu = menu;
  }
  setBottomButtons(buttons) {
    this.bottomButtons = buttons;
  }
  setName(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
  logout() {
    this._sid = '';
    localStorage.removeItem('sid');
    this.setName('', '');
    this.site.closeSideNav();
    this.site.closeMessages();
    this.userLoggedIn.next(false);
  }

}
