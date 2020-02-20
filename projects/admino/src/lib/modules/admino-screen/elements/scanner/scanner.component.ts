import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'admino-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('scanner', { static: false }) scanner: ZXingScannerComponent;

  showPreloader = true;
  successfullScan = false;
  allowedFormats = [
    // BarcodeFormat.CODABAR,
    // BarcodeFormat.ITF,
    // BarcodeFormat.EAN_13,
    // BarcodeFormat.EAN_8,
    // BarcodeFormat.CODE_39,
    // BarcodeFormat.CODE_93,
    // BarcodeFormat.CODE_128,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.UPC_EAN_EXTENSION,
  ];
  timeoutHelper;
  ngOnInit() {
    // this.scanner.

  }
  camerasFoundHandler(e) {
    this.showPreloader = false;
    console.log(e);
  }
  camerasNotFoundHandler(e) {
    // console.log(e);
  }
  scanSuccessHandler(e) {
    let val = this.control.value;
    if (!val) {
      val = [];
    }

    const found = val.find((code) => {
      return code.code === e;
    })

    if (!found) {
      val.push({ code: e, date: new Date() });
      this.control.setValue(val);
      this.successfullScan = false;
      this.directive.cd.detectChanges();
      this.successfullScan = true;
      this.directive.cd.detectChanges();
      if (this.timeoutHelper) {
        clearTimeout(this.timeoutHelper);
      }
      this.timeoutHelper = setTimeout((params) => {
        this.successfullScan = false;
      }, 2000);
    }
    // console.log(e);
  }
  scanErrorHandler(e) {
    // console.log(e);
  }
  scanFailureHandler(e) {
    // console.log(e);
  }
  scanCompleteHandler(e) {
    console.log(e);
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
    this.directive.cd.detectChanges();
  }
  onDestroy() {
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper);
    }
  }
}
