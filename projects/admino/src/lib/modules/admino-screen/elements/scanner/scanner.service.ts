import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

export interface BeolvasasData {
  version: number;
  scanner: number;
  data: Beolvasas[];
}
export interface Beolvasas {
  bala: string;
  datum: any;
  id: number;
  dolgozo: number;
  utca: number;
  fakk: number;
  manualis: boolean;
}
@Injectable()
export class ScannerService {

  JSON_DOLGOZOK = 'dolgozok';
  JSON_UTCAK = 'utcak';
  JSON_VERSION = 'version';
  JSON_BEOLVASASOK = 'beolvasasok';
  JSON_SYNCID = 'syncid';
  JSON_SYNCEDTILL = 'syncedTill';
  online = false;


  scanner = null;

  // beolvasaschunk = 100;
  beolvasasmax = 1000;

  page: BehaviorSubject<number> = new BehaviorSubject(0);
  next: Subject<null> = new Subject();
  prev: Subject<null> = new Subject();
  newBeolvasasEvent: Subject<null> = new Subject();
  syncEvent: Subject<number> = new Subject();
  syncId = 0;
  syncedTill = 0;
  labels = [
    ['', 'Bejelentkezés'],
    ['Kilépés', 'Adatfelvitel'],
    ['Utcaválasztás'],
  ];

  selectedUtca: any = {};
  selectedFakk = null;
  dolgozo: any = {};

  dataLoaded = false;

  version = null;
  dolgozok: { id: number, nev: string }[] = [];
  utcak: { utca: number, raktar: string, fakkok: number }[] = [];

  beolvasasok: BeolvasasData = null;




  loadConfig() {
    this.utcak = JSON.parse(localStorage.getItem(this.JSON_UTCAK));
    this.dolgozok = JSON.parse(localStorage.getItem(this.JSON_DOLGOZOK));
    this.version = JSON.parse(localStorage.getItem(this.JSON_VERSION));
    this.syncId = JSON.parse(localStorage.getItem(this.JSON_SYNCID));
    this.syncId = this.syncId === undefined || this.syncId === null ? 0 : this.syncId;

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

  getUnsyncedBeolvasasok() {
    const filteredBeolv = cloneDeep(this.beolvasasok);
    if (filteredBeolv.data) {
      filteredBeolv.data = filteredBeolv.data.filter((beolv: Beolvasas) => {
        return beolv.id > this.syncedTill;
      });
    }
    return filteredBeolv;
  }

  updateBeolvasas(beolvasasok, syncid) {
    // this.beolvasasok.push(value);
    this.beolvasasok = cloneDeep(beolvasasok);

    if (this.beolvasasok && this.beolvasasok.data) {
      this.beolvasasok.version = this.version;
      this.beolvasasok.scanner = this.scanner;
      if (this.beolvasasok.data.length > this.beolvasasmax) {
        this.beolvasasok.data.splice(0, 1);
      }
    }

    localStorage.setItem(this.JSON_BEOLVASASOK, JSON.stringify(this.beolvasasok));
    localStorage.setItem(this.JSON_SYNCID, JSON.stringify(syncid));
    this.newBeolvasasEvent.next();
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
  constructor() { }
}
