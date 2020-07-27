import { Component, OnInit, ElementRef, ChangeDetectorRef } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { ScreenElementChange } from "../../admino-screen.interfaces";
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
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class DateComponent extends AdminoScreenElement implements OnInit {
  ngOnInit() {
    if (this.element.locale) {
      this._adapter.setLocale(this.element.locale);
    }
  }

  constructor(private _adapter: DateAdapter<any>, public el: ElementRef, public cd: ChangeDetectorRef) {
    super(el, cd);
  }

  onChange(changes: { [id: string]: ScreenElementChange }) {
    if (changes.locale) {
      this._adapter.setLocale(this.element.locale);
    }
  }
}
