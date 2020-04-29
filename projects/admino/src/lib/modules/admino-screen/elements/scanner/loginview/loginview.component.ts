import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ScannerView } from '../scannerview';
import { FormControl, FormGroup, NgForm, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'admino-loginview',
  templateUrl: './loginview.component.html',
  styleUrls: ['./loginview.component.scss']
})
export class LoginviewComponent extends ScannerView implements OnInit {
  @ViewChild('focusRef', { static: true, read: ElementRef }) focusRef: ElementRef;

  formGroup = new FormGroup({
    dolgozo: new FormControl(null, [Validators.minLength(6), this.validateDolgozo.bind(this)])
  });

  // @ViewChild('form', { static: true }) form: ElementRef;
  formSubmitted = false;
  maxAzonositoLength = 6;
  keyInput(e) {
    this.formSubmitted = false;
    this.formGroup.get('dolgozo').markAsPristine();
    this.formGroup.get('dolgozo').markAsUntouched();

  }
  ngOnInit() {
    this.scannerService.reset();
    this.focusRef.nativeElement.focus();
    this.activeControl = this.formGroup.get('dolgozo');
  }
  input(e) {
    // if (this.scannerService.keyboardMode) {
    //   e.preventDefault();
    // }
    // if (e.target.value !== undefined && e.target.value !== null && e.target.value.toString().length > this.maxAzonositoLength) {
    //   e.target.value = e.target.value.toString().substring(0, this.maxAzonositoLength);
    //   this.formGroup.get('dolgozo').setValue(e.target.value);
    // }
    this.formSubmitted = false;
    this.formGroup.get('dolgozo').markAsPristine();
    this.formGroup.get('dolgozo').markAsUntouched();

  }
  onNext() {
    this.formGroup.updateValueAndValidity();
    this.formGroup.markAllAsTouched();
    // this.form.nativeElement.submit();
    const found = this.scannerService.dolgozok.find((el) => {
      return this.formGroup.get('dolgozo').value !== null && el.id === this.formGroup.get('dolgozo').value.toString();
    });
    this.formSubmitted = true;
    if (found) {
      this.scannerService.dolgozo = found;
      this.scannerService.page.next(1);

    } else {
    }
  }
  validateDolgozo(control: AbstractControl) {
    const found = this.scannerService.dolgozok.find((el) => {
      return control.value !== null && el.id === control.value.toString();
    });
    if (found) {
      return null;

    } else {
      return { validDolgozo: true }
    }
  }

}
