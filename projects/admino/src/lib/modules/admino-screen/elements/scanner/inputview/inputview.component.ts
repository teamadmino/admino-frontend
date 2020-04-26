import { ScannerView } from './../scannerview';
import { FormControl } from '@angular/forms';
import { Component, OnInit, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import { codeAnimation } from './scanner.animation';

@Component({
  selector: 'admino-inputview',
  templateUrl: './inputview.component.html',
  styleUrls: ['./inputview.component.scss'],
  animations: [codeAnimation]

})
export class InputviewComponent extends ScannerView implements OnInit {

  @Input() control: FormControl;
  selectedId = 0;
  currentRead = '';
  // @HostListener('document:keydown', ['$event'])
  // onInput(e) {
  //   this.val = e;
  //   console.log(e)

  // }
  // @HostListener('document:keydown', ['$event'])
  // onaInput(e) {
  //   this.val = e;
  //   console.log(e)
  // }
  @HostListener('document:keypress', ['$event'])
  onaInput(e) {
    this.currentRead += e.key;
    if (this.currentRead.endsWith('_+')) {
      this.currentRead = '_++';
    }
    if (this.currentRead.startsWith('_++') && this.currentRead.endsWith('+_')) {
      this.codeDetected(this.currentRead.substring(3, this.currentRead.length - 2));
      this.currentRead = '';
    }

  }

  getControlValue() {
    let val = this.control.value;
    if (!val) {
      val = {
        version: this.scannerService.version,
        data: []
      };
    }
    if (!val.data) {
      val.data = [];
    }
    return val;
  }

  codeDetected(code) {
    const val = this.getControlValue();
    const reading = { code, date: new Date(), synced: false };

    val.data.push(reading);
    this.control.setValue(val);
  }
  // @HostListener('document:keypress', ['$event'])
  // onaaInput(e) {
  //   this.val = e;
  //   console.log(e)
  // }
  // @HostListener('document:keyup', ['$event'])
  // onaaInsput(e) {
  //   this.val = e;
  //   console.log(e)
  // }
  codeClicked(i) {
    this.selectedId = i;
  }
  getCodes() {
    const val = this.getControlValue();
    return val.data.slice().reverse();
  }
  // removeCode(code) {
  //   const val = this.getControlValue();

  //   const found = val.data.find((c) => {
  //     return c.code === code.code;
  //   });
  //   if (found) {
  //     val.data.splice(val.data.indexOf(found), 1);
  //     this.control.setValue(val);
  //   }
  //   this.showConfirmationId = -1;

  //   this.cd.detectChanges();
  // }
  ngOnInit() {
  }



}
