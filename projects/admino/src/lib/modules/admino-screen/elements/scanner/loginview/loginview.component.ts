import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ScannerView } from '../scannerview';
import { FormControl, FormGroup, NgForm, AbstractControl } from '@angular/forms';

@Component({
  selector: 'admino-loginview',
  templateUrl: './loginview.component.html',
  styleUrls: ['./loginview.component.scss']
})
export class LoginviewComponent extends ScannerView implements OnInit {

  formGroup = new FormGroup({
    dolgozo: new FormControl(null, this.validateDolgozo.bind(this))
  });

  // @ViewChild('form', { static: true }) form: ElementRef;
  formSubmitted = false;
  ngOnInit() {
    this.scannerService.dolgozo = null;
  }
  input() {
    this.formSubmitted = false;
    this.formGroup.markAsUntouched();
  }
  onNext() {
    this.formGroup.updateValueAndValidity();
    // this.form.nativeElement.submit();
    const found = this.scannerService.dolgozok.find((el) => {
      return el.id === parseInt(this.formGroup.get('dolgozo').value, 10);
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
      return el.id === parseInt(control.value, 10);
    });
    if (found) {
      return null;

    } else {
      return { validDolgozo: true }
    }
  }

}
