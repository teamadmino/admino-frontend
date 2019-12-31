import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { MatRadioGroup, MatRadioButton } from '@angular/material';

@Component({
  selector: 'admino-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadiobuttonComponent extends AdminoScreenElement implements OnInit {
  // @ViewChild('focusRef', { static: true }) focusRef: MatRadioGroup;
  @ViewChildren('radioButtonRefs') radioButtonRefs: QueryList<MatRadioButton>;

  ngOnInit() {
  }
  focusEvent() {
    super.focusEvent();
    if (this.radioButtonRefs && this.radioButtonRefs.toArray()[0]) {
      this.radioButtonRefs.toArray()[0].focus();
    }
  }
}
