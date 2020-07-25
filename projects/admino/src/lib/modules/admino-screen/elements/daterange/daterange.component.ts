import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
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
})
export class DaterangeComponent extends AdminoScreenElement implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  ngOnInit() {
    this.range.valueChanges.pipe(takeUntil(this.ngUnsubscribe), debounceTime(10)).subscribe((val) => {
      this.control.setValue({
        start: this.convertToJSON(val.start),
        end: this.convertToJSON(val.end),
      });
    });
  }
  convertToJSON(val) {
    if (val) {
      return val.toJSON();
    }
  }
  onChange(changes: { [id: string]: ScreenElementChange }) {}
}
