import { AdminoKeyboardComponent } from "./../../../../admino-keyboard/admino-keyboard/admino-keyboard.component";
import { layout2, LAYOUT1 } from "./../../../../admino-keyboard/admino-keyboard.layouts";
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormControl, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";
import { ScannerView } from "../scannerview";
import { map } from "rxjs/operators";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";

@Component({
  selector: "admino-fakkview",
  templateUrl: "./fakkview.component.html",
  styleUrls: ["./fakkview.component.scss"],
})
export class FakkviewComponent extends ScannerView implements OnInit, AfterViewInit {
  // @ViewChild('fakkRef', { static: true, read: ElementRef }) fakkRef: ElementRef;
  @ViewChild("triggerFakk", { static: true, read: MatAutocompleteTrigger })
  triggerFakkRef: MatAutocompleteTrigger;
  @ViewChild("keyboardRef", { static: true, read: AdminoKeyboardComponent })
  keyboardRef: AdminoKeyboardComponent;

  control = new FormControl(null, this.validateFakk.bind(this));
  fakkok = [];
  // filteredFakkok: Observable<any[]>;

  layout1 = layout2;
  ngOnInit() {
    this.updateFakk();
    // this.filteredFakkok = this.control.valueChanges
    //   .pipe(
    //     // startWith(''),
    //     map(value => {
    //       return this._filterFakk(value);
    //     })
    //   );
  }
  keyInput(e) {
    this.keyEvent(e.key);
  }
  keyEvent(char) {
    const currentval = this.control.value !== null ? this.control.value : "";
    if (this.isNumber(char) && this.fakkExists(char)) {
      if (currentval.length < 1) {
        this.control.setValue(currentval + char);
      } else {
        this.control.setValue(char);
      }
    }
    this.scannerService.selectedFakk = this.control.value;
  }

  // handleInput(e, maxlength) {
  //   if (e.target.value !== undefined && e.target.value !== null
  //     && (e.target.value.toString().length > maxlength || !this.fakkExists(e.target.value))) {
  //     e.target.value = e.target.value.toString().substring(0, e.target.value.length - 1);
  //     this.control.setValue(e.target.value);
  //   }
  //   this.scannerService.selectedFakk = this.control.value;
  // }
  ngAfterViewInit() {
    // this.fakkRef.nativeElement.focus();
    // setTimeout((params) => {
    //   this.utcaRef.nativeElement.select();
    // },)
    // this.fakkRef.nativeElement.select();
    setTimeout((params) => {
      this.control.markAsUntouched();
      this.control.markAsPristine();
    }, 10);
  }

  updateFakk() {
    const found = this.scannerService.utcak.find((utca) => {
      return utca.utca === this.scannerService.selectedUtca.utca;
    });
    if (found) {
      if (found.fakkok === 0) {
        this.fakkok = Array.from(Array(1).keys());
        console.log(this.fakkok);
      } else {
        this.fakkok = Array.from(Array(found.fakkok + 1).keys());
        this.fakkok.shift();
      }

      this.scannerService.selectedUtca = found;
      setTimeout((params) => {
        // this.fakkRef.nativeElement.focus();
        // this.fakkRef.nativeElement.select();
      });
    } else {
      this.fakkok = [];
    }
    this.cd.detectChanges();
    this.keyboardRef.updateAvailable();
  }
  onFakkChanged() {
    this.scannerService.selectedFakk = this.control.value;
  }
  validateFakk(control: AbstractControl) {
    if (this.fakkExists(control.value)) {
      return null;
    } else {
      return { validFakk: true };
    }
  }

  fakkExists(val): boolean {
    if (val === undefined || val === null) {
      return false;
    }
    const found =
      this.fakkok &&
      this.fakkok.find((fakk) => {
        return fakk.toString() === val.toString();
      });

    return found === undefined || found === null ? false : true;
  }

  onNext() {
    if (this.control.valid) {
      this.scannerService.page.next(3);
    } else {
      this.control.markAsTouched();
    }
  }
  // private _filterFakk(value: any): any[] {
  //   if (value === null || value === undefined || value === '') {
  //     return this.fakkok;
  //   }
  //   const filterValue = value;
  //   return this.fakkok.filter(option => option.toString().includes(filterValue.toString()));
  // }
}
