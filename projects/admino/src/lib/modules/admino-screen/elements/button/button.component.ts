import { ActionEvent } from './../../../../interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { ScreenElementChange } from '../../admino-screen.interfaces';

@Component({
  selector: 'admino-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('focusRef', { static: true }) focusRef: any;
  sanitizedLabel;
  ngOnInit() {
    this.sanitizedLabel = this.directive.sanitizer.bypassSecurityTrustHtml(this.element.label);
  }
  clicked() {
    if (this.element.action) {
      this.handleAction(this.element.action);
    }
    // if (this.field.action === 'cancel') {
    //   // this.form.cancelForm();
    // }
    // console.log(this.form.formRef)
    // // this.form.formRef.nativeElement.submit();
    // this.form.formRef.onSubmit(undefined);
    // this.form.formRef.ngSubmit.emit();

  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {

    if (changes && changes.label) {
      this.sanitizedLabel = this.directive.sanitizer.bypassSecurityTrustHtml(this.element.label);
    }
  }
  focusEvent() {
    super.focusEvent();
    this.focusRef.focus();
  }
}
