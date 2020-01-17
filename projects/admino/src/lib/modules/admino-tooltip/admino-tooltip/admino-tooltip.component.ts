import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'admino-tooltip',
  templateUrl: './admino-tooltip.component.html',
  styleUrls: ['./admino-tooltip.component.scss']
})
export class AdminoTooltipComponent implements OnInit {

  @Input() posX = 0;
  @Input() posY = 0;
  @Input() width = 200;
  @Input() content = null;

  constructor() { }

  ngOnInit() {
  }

}
