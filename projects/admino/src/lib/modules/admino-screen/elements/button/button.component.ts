import { ActionEvent } from './../../../../interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';

@Component({
  selector: 'admino-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('focusRef', { static: true }) focusRef: any;

  ngOnInit() {
  }
  clicked() {

    // if (this.field.action === 'cancel') {
    //   // this.form.cancelForm();
    // }
    // console.log(this.form.formRef)
    // // this.form.formRef.nativeElement.submit();
    // this.form.formRef.onSubmit(undefined);
    // this.form.formRef.ngSubmit.emit();

  }
  focusEvent() {
    super.focusEvent();
    this.focusRef.focus();
  }
}
