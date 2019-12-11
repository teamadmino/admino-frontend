import { cloneDeep } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementTimer } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { Subject } from 'rxjs';
import { ActionEvent } from 'admino';

@Component({
  selector: 'admino-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent extends AdminoScreenElement implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  activeConfig: ScreenElementTimer;

  timeoutHelper;
  ngOnInit() {
    this.init();
    this.screenComponent.updateEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.activeConfig.frequency !== this.element.frequency) {
        this.init();
      }
    });
  }

  init() {
    this.activeConfig = cloneDeep(this.element as ScreenElementTimer);
    this.startTimeout();
  }

  startTimeout() {
    this.clearTimeout();
    const actionEvent: ActionEvent = {
      action: this.activeConfig.action,
      form: this.screenComponent.group
    };

    if (this.activeConfig.frequency > 0) {
      this.timeoutHelper = setTimeout(() => {
        this.screenComponent.as.handleAction(actionEvent).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
          this.startTimeout();
        }, (params) => {
          this.startTimeout();
        });
        // this.handleAction(this.element.config.action).pipe(takeUntil(this.ngUnsubscribe));
      }, this.activeConfig.frequency);
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
