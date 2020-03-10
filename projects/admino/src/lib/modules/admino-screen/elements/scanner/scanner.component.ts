import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { codeAnimation } from './scanner.animation';

@Component({
  selector: 'admino-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  animations: [codeAnimation]
})
export class ScannerComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('scannerRef', { static: true }) scanner: ZXingScannerComponent;
  @ViewChild('codesRef', { static: true, read: ElementRef }) codesRef: ElementRef;
  scanEnabled = false;
  cameraEnabled = false;
  alreadyScanned = false;

  selectedId = 0;
  showConfirmationId = -1;

  showPreloader = true;
  showAlreadyScanned = false;
  successfullScan = false;
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
  timeoutHelper;
  cameraTimeout;
  alreadyScannedTimeout;

  audioScanSuccess;
  audioDelete;

  @HostListener('document:mouseup') mouseUpEvent() {
    this.disableScan();
  }

  ngOnInit() {
    this.audioScanSuccess = new Audio();
    this.audioScanSuccess.src = './assets/sound/successfulscan.wav';
    this.audioScanSuccess.load();
    this.audioDelete = new Audio();
    this.audioDelete.src = './assets/sound/delete.wav';
    this.audioDelete.load();
    window.oncontextmenu = function () { return false; }
    // this.scanner.
    // this.scanner.tryHarder = true;
  }
  getCodes() {
    if (!this.control.value) {
      return [];
    }
    return this.control.value.slice().reverse();
  }
  codeClicked(i) {
    if (i !== this.selectedId) {
      this.showConfirmationId = -1;
    }
    this.selectedId = i;
  }
  disableScan() {
    this.scanEnabled = false;
  }
  enableScan() {
    // this.resetCameraTimeout();
    this.cameraEnabled = true;
    this.scanEnabled = true;
    setTimeout((params) => {
      this.scanSuccessHandler(Math.floor(Math.random() * 1000000000));
    }, 500 + 2000 * Math.random())
  }
  // resetCameraTimeout() {
  //   if (this.cameraTimeout) {
  //     clearTimeout(this.cameraTimeout);
  //   }
  //   this.cameraTimeout = setTimeout((params) => {
  //     this.cameraEnabled = false;
  //   }, 5000);
  // }
  camerasFoundHandler(e) {
    this.showPreloader = false;
    console.log(e);
  }
  camerasNotFoundHandler(e) {
    // console.log(e);
  }
  scanSuccessHandler(e) {
    if (!this.scanEnabled) {
      return;
    }
    let val = this.control.value;
    if (!val) {
      val = [];
    }
    const found = val.find((code) => {
      return code.code === e;
    });
    if (!found) {
      const code = { code: e, date: new Date(), synced: false };
      val.push(code);
      this.control.setValue(val);
      this.successfullScan = false;
      this.directive.cd.detectChanges();
      this.successfullScan = true;
      this.directive.cd.detectChanges();
      this.audioScanSuccess.play();
      this.scanEnabled = false;
      if (this.timeoutHelper) {
        clearTimeout(this.timeoutHelper);
      }
      this.timeoutHelper = setTimeout((params) => {
        this.successfullScan = false;
      }, 2000);

      setTimeout((params) => {
        this.updateSync(code, true);
      }, Math.random() * 2000)

      this.selectedId = 0;
      this.codesRef.nativeElement.scrollTop = 0;
    } else {
      this.alreadyScanned = true;
      this.restartAlreadyScannedTimeout();
    }
    // console.log(e);
  }

  restartAlreadyScannedTimeout() {
    if (this.alreadyScannedTimeout) {
      clearTimeout(this.alreadyScannedTimeout);
    }
    this.alreadyScannedTimeout = setTimeout((params) => {
      this.alreadyScanned = false;
    }, 500);
  }


  updateSync(code, isSynced) {
    let val: any[] = this.control.value;
    const found = val.find((c) => {
      return c.code === code.code;
    });

    if (found) {
      found.synced = isSynced;
      val.splice(val.indexOf(found), 1, found);
      this.control.setValue(val);
      this.directive.cd.detectChanges();

    }

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
      this.audioDelete.play();

    }
    this.showConfirmationId = -1;

    this.directive.cd.detectChanges();
  }
  onDestroy() {
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper);
    };
    if (this.alreadyScannedTimeout) {
      clearTimeout(this.alreadyScannedTimeout);
    }
  }
}
