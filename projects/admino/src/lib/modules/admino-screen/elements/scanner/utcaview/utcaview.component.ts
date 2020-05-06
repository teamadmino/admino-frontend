import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ScannerView } from '../scannerview';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'admino-utcaview',
  templateUrl: './utcaview.component.html',
  styleUrls: ['./utcaview.component.scss']
})
export class UtcaviewComponent extends ScannerView implements OnInit, AfterViewInit {
  @ViewChild('utcaRef', { static: true, read: ElementRef }) utcaRef: ElementRef;
  // @ViewChild('triggerUtca', { static: true, read: MatAutocompleteTrigger }) triggerUtcaRef: MatAutocompleteTrigger;
  control = new FormControl(null, this.validateUtca.bind(this));

  filteredUtcak: Observable<any[]>;

  fakkok: number[];


  ngOnInit() {
    this.filteredUtcak = this.control.valueChanges
      .pipe(
        // startWith(''),
        map(value => {

          return this._filter(value);
        })
      );
    this.onUtcaChanged();

  }
  handleInput(e, maxlength) {


    if (e.target.value !== undefined && e.target.value !== null &&
      (e.target.value.toString().length > maxlength || !this.utcaExist(e.target.value))) {
      e.target.value = e.target.value.toString().substring(0, e.target.value.length - 1);
      this.control.setValue(e.target.value);
    }
    this.onUtcaChanged();
  }


  ngAfterViewInit() {
    this.utcaRef.nativeElement.focus();
    this.control.setValue(this.scannerService.selectedUtca && this.scannerService.selectedUtca.utca);
    setTimeout((params) => {
      this.utcaRef.nativeElement.select();
    })

    // this.activateUtca();

  }
  onOptionActivated(e) {
    console.log(e)
    this.onUtcaChanged();
  }
  onUtcaChanged() {
    const found = this.utcaExist(this.control.value);
    if (found) {
      this.scannerService.selectedUtca = found;
    }
    this.scannerService.selectedFakk = null;
  }

  utcaExist(utca: number) {
    if (utca === undefined || utca === null) {
      return false;
    }
    const found = this.scannerService.utcak && this.scannerService.utcak.find((_utca) => {
      return _utca.utca !== null && _utca.utca !== undefined && _utca.utca.toString() === utca.toString();
    });
    return found;
  }

  onNext() {
    if (this.control.valid) {
      this.onUtcaChanged();
      this.scannerService.page.next(2);
    } else {
      this.control.markAsTouched();
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

  validateUtca(control: AbstractControl) {

    if (this.utcaExist(control.value)) {
      return null;
    } else {
      return { validUtca: true }
    }
  }

}
