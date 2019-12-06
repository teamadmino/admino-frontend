import { takeUntil } from 'rxjs/operators';
import { TimerConfig } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
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

  config: TimerConfig;

  timeoutHelper;
  ngOnInit() {
    this.config = this.element.config;
    this.startTimeout();
  }
  callback(response, error) {
    this.startTimeout();
  }

  startTimeout() {
    this.clearTimeout();
    const actionEvent: ActionEvent = {
      action: this.element.config.action,
      form: this.screenComponent.form
    };

    this.timeoutHelper = setTimeout(() => {
      this.screenComponent.as.handleAction(actionEvent).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.startTimeout();
      }, (params) => {
        this.startTimeout();
      });
      // this.handleAction(this.element.config.action).pipe(takeUntil(this.ngUnsubscribe));
    }, this.config.frequency);
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
