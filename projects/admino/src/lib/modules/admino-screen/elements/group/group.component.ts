import { AdminoScreenComponent } from './../../admino-screen.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';

@Component({
  selector: 'admino-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent extends AdminoScreenElement implements OnInit, AfterViewInit {
  @ViewChild(AdminoScreenComponent, { static: true }) screen: AdminoScreenComponent;

  ngOnInit() {
    // console.log(this.screen.form.value);
  }
  ngAfterViewInit() {
    // this.control.setValue(this.screen.form.value);
  }
  actionEvent(e) {
    console.log(e);
  }
  valueChange(e) {
    // console.log(e);
    // this.control.setValue(this.screen.form.value);
  }
}
