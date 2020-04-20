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

  count = 0;
  timeoutHelper;
  ngOnInit() {
    this.init();
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (changes.frequency) {
      this.init();
    }
    if (changes.count) {
      this.init();
    }
  }
  init() {
    this.startTimeout();
  }

  startTimeout() {
    this.clearTimeout();
    if (this.element.frequency > 0) {

      if (this.element.count === undefined || this.element.count === 0 || this.count < this.element.count) {
        this.count++;
        this.timeoutHelper = setTimeout(() => {
          this.handleAction(this.element.action).then(() => {
            this.startTimeout();
          }, (params) => {
            this.startTimeout();
          });
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
