import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ScannerView } from '../scannerview';

@Component({
  selector: 'admino-utcafakkview',
  templateUrl: './utcafakkview.component.html',
  styleUrls: ['./utcafakkview.component.scss']
})
export class UtcafakkviewComponent extends ScannerView implements OnInit, AfterViewInit {
  @ViewChild('utcaRef', { static: true, read: ElementRef }) utcaRef: ElementRef;
  @ViewChild('fakkRef', { static: true, read: ElementRef }) fakkRef: ElementRef;
  formGroup = new FormGroup({
    utca: new FormControl(null, this.validateUtca.bind(this)),
    fakk: new FormControl(null, this.validateFakk.bind(this)),
  });
  filteredUtcak: Observable<any[]>;
  filteredFakkok: Observable<any[]>;

  fakkok: number[];





  ngOnInit() {
    this.filteredUtcak = this.formGroup.get('utca').valueChanges
      .pipe(
        // startWith(''),
        map(value => {

          return this._filter(value);
        })
      );
    this.filteredFakkok = this.formGroup.get('fakk').valueChanges
      .pipe(
        // startWith(''),
        map(value => {
          return this._filterFakk(value);
        })
      );



  }
  ngAfterViewInit() {
    this.formGroup.get('utca').setValue(this.scannerService.selectedUtca && this.scannerService.selectedUtca.utca);
    this.onUtcaChanged();
    this.utcaRef.nativeElement.focus();
  }
  onUtcaChanged() {
    this.formGroup.get('fakk').setValue(null);
    this.formGroup.get('fakk').markAsUntouched();
    this.updateFakk();
  }
  updateFakk() {
    const found = this.scannerService.utcak.find((utca) => {
      return utca.utca === this.formGroup.get('utca').value;
    });
    if (found) {
      if (found.fakkok === 0) {
        this.fakkok = Array.from(Array(1).keys());
        console.log(this.fakkok)
      } else {
        this.fakkok = Array.from(Array(found.fakkok + 1).keys());
        this.fakkok.shift();
      }

      this.scannerService.selectedUtca = found;
      setTimeout((params) => {
        this.fakkRef.nativeElement.focus();
        this.fakkRef.nativeElement.select();
      });
    } else {
      this.fakkok = [];
    }
  }
  onFakkChanged() {
    this.scannerService.selectedFakk = this.formGroup.get('fakk').value;
  }
  onNext() {
    if (this.formGroup.valid) {
      this.scannerService.page.next(2);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  onPrev() {
    this.scannerService.reset();
    this.scannerService.page.next(this.scannerService.page.value - 1);

  }
  private _filter(value: number): any[] {
    if (value === null || value === undefined) {
      return [];
    }
    const filterValue = value;
    return this.scannerService.utcak.filter(option => option.utca.toString().includes(filterValue.toString()));
  }
  // displayWith(value) {
  //   return (value) => { return value + 100000 }
  // }
  private _filterFakk(value: any): any[] {
    if (value === null || value === undefined || value === '') {
      return this.fakkok;
    }
    const filterValue = value;
    return this.fakkok.filter(option => option.toString().includes(filterValue.toString()));
  }

  validateUtca(control: AbstractControl) {
    const found = this.scannerService.utcak && this.scannerService.utcak.find((utca) => {
      return control.value !== null && utca.utca.toString() === control.value.toString();
    });
    if (found) {
      return null;

    } else {
      return { validUtca: true }
    }
  }

  validateFakk(control: AbstractControl) {
    const found = this.fakkok && this.fakkok.find((fakk) => {
      return fakk === control.value;
    });
    if (found !== undefined) {
      return null;

    } else {
      return { validFakk: true };
    }
  }
}
