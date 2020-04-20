import { ScreenElementChange } from './../../admino-screen.interfaces';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import * as Chart from 'chart.js';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'admino-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss']
})
export class ChartjsComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('canvasRef', { static: true }) canvasRef: ElementRef;
  chart: Chart;
  ngOnInit() {
    this.chart = new Chart(this.canvasRef.nativeElement, cloneDeep(this.element.config));
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (this.element.config) {
      for (const key of Object.keys(this.element.config)) {
        this.chart[key] = this.element.config[key];
      }
      this.directive.cd.detectChanges();
      this.chart.update();
      this.chart.resize();
      this.chart.render();
    }
    if (changes.__forceRefresh) {
      this.chart.destroy();
      this.chart = new Chart(this.canvasRef.nativeElement, cloneDeep(this.element.config));
    }
  }
}
