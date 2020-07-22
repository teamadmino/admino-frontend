import { Component, OnInit, ViewChild } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";

@Component({
  selector: "admino-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent extends AdminoScreenElement implements OnInit {
  @ViewChild("focusRef", { static: true }) focusRef: any;

  ngOnInit() {}
  focusEvent() {
    super.focusEvent();
    this.focusRef.focus();
  }
}
