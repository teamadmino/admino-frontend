import { AdminoScreenElement } from '../admino-screen-element';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'admino-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends AdminoScreenElement implements OnInit {


  focused = false;
  ngOnInit() {

  }
  onChange(changes: any) {
  }
}
