import { ScreenElementInput } from "./../../admino-screen.interfaces";
import { AdminoScreenElement } from "../admino-screen-element";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: "admino-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
})
export class InputComponent extends AdminoScreenElement implements OnInit {
  element: ScreenElementInput;
  // matcher = new MyErrorStateMatcher();

  ngOnInit() {}
  onChange(changes: any) {}
  filterInput(e) {
    // console.log(e);
  }
}
