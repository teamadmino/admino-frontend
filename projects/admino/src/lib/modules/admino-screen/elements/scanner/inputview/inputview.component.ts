import { BeolvasasEvent } from "./../scanner.service";
import { ScannerView } from "./../scannerview";
import { FormControl } from "@angular/forms";
import {
  Component,
  OnInit,
  HostListener,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { codeAnimation } from "./scanner.animation";
import { padStart } from "lodash";

@Component({
  selector: "admino-inputview",
  templateUrl: "./inputview.component.html",
  styleUrls: ["./inputview.component.scss"],
  animations: [codeAnimation],
})
export class InputviewComponent extends ScannerView implements OnInit {
  // control: FormControl = new FormControl('');
  // selectedId = 0;
  currentRead = "";
  currentManualRead = "";
  errorMessage = {
    error: "Sikertelen beolvasás",
    description: "Nem megfelelő formátum",
  };

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
  @Input() testData: string[] = [];
  testDataId = 0;
  // sample = [
  //   '123/4',
  //   '',
  //   '0192395904',
  //   '1',
  //   '82395904',
  //   'asdgarga',
  //   '5345345234534254564536354645365464564356435645363456456',
  //   '1234567890',
  //   '11111111',
  //   '00000000',
  //   '1111111111',
  //   '0000000000',
  //   '2222222222',
  //   '123/04',
  //   '123/4',
  //   '123/34',
  //   '123/14',
  //   '0/1',
  //   '1/0',
  //   '0/0',
  //   '123/21',
  //   '123/22',
  //   '123456789',
  //   '123/56/89',
  //   '99/99',
  //   '1/1',
  //   '///////',
  //   '543/21',
  //   '54O/21',
  //   '/21',
  //   '1234567891/12',
  //   '12/'
  // ];

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

  @HostListener("document:keydown", ["$event"])
  onManualInput(e) {
    if (e.key === "Backspace") {
      this.currentManualRead = this.currentManualRead.substring(
        0,
        this.currentManualRead.length - 1
      );
    } else if (e.key === "End" || e.code === "Minus") {
      e.preventDefault();
      this.codeDetected(this.testData[this.testDataId], false);
      this.testDataId++;
      if (this.testDataId >= this.testData.length) {
        this.testDataId = 0;
      }
    } else if (e.key === "Home") {
      for (let i = 0; i < 50; i++) {
        this.codeDetected(this.testData[this.testDataId], false);
        this.testDataId++;
        if (this.testDataId >= this.testData.length) {
          this.testDataId = 0;
        }
      }
      // this.scannerService.setSyncedTill(this.scannerService.syncedTill + 3);
    } else if (e.key === "Enter") {
      if (
        this.validateInput(this.currentManualRead, new Date().getFullYear() + 1)
      ) {
        this.codeDetected(this.currentManualRead, true);
        this.currentManualRead = "";
        this.currentRead = "";
      } else if (this.currentManualRead.length > 0) {
        this.scannerService.newErrorEvent.next(this.errorMessage);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.onPrev();
    }
  }

  @HostListener("document:keypress", ["$event"])
  onInput(e) {
    if (
      (this.isNumber(e.key) || e.key === "/") &&
      this.currentManualRead.length < 10
    ) {
      this.currentManualRead += e.key;
    }
    this.currentRead += e.key;
    if (this.currentRead.endsWith("_+")) {
      this.currentRead = "_++";
    }
    if (this.currentRead.startsWith("_++") && this.currentRead.endsWith("+_")) {
      this.codeDetected(
        this.currentRead.substring(3, this.currentRead.length - 2)
      );
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

  // getControlValue() {
  //   let val = this.scannerService.beolvasasok;
  //   if (!val) {
  //     val = {
  //       version: this.scannerService.version,
  //       scanner: this.scannerService.scanner,
  //       data: []
  //     };
  //   }
  //   if (!val.data) {
  //     val.data = [];
  //   }
  //   return val;
  // }

  codeDetected(code, manualis = false) {
    const validated = this.validateInput(code, new Date().getFullYear() + 1);
    if (validated) {
      // const val = this.getControlValue();
      const reading: BeolvasasEvent = {
        type: "bala",
        bala: validated,
        utca: this.scannerService.selectedUtca.utca,
        fakk: this.scannerService.selectedFakk,
        manualis,
      };
      // val.data.push(reading);
      // this.scannerService.beolvasasok = val;
      this.scannerService.addBeolvasas(reading);

      this.currentRead = "";
      this.currentManualRead = "";
    } else {
      if (!manualis) {
        this.currentRead = "";
        this.currentManualRead = "";
      }
      this.scannerService.newErrorEvent.next(this.errorMessage);
    }
  }

  validateInput(input: string, maxEv: number): string {
    maxEv = maxEv % 100;

    let balaSorszam: string;
    let balaEv: string;
    const perPos: number = input.indexOf("/");
    if (perPos !== -1) {
      balaSorszam = input.substring(0, perPos);
      balaEv = input.substring(perPos + 1);
      if (balaSorszam.length > 7 || balaEv.length > 3 || balaEv.length === 0) {
        return null;
      }
    } else {
      const length: number = input.length;
      if (length !== 8 && length !== 10) {
        return null;
      }
      balaSorszam = input.substring(length - 7, length);
      balaEv = input.substring(0, length - 7);
    }

    //balaSorszam balaEv csak számjegyet tartalmazhat ezen a ponton
    const balaSorszamIsNum = /^\d+$/.test(balaSorszam);
    const balaEvIsNum = /^\d+$/.test(balaEv);

    if (balaSorszamIsNum && balaEvIsNum) {
      const balaSorszamValue: number =
        parseInt("10000000" + balaSorszam, 10) % 10000000;
      const balaEvValue = parseInt("1000" + balaEv, 10) % 1000;

      if (balaSorszamValue === 0 || balaEvValue > maxEv) {
        return null;
      }

      return balaSorszamValue + "/" + padStart(balaEvValue.toString(), 2, "0");
      //String.format('%7d/%02d', balaSorszamValue, balaEvValue);
    } else {
      // console.log(e)
      return null;
    }
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
}
