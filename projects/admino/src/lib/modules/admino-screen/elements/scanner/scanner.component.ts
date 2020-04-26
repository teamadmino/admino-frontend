import { ScannerService } from './scanner.service';
import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { codeAnimation } from './inputview/scanner.animation';

@Component({
  selector: 'admino-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  providers: [ScannerService]

})
export class ScannerComponent extends AdminoScreenElement implements OnInit {


  constructor(public scannerService: ScannerService) {
    super();


  }


  ngOnInit() {
    this.directive.ts.setTheme('gold', false);

  }

}
