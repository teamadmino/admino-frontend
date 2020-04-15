import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { ScreenElementChange } from '../../admino-screen.interfaces';

@Component({
  selector: 'admino-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent extends AdminoScreenElement implements OnInit {
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
  onChange(changes: { [id: string]: ScreenElementChange; }) {

  }
  focusEvent() {
    super.focusEvent();
    this.focusRef.focus();
  }
}
