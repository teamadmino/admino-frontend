import { Component, OnInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'admino-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent extends AdminoScreenElement implements OnInit {
  safeUrl: SafeResourceUrl = '';

  ngOnInit() {
    this.safeUrl = this.getSafeUrl(this.element.value);
  }
  onChange(changes: any) {
    // this.screen.update(this.element);
    if (changes.value) {
      this.safeUrl = this.getSafeUrl(this.element.value);
    }
    if (changes._forceRefresh) {
      this.safeUrl = this.getSafeUrl(this.element.value);
    }
  }
  getSafeUrl(val) {
    return this.directive.sanitizer.bypassSecurityTrustResourceUrl(val);
  }
}
