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
export class TimerComponent extends AdminoScreenElement implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  timeoutHelper;
  ngOnInit() {
    this.init();
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (changes.frequency) {
      this.init();
    }
  }
  init() {
    this.startTimeout();
  }

  startTimeout() {
    this.clearTimeout();
    if (this.element.frequency > 0) {
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

  clearTimeout() {
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper);
    }
  }

  ngOnDestroy() {
    this.clearTimeout();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
