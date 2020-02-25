import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import * as Chart from 'chart.js';

@Component({
  selector: 'admino-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss']
})
export class ChartjsComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('canvasRef', { static: true }) canvasRef: ElementRef;
  chart: Chart;
  ngOnInit() {
    this.chart = new Chart(this.canvasRef.nativeElement, this.element.config);
    this.chart.update();
  }
  onChange() {
    if (this.element.config) {
      for (const key of Object.keys(this.element.config)) {
        this.chart[key] = this.element.config[key];
      }
      this.chart.update();
    }
  }
}
