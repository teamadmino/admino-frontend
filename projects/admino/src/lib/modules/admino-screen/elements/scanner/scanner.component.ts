import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { codeAnimation } from './scanner.animation';

@Component({
  selector: 'admino-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  animations: [codeAnimation]

})
export class ScannerComponent extends AdminoScreenElement implements OnInit {
  selectedId = 0;
  showConfirmationId = -1;
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

  codeDetected(code) {
    let val = this.control.value;
    if (!val) {
      val = [];
    }
    const reading = { code, date: new Date(), synced: false };

    val.push(reading);
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
    if (i !== this.selectedId) {
      this.showConfirmationId = -1;
    }
    this.selectedId = i;
  }
  getCodes() {
    if (!this.control.value) {
      return [];
    }
    return this.control.value.slice().reverse();
  }
  removeCode(code) {
    let val: any[] = this.control.value;
    if (!val) {
      val = [];
    }
    const found = val.find((c) => {
      return c.code === code.code;
    })
    if (found) {
      val.splice(val.indexOf(found), 1);
      this.control.setValue(val);
    }
    this.showConfirmationId = -1;

    this.directive.cd.detectChanges();
  }
  ngOnInit() {
  }



}
