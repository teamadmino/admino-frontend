import { AdminoMenuItem, BackendResponse } from './../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, delay } from 'rxjs/operators';
import { Subject, Observable, ObservableInput } from 'rxjs';
import { AdminoNavService } from './nav.service';
import { AdminoUserService } from './user.service';
import { AdminoSiteService } from './site.service';




@Injectable({
  providedIn: 'root'
})
export class AdminoApiService {

  // BASE_URL = 'http://127.0.0.1:4080';
  // BASE_URL = 'http://192.168.0.101:4080';
  BASE_URL = 'http://localhost:4080';
  LOGIN = '/login';
  BROWSE = '/browse';
  BROWSER_INFO = '/browserinfo';
  REQUEST = '/request';

  constructor(private http: HttpClient, private nav: AdminoNavService, private user: AdminoUserService, private site: AdminoSiteService) {
  }


  init(baseUrl: string) {
    this.BASE_URL = baseUrl;
  }


  // login(body: any) {
  //   // const body = { user: 'admin', password: 'admin' };
  //   return this.http.post(this.BASE_URL + this.LOGIN, this.stringifyObject(body)).pipe(map((result: any) => {
  //     this.user.sid = result.sid;
  //     this.user.homeScreen = this.getFirstMenu(result.menu[0]);
  //     this.user.setMenu(result.menu);
  //     this.user.setName(result.firstname, result.lastname);
  //     this.user.setLoginState(true);
  //     if (this.user.requestedScreenName) {
  //       this.nav.navigate(this.user.requestedScreenName);
  //     } else {
  //       this.nav.navigate(this.user.homeScreen.action);
  //     }
  //   }));
  // }
  getFirstMenu(menu: AdminoMenuItem) {
    if (menu.children) {
      return (this.getFirstMenu(menu.children[0]));
    } else {
      return menu;
    }
  }


  list(view: string, keys: any, cursor: number, shift: number, count: number, index: number, before: number = 0, after: number = 0) {
    const dummySubject = new Subject();
    const body = {
      cursor: cursor.toString(),
      count: count.toString(),
      keys,
      shift: shift.toString(),
      index: index.toString(),
      table: view,
      before: before.toString(),
      after: after.toString(),
    };
    // this.http.post(this.BASE_URL + '/v2ping',
    //   JSON.stringify({ test: 'áÁíÍóÓöÖőŐúÚüÜűŰéÉ' })).pipe(map((response: any) => { })).subscribe();
    this.http.post(this.BASE_URL + this.BROWSE, body).pipe(map((response: any) => {
      // response.data.splice(Math.floor(Math.random() * response.data.length), 0, { id: Math.random().toString() });

      // response.data.forEach(row => {
      //   row.symbol = this.dummyBaseData[parseInt(row.id, 10)].symbol;
      //   row.name = this.dummyBaseData[parseInt(row.id, 10)].name;
      //   row.text = this.dummyBaseData[parseInt(row.id, 10)].text;
      // });

      // setTimeout((params) => {
      dummySubject.next(response);
      dummySubject.complete();
      return response;
      // }, 1000);
    })).subscribe((params) => {

    }, (err) => {
      dummySubject.error(err);
      // dummySubject.complete();
      // return response;
    });

    return dummySubject;
  }
  getInfo(view: string) {
    return this.http.post(this.BASE_URL + this.BROWSER_INFO, { view });
  }


  request(requestedScreen: string, requestingScreen: string,
    screenValue: any = null, schema: any = null, initiatedBy = null, queryParams: any = null, customVars: any = null) {
    return this.http.post(this.BASE_URL + this.REQUEST + '/' + requestedScreen,
      { screen: requestingScreen, schema, queryParams, screenValue, initiatedBy, customVars })
      .pipe(delay(0));
  }


  stringifyObject(obj: any) {
    const json = JSON.stringify(obj);
    const withStrings = JSON.parse(json, (key, val) => (
      typeof val !== 'object' && val !== null ? String(val) : val
    ));
    return withStrings;
  }


}
