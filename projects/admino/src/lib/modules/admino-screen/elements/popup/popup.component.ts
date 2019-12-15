import { Component, OnInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';

@Component({
  selector: 'admino-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends AdminoScreenElement implements OnInit {


  ngOnInit() {
  }

}
