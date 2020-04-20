import { Component, OnInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';

@Component({
  selector: 'admino-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent extends AdminoScreenElement implements OnInit {

  ngOnInit() {
  }

}
