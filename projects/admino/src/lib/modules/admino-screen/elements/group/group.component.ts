import { ActionEvent } from './../../../../interfaces';
import { AdminoScreenComponent } from './../../admino-screen.component';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'admino-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent extends AdminoScreenElement implements OnInit, AfterViewInit {

  @ViewChild(AdminoScreenComponent, { static: true }) screen: AdminoScreenComponent;

  ngOnInit() {
    // console.log(this.screen.form.value);
    // this.screenComponent.updateEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
    // });

  }
  ngAfterViewInit() {
    // this.control.setValue(this.screen.form.value);
  }

  onChange(changes: any) {
    this.screen.update(this.element);
  }


}
