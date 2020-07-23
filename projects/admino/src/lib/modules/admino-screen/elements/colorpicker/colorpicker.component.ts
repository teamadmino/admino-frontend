import { takeUntil } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";

@Component({
  selector: "admino-colorpicker",
  templateUrl: "./colorpicker.component.html",
  styleUrls: ["./colorpicker.component.scss"],
})
export class ColorpickerComponent extends AdminoScreenElement implements OnInit {
  colors: any;
  ngOnInit() {
    this.directive.ts.themeChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.colors = Object.keys(this.directive.ts.colorList).map((e) => {
        return { id: e, color: this.directive.ts.getColor(e) };
      });
    });
  }
}
