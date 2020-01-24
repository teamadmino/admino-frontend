import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { AdminoScreenElement } from '../admino-screen-element';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementChange } from '../../admino-screen.interfaces';
import { deepMerge } from '../../../../utils/deepmerge';
import { cloneDeep } from 'lodash';
import { CHART_COLOR_SETTINGS } from './chartcolors';

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
    animation: { duration: 0 },
    maintainAspectRatio: false,
  };
  public colors: Color[] = [];
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  onChange(changes: { [id: string]: ScreenElementChange; }) {
    this.labels = cloneDeep(this.element.labels);
    this.legend = this.element.legend;
    this.legend = this.element.legend;
    this.chartType = this.element.chartType;
    this.data = cloneDeep(this.element.data);
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
    this.onChange({});
  }

  setColors() {
    const ts = this.screenComponent.ts;

    const colors = this.directive.ts.getColor(this.element.colors);
    this.colors = [];

    let colsettings = CHART_COLOR_SETTINGS[this.chartType] ? CHART_COLOR_SETTINGS[this.chartType] : CHART_COLOR_SETTINGS['bar'];

    if (this.element.visualizationSettings) {
      colsettings = deepMerge(colsettings, this.element.visualizationSettings);
    }


    for (const color of colors) {
      this.colors.push(
        {
          backgroundColor: ts.rgba(color, colsettings.backgroundColor),
          borderWidth: colsettings.borderWidth,
          borderColor: ts.rgba(color, colsettings.borderColor),
          borderCapStyle: ts.rgba(color, colsettings.borderCapStyle),
          borderDash: colsettings.borderDash,
          borderDashOffset: colsettings.borderDashOffset,
          borderJoinStyle: ts.rgba(color, colsettings.borderJoinStyle),
          pointBorderColor: ts.rgba(color, colsettings.pointBorderColor),
          pointBackgroundColor: ts.rgba(color, colsettings.pointBackgroundColor),
          pointBorderWidth: colsettings.pointBorderWidth,
          pointRadius: colsettings.pointRadius,
          pointHoverRadius: colsettings.pointHoverRadius,
          pointHitRadius: colsettings.pointHitRadius,
          pointHoverBackgroundColor: ts.rgba(color, colsettings.pointHoverBackgroundColor),
          pointHoverBorderColor: ts.rgba(color, colsettings.pointHoverBorderColor),
          pointHoverBorderWidth: colsettings.pointHoverBorderWidth,
          pointStyle: colsettings.pointStyle,
          hoverBackgroundColor: ts.rgba(color, colsettings.hoverBackgroundColor),
          hoverBorderColor: ts.rgba(color, colsettings.hoverBorderColor),
          hoverBorderWidth: colsettings.hoverBorderWidth,
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
