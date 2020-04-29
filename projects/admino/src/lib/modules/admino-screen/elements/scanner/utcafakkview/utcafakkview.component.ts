import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ScannerView } from '../scannerview';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'admino-utcafakkview',
  templateUrl: './utcafakkview.component.html',
  styleUrls: ['./utcafakkview.component.scss']
})
export class UtcafakkviewComponent extends ScannerView implements OnInit, AfterViewInit {
  @ViewChild('utcaRef', { static: true, read: ElementRef }) utcaRef: ElementRef;
  @ViewChild('fakkRef', { static: true, read: ElementRef }) fakkRef: ElementRef;
  @ViewChild('triggerUtca', { static: true, read: MatAutocompleteTrigger }) triggerUtcaRef: MatAutocompleteTrigger;
  @ViewChild('triggerFakk', { static: true, read: MatAutocompleteTrigger }) triggerFakkRef: MatAutocompleteTrigger;
  formGroup = new FormGroup({
    utca: new FormControl(null, this.validateUtca.bind(this)),
    fakk: new FormControl(null, this.validateFakk.bind(this)),
  });
  filteredUtcak: Observable<any[]>;
  filteredFakkok: Observable<any[]>;

  fakkok: number[];

  activeTrigger;



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
  handleInput(e, formcontrolname, maxlength) {
    if (e.target.value !== undefined && e.target.value !== null && e.target.value.toString().length > maxlength) {
      e.target.value = e.target.value.toString().substring(0, maxlength);
      this.formGroup.get(formcontrolname).setValue(e.target.value);
    }
  }
  keyInput(e) {
    this.triggerFakkRef.closePanel();
    this.triggerUtcaRef.closePanel();
    this.activeTrigger.openPanel();
  }

  ngAfterViewInit() {
    this.formGroup.get('utca').setValue(this.scannerService.selectedUtca && this.scannerService.selectedUtca.utca);
    if (this.formGroup.get('utca').value === undefined || this.formGroup.get('utca').value === null) {
      this.activateUtca();
    } else {
      this.onUtcaChanged();

    }
  }

  activateUtca() {
    this.utcaRef.nativeElement.focus();
    this.activeControl = this.formGroup.get('utca');
    this.activeTrigger = this.triggerUtcaRef;
  }

  activateFakk() {
    this.fakkRef.nativeElement.focus();
    this.activeControl = this.formGroup.get('fakk');
    this.activeTrigger = this.triggerFakkRef;
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
        this.activeControl = this.formGroup.get('fakk');
      });
    } else {
      this.fakkok = [];
    }
  }
  onFakkChanged() {
    this.scannerService.selectedFakk = this.formGroup.get('fakk').value;
  }
  onNext() {
    console.log("onNext")
    if (this.formGroup.valid) {
      this.scannerService.page.next(2);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  onPrev() {
    this.scannerService.reset();
    this.scannerService.page.next(0);
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
      return control.value !== null && control.value !== undefined
        && utca.utca !== null && utca.utca !== undefined && utca.utca.toString() === control.value.toString();
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
