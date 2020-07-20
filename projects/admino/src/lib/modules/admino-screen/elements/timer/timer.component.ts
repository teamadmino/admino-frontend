import { cloneDeep } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementTimer, ScreenElementChange } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { Subject } from 'rxjs';

@Component({
  selector: 'admino-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent extends AdminoScreenElement implements OnInit {

  rand = Math.floor(Math.random() * 1000);
  count = 0;
  timeoutHelper;
  ngOnInit() {
    this.timerInit();
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    console.log('Timer Change Event', this.rand);

    if (changes.frequency) {
      console.log('Timer frequency change', this.rand);
      this.timerInit();
    }
    if (changes.value) {
      console.log('Timer frequency value', this.rand);
      this.timerInit();
    }
  }
  timerInit() {
    console.log('timerInit', this.rand);
    this.startTimeout();
  }

  startTimeout() {
    console.log('starTimeout element', this.element, this.rand);
    console.log('starTimeout', this.rand);
    this.clearTimeout();
    if (this.element.frequency > 0) {
      console.log('starTimeout 2', this.rand);
      if (this.control.value === undefined || this.control.value === null || this.control.value < 0 || this.control.value > 0) {
        console.log('starTimeout 3', this.rand);

        this.timeoutHelper = setTimeout(() => {
          console.log('starTimeout 4', this.rand);
          this.handleAction(this.element.action).then(() => {
            console.log('starTimeout 5', this.rand);
            this.startTimeout();
          }, (params) => {
            console.log('starTimeout 6', this.rand);
            this.startTimeout();
          });

          let currval = this.control.value !== null || this.control.value !== undefined ? this.control.value : 0;
          console.log('starTimeout 7 currval', currval, this.rand);
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
    console.log('clearTimeout', this.rand);
    if (this.timeoutHelper) {
      console.log('clearTimeout 2', this.rand);
      clearTimeout(this.timeoutHelper);
    }
  }
  onDestroy() {
    console.log('Timer destroy', this.rand);
    this.clearTimeout();
  }
}
