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
  allowedFormats = [
    // BarcodeFormat.CODABAR,
    // BarcodeFormat.ITF,
    // BarcodeFormat.EAN_13,
    // BarcodeFormat.EAN_8,
    // BarcodeFormat.CODE_39,
    // BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    // BarcodeFormat.UPC_A,
    // BarcodeFormat.UPC_E,
    // BarcodeFormat.UPC_EAN_EXTENSION,
  ];

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
    if (val.indexOf(e) < 0) {
      console.log(val);
      val.push(e);
      this.control.setValue(val);
      this.directive.cd.detectChanges();
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
    val.splice(val.indexOf(code), 1);
    this.control.setValue(val);
    this.directive.cd.detectChanges();
  }
}
