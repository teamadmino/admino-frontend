import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

export interface BeolvasasData {
  version: number;
  scanner: number;
  data: BeolvasasEvent[];
}
export interface BeolvasasEvent {
  datum?: any;
  id?: number;
  dolgozo?: number;
  dolgozoNev?: string;

  type: 'sztorno' | 'bala' | 'dolgozoBe' | 'dolgozoKi' | 'pantNyit' | 'pantZar';

  // sztorno
  eredetiBeolvasas?: BeolvasasEvent;

  // bala
  bala?: string;
  utca?: number;
  fakk?: number;
  manualis?: boolean;

}
@Injectable()
export class ScannerService {

  keyboardMode = false;

  JSON_DOLGOZOK = 'dolgozok';
  JSON_UTCAK = 'utcak';
  JSON_VERSION = 'version';
  JSON_BEOLVASASOK = 'beolvasasok';
  JSON_SYNCID = 'syncid';
  JSON_SYNCEDTILL = 'syncedTill';
  online = false;

  popups: any[] = [];

  scanner = null;

  // beolvasaschunk = 100;
  beolvasasmax = 1000;

  page: BehaviorSubject<number> = new BehaviorSubject(0);
  next: Subject<null> = new Subject();
  prev: Subject<null> = new Subject();
  newBeolvasasEvent: Subject<BeolvasasEvent> = new Subject();
  newErrorEvent: Subject<{ error: string, description: string }> = new Subject();
  syncEvent: Subject<number> = new Subject();
  syncId = -1;
  syncedTill = 0;
  labels = [
    [{ label: 'Bejelentkezés', iconright: 'navigate_next', func: 'next', color: 'accent' }],

    [{ label: 'Kilépés', iconleft: 'navigate_before', func: 'prev' },
    { label: 'Fakk', iconright: 'navigate_next', func: 'next', color: 'accent' }],

    [{ label: 'Utca', iconleft: 'navigate_before', func: 'prev' },
    { label: 'Adatfelvitel', iconright: 'navigate_next', func: 'next', color: 'accent' }],

    [{ label: 'Utca', iconleft: 'navigate_before', func: 'doubleprev' },
    { label: 'Fakk', iconleft: 'navigate_before', func: 'prev' },
    // { label: 'Frissít', iconleft: 'refresh', func: 'refresh', color: 'accent', disabled: true }
    { label: 'Pántolást nyit', iconright: 'add_circle_outline', func: 'refresh', color: 'accent', disabled: true }
    ]
  ];

  selectedUtca: any = {};
  selectedFakk = null;
  dolgozo: any = {};

  dataLoaded = false;

  version = null;
  dolgozok: { id: number, nev: string }[] = [];
  utcak: { utca: number, raktar: string, fakkok: number }[] = [];

  beolvasasok: BeolvasasData = null;

  logoutTimer = null;
  maxInactivity = 9000000;
  // maxInactivity = 2000;
  logoutRestartEvent: Subject<number> = new Subject();
  logoutRestartEventSub;
  init() {
    this.logoutRestartEventSub = this.logoutRestartEvent.pipe(debounceTime(500)).subscribe((params) => {
      if (this.page.value > 0) {
        this.restartTimer();
      }
    });
  }

  loadConfig() {

    this.utcak = JSON.parse(localStorage.getItem(this.JSON_UTCAK));
    this.dolgozok = JSON.parse(localStorage.getItem(this.JSON_DOLGOZOK));
    this.version = JSON.parse(localStorage.getItem(this.JSON_VERSION));
    this.syncId = JSON.parse(localStorage.getItem(this.JSON_SYNCID));
    this.syncId = this.syncId === undefined || this.syncId === null ? -1 : this.syncId;

    this.syncedTill = JSON.parse(localStorage.getItem(this.JSON_SYNCEDTILL));
    this.syncedTill = this.syncedTill === undefined || this.syncedTill === null ? 0 : this.syncedTill;

    this.beolvasasok = JSON.parse(localStorage.getItem(this.JSON_BEOLVASASOK));
    this.beolvasasok = this.beolvasasok ? this.beolvasasok : { version: this.version, scanner: this.scanner, data: [] };
  }

  updateConfig(incomingVersion, utcak, dolgozok) {
    if (this.version === undefined || this.version < incomingVersion) {
      localStorage.setItem(this.JSON_UTCAK, JSON.stringify(utcak));
      localStorage.setItem(this.JSON_DOLGOZOK, JSON.stringify(dolgozok));
      localStorage.setItem(this.JSON_VERSION, JSON.stringify(incomingVersion));
      this.dolgozok = dolgozok;
      this.utcak = utcak;
      this.version = incomingVersion;
    }
  }

  setSyncedTill(incomingSyncedTill) {
    this.syncedTill = incomingSyncedTill;
    localStorage.setItem(this.JSON_SYNCEDTILL, JSON.stringify(incomingSyncedTill));
  }

  logActivity() {
    this.logoutRestartEvent.next();
  }
  restartTimer() {
    this.stopLogoutTimer();
    this.logoutTimer = setTimeout((params) => {
      this.popups.push({});
      this.page.next(0);
      this.reset();
    }, this.maxInactivity);
  }
  stopLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = null;
  }

  getUnsyncedBeolvasasok() {
    const filteredBeolv = cloneDeep(this.beolvasasok);
    if (filteredBeolv.data) {
      filteredBeolv.data = filteredBeolv.data.filter((beolv: BeolvasasEvent) => {
        return beolv.id > this.syncedTill;
      });
    }
    return filteredBeolv;
  }

  addBeolvasas(beolvasas: BeolvasasEvent) {
    // this.beolvasasok.push(value);
    if (this.syncId - this.syncedTill >= this.beolvasasmax) {
      this.newErrorEvent.next({ error: 'Memória betelt', description: 'Kérem szinkronizáljon a szerverrel' });
      return false;
    } else {
      if (this.beolvasasok.data.length >= this.beolvasasmax) {
        this.beolvasasok.data.splice(0, 1);
      }

      this.syncId++;
      beolvasas.id = this.syncId;
      beolvasas.datum = new Date();
      beolvasas.dolgozo = this.dolgozo.id;
      beolvasas.dolgozoNev = this.dolgozo.nev;

      if (!this.beolvasasok) {
        this.beolvasasok = { version: this.version, scanner: this.scanner, data: [] };
      }
      if (!this.beolvasasok.data) {
        this.beolvasasok.data = [];
      }

      this.beolvasasok.version = this.version;
      this.beolvasasok.scanner = this.scanner;
      this.beolvasasok.data.push(beolvasas);

      localStorage.setItem(this.JSON_BEOLVASASOK, JSON.stringify(this.beolvasasok));
      localStorage.setItem(this.JSON_SYNCID, JSON.stringify(this.syncId));
      this.newBeolvasasEvent.next(beolvasas);
      return true;
    }

    // localStorage.setItem('beolvasas', JSON.stringify(this.JSON_BEOLVASASOK));
  }

  // syncBeolvasasok(syncedTill: number) {
  //   this.syncedTill = syncedTill;
  //   if (this.beolvasasok && this.beolvasasok.data) {
  //     const filteredData = this.beolvasasok.data.filter((beolv: Beolvasas) => {
  //       return beolv.id > syncedTill;
  //     });
  //     this.beolvasasok.data = filteredData;
  //   }
  //   localStorage.setItem(this.JSON_BEOLVASASOK, JSON.stringify(this.beolvasasok));
  //   this.syncEvent.next(this.syncedTill);
  // }


  reset() {
    this.selectedFakk = null;
    this.selectedUtca = null;
    this.dolgozo = null;
  }
  destroy() {
    this.stopLogoutTimer();
    if (this.logoutRestartEventSub) {
      this.logoutRestartEventSub.unsubscribe();
      this.logoutRestartEventSub = null;
    }
  }
  constructor() { }
}
