import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { MatRadioGroup, MatRadioButton } from "@angular/material";
import { SafeStyle } from "@angular/platform-browser";

@Component({
  selector: "admino-radiobutton",
  templateUrl: "./radiobutton.component.html",
  styleUrls: ["./radiobutton.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadiobuttonComponent extends AdminoScreenElement
  implements OnInit {
  // @ViewChild('focusRef', { static: true }) focusRef: MatRadioGroup;
  @ViewChildren("radioButtonRefs") radioButtonRefs: QueryList<MatRadioButton>;

  ngOnInit() {}
  focusEvent() {
    super.focusEvent();
    if (this.radioButtonRefs && this.radioButtonRefs.toArray()[0]) {
      this.radioButtonRefs.toArray()[0].focus();
    }
  }
  onChange(changes: any) {
    this.cd.detectChanges();
  }
  // sanitizeStyle(unsafeStyle: string): SafeStyle {
  //   return this.directive.sanitizer.bypassSecurityTrustStyle(unsafeStyle);
  // }
  sanitizeHtml(unsafeHtml: string): SafeStyle {
    return this.directive.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }
}
