import { AdminoKeyboardComponent } from "./../../../../admino-keyboard/admino-keyboard/admino-keyboard.component";
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from "@angular/core";
import { FormControl, FormGroup, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { ScannerView } from "../scannerview";
import { MatAutocompleteTrigger } from "@angular/material";
import { layout2 } from "./../../../../admino-keyboard/admino-keyboard.layouts";

@Component({
  selector: "admino-utcaview",
  templateUrl: "./utcaview.component.html",
  styleUrls: ["./utcaview.component.scss"],
})
export class UtcaviewComponent extends ScannerView implements OnInit, AfterViewInit {
  // @ViewChild('utcaRef', { static: true, read: ElementRef }) utcaRef: ElementRef;
  // @ViewChild('triggerUtca', { static: true, read: MatAutocompleteTrigger }) triggerUtcaRef: MatAutocompleteTrigger;
  control = new FormControl(null, this.validateUtca.bind(this));
  @ViewChild("keyboardRef", { static: true, read: AdminoKeyboardComponent })
  keyboardRef: AdminoKeyboardComponent;

  filteredUtcak: Observable<any[]>;

  // fakkok: number[];

  layout1 = layout2;
  availableCharacters = null;
  ngOnInit() {
    // this.filteredUtcak = this.control.valueChanges
    //   .pipe(
    //     // startWith(''),
    //     map(value => {

    //       return this._filter(value);
    //     })
    //   );
    // this.onUtcaChanged();
    if (this.scannerService.selectedUtca) {
      const found = this.utcaExist(this.scannerService.selectedUtca.utca);
      if (found) {
        this.control.setValue(this.scannerService.selectedUtca.utca.toString());
      } else {
        this.control.setValue(null);
        this.scannerService.selectedUtca = null;
      }
    }
  }
  keyInput(e) {
    this.keyEvent(e.key);
  }
  keyEvent(char) {
    this.scannerService.logActivity();
    const currentval = this.control.value !== null ? this.control.value.toString() : "";
    if (char === "Backspace") {
      if (currentval !== null && currentval.toString().length > 0) {
        this.control.setValue(currentval.toString().slice(0, currentval.toString().length - 1));
      }
    } else if (this.isNumber(char)) {
      // if (this.getAvailableCharaters().indexOf(parseInt(char, 10)) > -1) {
      //   this.control.setValue(currentval + char.toString());
      // }
      if (currentval !== null && currentval.length < 3) {
        this.control.setValue(currentval + char);
      } else {
        this.control.setValue(char);
      }
    }
    this.onUtcaChanged();
  }

  // handleInput(e, maxlength) {
  //   if (e.target.value !== undefined && e.target.value !== null &&
  //     (e.target.value.toString().length > maxlength || !this.utcaExist(e.target.value))) {
  //     e.target.value = e.target.value.toString().substring(0, e.target.value.length - 1);
  //     this.control.setValue(e.target.value);
  //   }
  //   this.onUtcaChanged();
  // }

  ngAfterViewInit() {
    // this.utcaRef.nativeElement.focus();
    // this.control.setValue(this.scannerService.selectedUtca && this.scannerService.selectedUtca.utca);
    // setTimeout((params) => {
    //   this.utcaRef.nativeElement.select();
    // })

    // this.activateUtca();
    this.onUtcaChanged();
  }
  // onOptionActivated(e) {
  //   this.onUtcaChanged();
  // }
  onUtcaChanged() {
    const found = this.utcaExist(this.control.value);
    if (found) {
      this.scannerService.selectedUtca = found;
    } else {
      this.control.setValue(null);
      this.scannerService.selectedUtca = null;
    }
    this.availableCharacters = this.getAvailableCharaters();
    this.keyboardRef.availableCharacters = this.availableCharacters;
    this.keyboardRef.updateAvailable();
    this.scannerService.selectedFakk = null;
  }

  getAvailableCharaters() {
    const nextCharNum = this.control.value !== undefined && this.control.value !== null ? this.control.value.length : 0;
    const possibleValues = [];

    this.scannerService.utcak
      .filter((utca) => {
        if (this.control.value !== undefined && this.control.value !== null) {
          return utca.utca.toString().startsWith(this.control.value.toString());
        } else {
          return true;
        }
      })
      .forEach((utca) => {
        // if(utca.utca[nextCharNum]);
        if (utca.utca !== undefined) {
          const char = utca.utca.toString()[nextCharNum];
          if (char !== undefined) {
            const parsedChar = parseInt(char, 10);
            if (possibleValues.indexOf(parsedChar) < 0) {
              possibleValues.push(parsedChar);
            }
          }
        }
      });
    return possibleValues;
  }

  utcaExist(utca: number) {
    if (utca === undefined || utca === null) {
      return false;
    }
    const found =
      this.scannerService.utcak &&
      this.scannerService.utcak.find((_utca) => {
        return _utca.utca !== null && _utca.utca !== undefined && _utca.utca.toString() === utca.toString();
      });
    return found;
  }

  onNext() {
    if (this.control.valid) {
      this.onUtcaChanged();
      this.scannerService.page.next(2);
    } else {
      this.control.markAsTouched();
    }
  }
  onPrev() {
    this.scannerService.reset();
    this.scannerService.page.next(0);
  }
  private _filter(value: number): any[] {
    if (value === null || value === undefined) {
      return [];
    }
    const filterValue = value;
    return this.scannerService.utcak.filter((option) => option.utca.toString().includes(filterValue.toString()));
  }
  // displayWith(value) {
  //   return (value) => { return value + 100000 }
  // }

  validateUtca(control: AbstractControl) {
    if (this.utcaExist(control.value)) {
      return null;
    } else {
      return { validUtca: true };
    }
  }
}
