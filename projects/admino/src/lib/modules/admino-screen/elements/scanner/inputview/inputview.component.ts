import { Beolvasas } from './../scanner.service';
import { ScannerView } from './../scannerview';
import { FormControl } from '@angular/forms';
import { Component, OnInit, HostListener, Input, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { codeAnimation } from './scanner.animation';

@Component({
  selector: 'admino-inputview',
  templateUrl: './inputview.component.html',
  styleUrls: ['./inputview.component.scss'],
  animations: [codeAnimation]

})
export class InputviewComponent extends ScannerView implements OnInit, OnDestroy {
  @ViewChild('virtualScrollRef', { static: true, read: ElementRef }) virtualScrollRef: ElementRef;
  // control: FormControl = new FormControl('');
  // selectedId = 0;
  currentRead = '';
  currentManualRead = '';
  hiderOpacity = 1;
  showAnim = false;
  animTimeout;
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
  scrollEvt() {
    const scrollPos = this.virtualScrollRef.nativeElement.scrollTop + this.virtualScrollRef.nativeElement.offsetHeight;
    const max = this.virtualScrollRef.nativeElement.scrollHeight;
    if (scrollPos > max - 300) {
      this.hiderOpacity = (max - scrollPos) / 300;
    } else {
      this.hiderOpacity = 1;
    }
  }

  ngOnInit() {
    // this.control.setValue(this.scannerService.beolvasasok);
    // for (let i = 0; i < 1000; i++) {
    //   this.scannerService.syncId++;

    //   const val = this.getControlValue();
    //   const reading: Beolvasas = {
    //     bala: 'asdasd', datum: new Date(), id: this.scannerService.syncId, dolgozo: this.scannerService.dolgozo.id,
    //     utca: this.scannerService.selectedUtca.utca,
    //     fakk: this.scannerService.selectedFakk,
    //     manualis: false
    //   };
    //   val.data.push(reading);

    //   // this.scannerService.beolvasasok = val;
    //   this.scannerService.updateBeolvasas(val, reading.id);

    // }
  }



  @HostListener('document:keydown', ['$event'])
  onManualInput(e) {
    if (e.key === 'Backspace') {
      this.currentManualRead = this.currentManualRead.substring(0, this.currentManualRead.length - 1);
    }
    if (e.key === 'Home') {
      const randomcode = Math.floor(Math.random() * 1000000) + '/' + '20';
      this.codeDetected(randomcode, true);
      // this.scannerService.setSyncedTill(this.scannerService.syncedTill + 3);
    }
    if (e.key === 'Enter') {
      this.codeDetected(this.currentManualRead, true);
      this.currentManualRead = '';
      this.currentRead = '';
    }
    if (e.key === 'Escape') {
      this.onPrev();
    }
  }

  isNumber(evt) {
    return isFinite(evt.key);
  }

  @HostListener('document:keypress', ['$event'])
  onInput(e) {
    if ((this.isNumber(e) || e.key === '/') && this.currentManualRead.length <= 10) {
      this.currentManualRead += e.key;
    }
    this.currentRead += e.key;
    if (this.currentRead.endsWith('_+')) {
      this.currentRead = '_++';
    }
    if (this.currentRead.startsWith('_++') && this.currentRead.endsWith('+_')) {
      this.codeDetected(this.currentRead.substring(3, this.currentRead.length - 2));
    }
  }


  //  8 vagy 10 számjegy, utolsó 7 számjegye a bálaszám, előtte levő pedig az évszám
  // 000 4444444
  // yyy balaszam
  // y balaszam
  // 0 4444444
  // az évszám (databaseDate + egy év max)

  // kézzel írva 7 számjegy max de lehet + perjel + évszám kétszámjegy 00-21ig idén (databaseDate + egy év max)
  // manuálisan is lehet vonalkódot beírni

  getControlValue() {
    let val = this.scannerService.beolvasasok;
    if (!val) {
      val = {
        version: this.scannerService.version,
        scanner: this.scannerService.scanner,
        data: []
      };
    }
    if (!val.data) {
      val.data = [];
    }
    return val;
  }

  codeDetected(code, manualis = false) {
    this.scannerService.syncId++;
    const val = this.getControlValue();
    const reading: Beolvasas = {
      bala: code, datum: new Date(), id: this.scannerService.syncId, dolgozo: this.scannerService.dolgozo.id,
      utca: this.scannerService.selectedUtca.utca,
      fakk: this.scannerService.selectedFakk,
      manualis
    };
    val.data.push(reading);

    // this.scannerService.beolvasasok = val;
    this.scannerService.updateBeolvasas(val, reading.id);

    this.currentRead = '';
    this.currentManualRead = '';
    this.playAnim();
    this.virtualScrollRef.nativeElement.scrollTop = 0;
    this.scrollEvt();
  }

  playAnim() {
    // if (this.animTimeout) {
    //   clearTimeout(this.animTimeout);
    // }
    this.showAnim = false;
    this.cd.detectChanges();
    this.showAnim = true;
    // this.animTimeout = setTimeout((params) => {
    //   this.showAnim = false;
    // }, 1000);
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
  // codeClicked(i) {
  //   this.selectedId = i;
  // }
  getCodes() {
    const val = this.getControlValue();
    return val.data.slice().reverse();
  }
  trackByFn(index, item) {
    return item.id;
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
  ngOnDestroy() {
    // if (this.animTimeout) {
    //   clearInterval(this.animTimeout)
    // }
  }

}
