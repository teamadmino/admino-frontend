import { Component, OnInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';

@Component({
  selector: 'admino-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent extends AdminoScreenElement implements OnInit {


  ngOnInit() {
  }

  getSafeUrl(val) {
    return this.directive.sanitizer.bypassSecurityTrustResourceUrl(val);
  }
}
