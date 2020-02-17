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

}
