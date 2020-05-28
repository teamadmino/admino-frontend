import { AdminoTooltipService } from './admino-tooltip.service';
import { Directive, Input, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Directive({
  selector: '[adminoTooltip]'
})
export class AdminoTooltipDirective implements OnDestroy {
  @Input('adminoTooltip') content = '';
  @Input('adminoTooltipDelay') delay = 500;
  @Input('adminoTooltipEnabled') enabled = true;
  @Input('adminoTooltipStyle') style = {};

  id = null;
  timeout = null;

  @HostListener('mouseenter') mouseEnter() {
    if (this.enabled) {
      this.timeout = setTimeout((params) => {
        this.tooltip.set(this.id, this.content, this.style);
      }, this.delay);
    }
  }
  @HostListener('mouseleave') mouseLeave() {
    this.clearTimeout();
    this.tooltip.remove(this.id);
  }

  constructor(private tooltip: AdminoTooltipService) {
    this.id = uuid();
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  ngOnDestroy() {
    this.tooltip.remove(this.id);
    this.clearTimeout();
  }
}
