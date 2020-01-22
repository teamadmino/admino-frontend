import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { AdminoScreenElement } from '../admino-screen-element';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementChange } from '../../admino-screen.interfaces';
import { deepMerge } from '../../../../utils/deepmerge';

@Component({
  selector: 'admino-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent extends AdminoScreenElement implements OnInit {

  public data: ChartDataSets[] = [{}];
  public labels: Label[] = [];
  public legend = true;
  public chartType = 'line';
  public options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public colors: Color[] = [];
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  onChange(changes: { [id: string]: ScreenElementChange; }) {
    this.labels = this.element.labels;
    this.legend = this.element.legend;
    this.legend = this.element.legend;
    this.chartType = this.element.chartType;
    this.data = this.element.data;
    this.options = deepMerge(this.options, this.element.options);
    // this.options && this.options.
    this.directive.cd.detectChanges();
    this.setColors();
    this.chart.update();
  }

  ngOnInit() {
    this.directive.ts.themeUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      let overrides: ChartOptions;
      overrides = {
        legend: {
          labels: { fontColor: this.directive.ts.fgColor }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: this.directive.ts.fgColor },
            gridLines: { color: this.directive.ts.rgba(this.directive.ts.fgColor, 0.1) }
          }],
          yAxes: [{
            ticks: { fontColor: this.directive.ts.fgColor },
            gridLines: { color: this.directive.ts.rgba(this.directive.ts.fgColor, 0.1) }
          }]
        }
      };

      this.directive.chartThemeService.setColorschemesOptions(overrides);
      this.setColors();
    });
    this.onChange(null);
  }

  setColors() {
    const ts = this.screenComponent.ts;

    const colors = this.directive.ts.getColor(this.element.colors);
    this.colors = [];

    for (const color of colors) {
      this.colors.push(
        { // grey
          backgroundColor: ts.rgba(color, 0.2),
          borderColor: ts.rgba(color, 1),
          pointBackgroundColor: ts.rgba(color, 1),
          pointBorderColor: ts.rgba(color, 1),
          pointHoverBackgroundColor: ts.rgba(color, 1),
          pointHoverBorderColor: ts.rgba(color, 0.8)
        }
      );
    }
    this.directive.cd.detectChanges();
    this.chart.update();
  }

  // public randomize(): void {
  //   for (let i = 0; i < this.lineChartData.length; i++) {
  //     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
  //       this.lineChartData[i].data[j] = this.generateNumber(i);
  //     }
  //   }
  //   this.chart.update();
  // }


  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


}
