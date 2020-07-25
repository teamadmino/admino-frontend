import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
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
  selector: "admino-date",
  templateUrl: "./date.component.html",
  styleUrls: ["./date.component.scss"],
  // providers: [
  //   { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ],
})
export class DateComponent extends AdminoScreenElement implements OnInit {
  ngOnInit() {}
}
