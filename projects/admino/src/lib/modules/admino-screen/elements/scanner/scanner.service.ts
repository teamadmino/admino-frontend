import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ScannerService {

  page: BehaviorSubject<number> = new BehaviorSubject(2);
  next: Subject<null> = new Subject();
  prev: Subject<null> = new Subject();

  labels = [
    ['', 'Bejelentkezés'],
    ['Kilépés', 'Adatfelvitel'],
    ['Utcaválasztás', 'Frissités'],
  ];

  selectedUtca = { utca: 100, raktar: 'Főraktár' };
  selectedFakk = 1;
  dolgozo = null;
  version = null;

  dolgozok: { id: number, nev: string }[] = [
    { id: 1111, nev: 'Nagy Lajos' },
    { id: 2222, nev: 'Kis Kálmán' },
    { id: 3333, nev: 'Három Alfréd' },
    { id: 4444, nev: 'Négy István' },
    { id: 5555, nev: 'Kovács Béla' },
  ];

  utcak: { utca: number, raktar: string, fakkok: number }[] = [
    { utca: 100, raktar: 'Főraktár', fakkok: 1000 },
    { utca: 101, raktar: 'Kisraktár', fakkok: 40 },
    { utca: 102, raktar: 'Spájz', fakkok: 5 },
    { utca: 103, raktar: 'Cipősdoboz', fakkok: 100 },
    { utca: 104, raktar: 'Főraktár', fakkok: 10 },
    { utca: 105, raktar: 'Kisraktár', fakkok: 40 },
    { utca: 106, raktar: 'Spájz', fakkok: 5 },
    { utca: 107, raktar: 'Cipősdoboz', fakkok: 100 },
    { utca: 108, raktar: 'Főraktár', fakkok: 10 },
    { utca: 109, raktar: 'Kisraktár', fakkok: 40 },
    { utca: 110, raktar: 'Spájz', fakkok: 5 },
    { utca: 111, raktar: 'Cipősdoboz', fakkok: 100 },
    { utca: 112, raktar: 'Főraktár', fakkok: 10 },
    { utca: 113, raktar: 'Kisraktár', fakkok: 40 },
    { utca: 114, raktar: 'Spájz', fakkok: 5 },
    { utca: 115, raktar: 'Cipősdoboz', fakkok: 100 },
  ];


  constructor() { }
}
