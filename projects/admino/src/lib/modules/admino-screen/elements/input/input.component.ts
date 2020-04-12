import { ScreenElementInput } from './../../admino-screen.interfaces';
import { AdminoScreenElement } from '../admino-screen-element';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admino-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends AdminoScreenElement implements OnInit {

  element: ScreenElementInput;
  ngOnInit() {

  }
  onChange(changes: any) {
  }
}
