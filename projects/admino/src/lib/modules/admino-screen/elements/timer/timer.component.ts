import { cloneDeep } from "lodash";
import { takeUntil } from "rxjs/operators";
import { ScreenElementTimer, ScreenElementChange } from "./../../admino-screen.interfaces";
import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { Subject } from "rxjs";

var globalIncrement = 0;
@Component({
  selector: "admino-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent extends AdminoScreenElement implements OnInit {
  rand = globalIncrement++;
  count = 0;
  timeoutHelper;
  ngOnInit() {
    this.timerInit();
  }
  onChange(changes: { [id: string]: ScreenElementChange }) {
    if (changes.frequency) {
      this.timerInit();
    }
    if (changes.value) {
      this.timerInit();
    }
  }
  timerInit() {
    this.startTimeout();
  }

  startTimeout() {
    this.clearTimeout();
    if (this.element.frequency > 0) {
      if (this.control.value === undefined || this.control.value === null || this.control.value < 0 || this.control.value > 0) {
        this.timeoutHelper = setTimeout(() => {
          this.handleAction(this.element.action).then(
            () => {
              this.startTimeout();
            },
            (params) => {
              this.startTimeout();
            }
          );

          let currval = this.control.value !== null || this.control.value !== undefined ? this.control.value : 0;
          if (currval > 0) {
            currval--;
          }
          this.control.setValue(currval);

          // this.handleAction(this.element.config.action).pipe(takeUntil(this.ngUnsubscribe));
        }, this.element.frequency);
      }
    }
  }

  clearTimeout() {
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper);
    }
  }
  onDestroy() {
    this.clearTimeout();
  }
}
