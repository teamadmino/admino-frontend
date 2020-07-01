import { AdminoMenuItem, BackendResponse } from './../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, delay } from 'rxjs/operators';
import { Subject, Observable, ObservableInput } from 'rxjs';
import { AdminoUserService } from './user.service';
import { AdminoSiteService } from './site.service';
import { v4 as uuidv4 } from 'uuid';



@Injectable({
  providedIn: 'root'
})
export class AdminoApiService {

  // BASE_URL = 'http://127.0.0.1:4080';
  // BASE_URL = 'http://192.168.0.101:4080';
  BASE_URL = 'http://localhost:4080';
  LOGIN = '/login';
  BROWSE = '/browse';
  DOWNLOAD = '/download';
  BROWSER_INFO = '/browserinfo';
  REQUEST = '/request';
  PING = '/ping';
  tabId = uuidv4();
  constructor(private http: HttpClient, private user: AdminoUserService, private site: AdminoSiteService) {
  }


  init(baseUrl: string) {
    this.BASE_URL = baseUrl;
  }

  getFirstMenu(menu: AdminoMenuItem) {
    if (menu.children) {
      return (this.getFirstMenu(menu.children[0]));
    } else {
      return menu;
    }
  }
  downloadFile(downloadid: string): Observable<any> {
    return this.http.post(this.BASE_URL + this.DOWNLOAD,
      { downloadid }, { responseType: 'blob' });
  }

  list(view: string, keys: any, cursorpos: number, shift: number, count: number, index: number, before: number = 0, after: number = 0, customVars: any = {}) {
    const dummySubject = new Subject();
    const body = {
      cursor: cursorpos.toString(),
      count: count.toString(),
      keys,
      shift: shift.toString(),
      index: index.toString(),
      table: view,
      before: before.toString(),
      after: after.toString(),
      customVars
    };
    // this.http.post(this.BASE_URL + '/v2ping',
    //   JSON.stringify({ test: 'áÁíÍóÓöÖőŐúÚüÜűŰéÉ' })).pipe(map((response: any) => { })).subscribe();
    this.http.post(this.BASE_URL + this.BROWSE, body).pipe(map((response: any) => {
      // response.data.splice(Math.floor(Math.random() * response.data.length), 0, { id: Math.random().toString() });

      // response.predefinedStyles = [
      //   { background: 'yellow' },
      //   { opacity: 1 },
      //   { opacity: 0.2 },
      // ];
      // // response.colorPaths = [
      // //   'predefinedStyles.background',
      // //   'data.oszlop1def.style.background',
      // // ];
      // const fun = (row) => {
      //   row.oszlop1def = {
      //     predefinedStyleId: 0,
      //     predefinedContainerStyleId: 1,
      //     style: {
      //       // border: '2px solid yellow'
      //     },
      //     containerStyle: {
      //       // 'border-color': 'red',
      //       background: "rgba(255,255,0,0.1)"
      //     },
      //   };

      //   row.oszlop2def = {
      //     predefinedStyleId: 0,
      //     style: {
      //       border: '2px solid lightgreen'
      //     },

      //     predefinedBarStyleId: 2,
      //     bar: {
      //       display: 'block', // csak akkor jelenik meg ha ez meg van határozva
      //       width: Math.random() * 100 + '%',
      //       height: "50%",
      //       top: "25%",
      //       "border-bottom-left-radius": "30px",
      //       'background-color': 'green',
      //       opacity: 0.5,
      //       right: 0,
      //       "transition-duration": "0.25s"
      //     }
      //   };
      // };

      // response.data.forEach(row => {
      //   row.city = "6,65<span style='background:#888888;color:#FFFF00'>0.0</span>";
      // });
      // response.after.forEach(row => {
      //   fun(row);
      // });
      // response.before.forEach(row => {
      //   fun(row);
      // });



      // setTimeout((params) => {
      dummySubject.next(response);
      dummySubject.complete();
      return response;
      // }, 300 + Math.random() * 1000);
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
    screenValue: any = null, schema: any = null, initiatedBy = null, trigger = null, key = null,
    queryParams: any = null, customVars: any = null, activeModifierKeys = []) {
    return this.http.post(this.BASE_URL + this.REQUEST + '/' + requestedScreen,
      { screen: requestingScreen, schema, queryParams, screenValue, initiatedBy, customVars, trigger, key, activeModifierKeys, tabId: this.tabId })
    // .pipe(delay(3000), map((val) => {
    //   // try {
    //   //   val['updateScreen']["elements"][0]['_forceRefresh'] = true;

    //   // } catch (error) {

    //   // }
    //   return val;
    // }));
  }
  getRequest(requestedScreen: string) {
    return this.http.get(this.BASE_URL + this.REQUEST + '/' + requestedScreen);
  }

  ping(screenName) {
    return this.http.post(this.BASE_URL + this.PING, { screenName, tabId: this.tabId });
  }


  stringifyObject(obj: any) {
    const json = JSON.stringify(obj);
    const withStrings = JSON.parse(json, (key, val) => (
      typeof val !== 'object' && val !== null ? String(val) : val
    ));
    return withStrings;
  }


}
