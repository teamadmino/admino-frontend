import { ConfigService } from './config.service';
import { AdminoAction } from './../interfaces';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AdminoSiteService } from './site.service';
import { AdminoUserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminoNavService {

  // onRouteChange: Subject<any> = new Subject();
  activeRoute: string[] = [];


  constructor(private router: Router, private route: ActivatedRoute, private user: AdminoUserService, private cs: ConfigService) {

  }

  init() {
    this.route.queryParamMap.subscribe((params) => {
      this.handleQueryParams(params);
    });
    // this.user.userLoggedIn.subscribe((isLoggedIn) => {
    //   if (!isLoggedIn) {
    //     this.navigate(this.cs.config.loginScreen);
    //   }
    // });
  }

  handleQueryParams(params) {
    const screen = params.get('screen');
    // if (this.user.userLoggedIn.value) {
    //   if (screen) {
    //     this.onScreenChange.next(screen);
    //   }
    // } else {
    //   if (screen && screen !== this.cs.config.loginScreen && !this.user.requestedScreenName) {
    //     this.user.requestedScreenName = screen;
    //   }
    //   this.navigate(this.cs.config.loginScreen);
    //   this.onScreenChange.next(this.cs.config.loginScreen);
    // }
  }

  navigate(screenName: any, data: any = {}) {
    this.router.navigate([], { queryParams: { screen: screenName } });
  }




}
