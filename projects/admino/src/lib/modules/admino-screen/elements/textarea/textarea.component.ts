import { ScreenElementTextarea } from './../../admino-screen.interfaces';
import { Component, OnInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';

@Component({
  selector: 'admino-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent extends AdminoScreenElement implements OnInit {

  element: ScreenElementTextarea;

  ngOnInit() {
  }
  onChange(changes: any) {
    // FIX, because textarea didnt update automatically;
    // if (changes.value) {
    //   this.directive.control.setValue(changes.value.new);
    // }
    this.directive.cd.detectChanges();
  }
}
