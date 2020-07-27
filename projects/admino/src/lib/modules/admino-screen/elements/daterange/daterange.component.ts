import { Component, OnInit, ElementRef, ChangeDetectorRef } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { FormGroup, FormControl } from "@angular/forms";
import { ScreenElementChange } from "../../admino-screen.interfaces";
import { takeUntil, debounceTime } from "rxjs/operators";
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "admino-daterange",
  templateUrl: "./daterange.component.html",
  styleUrls: ["./daterange.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class DaterangeComponent extends AdminoScreenElement implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private _adapter: DateAdapter<any>, public el: ElementRef, public cd: ChangeDetectorRef) {
    super(el, cd);
    this._adapter.setLocale("fr");
  }
  ngOnInit() {
    if (this.element.value) {
      this.setVal(this.element.value.start, this.element.value.end);
    }
    if (this.element.locale) {
      this._adapter.setLocale(this.element.locale);
    }
    this.range.valueChanges.pipe(takeUntil(this.ngUnsubscribe), debounceTime(10)).subscribe((val) => {
      this.control.setValue({
        start: this.convertToJSON(val.start),
        end: this.convertToJSON(val.end),
      });
    });
  }
  setVal(start, end) {
    this.range.get("start").setValue(start);
    this.range.get("end").setValue(end);
  }
  convertToJSON(val) {
    if (val) {
      return val.toJSON();
    }
  }
  onChange(changes: { [id: string]: ScreenElementChange }) {
    if (this.element.value) {
      this.setVal(this.element.value.start, this.element.value.end);
    }
    if (changes.locale) {
      this._adapter.setLocale(this.element.locale);
    }
  }
}
