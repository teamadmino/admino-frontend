import { Component, OnInit, HostBinding } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { ScreenElementChange } from '../../admino-screen.interfaces';

@Component({
  selector: 'admino-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent extends AdminoScreenElement implements OnInit {

  @HostBinding('style.color') color = '';
  @HostBinding('style.font-size') size = '';
  @HostBinding('style.text-align') align = '';
  @HostBinding('style.font-weight') weight = '600';

  sanitizedVal;
  ngOnInit() {
    this.onChange(null);
    this.sanitizedVal = this.directive.sanitizer.bypassSecurityTrustHtml(this.element.value);
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {

    this.size = this.element.size;
    if (this.element.color !== undefined) {
      this.color = this.directive.ts.getColor(this.element.color);
    }
    if (this.element.align !== undefined) {
      this.align = this.element.align;
    }
    if (this.element.weight !== undefined) {
      this.weight = this.element.weight;
    }
    if (changes && changes.value) {
      this.sanitizedVal = this.directive.sanitizer.bypassSecurityTrustHtml(this.element.value);
    }
  }

}
