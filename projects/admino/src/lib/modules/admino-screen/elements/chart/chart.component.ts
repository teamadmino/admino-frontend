import { Component, OnInit, ViewChild, HostBinding } from "@angular/core";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, BaseChartDirective, Label, ThemeService } from "ng2-charts";
import { AdminoScreenElement } from "../admino-screen-element";
import * as pluginAnnotations from "chartjs-plugin-annotation";
import { takeUntil } from "rxjs/operators";
import { ScreenElementChange } from "../../admino-screen.interfaces";
import { deepMerge } from "../../../../utils/deepmerge";
import { cloneDeep, isArray } from "lodash";
import { CHART_COLOR_SETTINGS } from "./chartcolors";

@Component({
  selector: "admino-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent extends AdminoScreenElement implements OnInit {
  defaultHeight = "400px";
  @HostBinding("style.height") height;
  public data: ChartDataSets[] = [{}];
  public labels: Label[] = [];
  public legend = true;
  public chartType = "line";

  public options: ChartOptions = {
    responsive: true,
    animation: { duration: 0 },
    maintainAspectRatio: false,
  };
  public colors: Color[] = [];
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  onChange(changes: { [id: string]: ScreenElementChange }) {
    this.labels = cloneDeep(this.element.labels);
    this.legend = this.element.legend;
    this.height = this.element.height !== undefined ? this.element.height : this.defaultHeight;
    this.chartType = this.element.chartType;
    this.data = cloneDeep(this.element.data);
    this.options = deepMerge(this.options, this.element.options);
    // this.options && this.options.
    this.setColors();

    this.directive.cd.detectChanges();
    this.chart.update();
  }

  ngOnInit() {
    this.directive.ts.themeUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.setColors();
    });
    this.onChange({});
  }

  setColors() {
    const ts = this.directive.ts;

    let overrides: ChartOptions;
    overrides = {
      legend: {
        labels: { fontColor: ts.fgColor },
      },
      scales: {
        xAxes: [
          {
            scaleLabel: { fontColor: ts.fgColor },
            ticks: { fontColor: ts.fgColor },
            gridLines: {
              color: ts.rgba(ts.fgColor, 0.1),
              zeroLineColor: ts.rgba(ts.fgColor, 0.1),
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: { fontColor: ts.fgColor },
            ticks: { fontColor: ts.fgColor },
            gridLines: {
              color: ts.rgba(ts.fgColor, 0.1),
              zeroLineColor: ts.rgba(ts.fgColor, 0.1),
            },
          },
        ],
      },
    };
    if (this.chartType === "radar" || this.chartType === "polarArea") {
      overrides.scale = {
        gridLines: {
          color: ts.rgba(ts.fgColor, 0.1),
          zeroLineColor: ts.rgba(ts.fgColor, 0.1),
        },
        angleLines: { color: ts.rgba(ts.fgColor, 0.1) },
      };
    }
    this.directive.chartThemeService.setColorschemesOptions(overrides);
    const colors = this.directive.ts.getColor(this.element.colors);
    this.colors = [];

    let colsettings = CHART_COLOR_SETTINGS[this.chartType] ? CHART_COLOR_SETTINGS[this.chartType] : CHART_COLOR_SETTINGS["bar"];

    if (this.element.visualizationSettings) {
      colsettings = deepMerge(colsettings, this.element.visualizationSettings);
    }

    for (const color of colors) {
      this.colors.push({
        backgroundColor: this.preprocessColor(color, colsettings.backgroundColor),
        borderWidth: colsettings.borderWidth,
        borderColor: this.preprocessColor(color, colsettings.borderColor),
        borderCapStyle: colsettings.borderCapStyle,
        borderDash: colsettings.borderDash,
        borderDashOffset: colsettings.borderDashOffset,
        borderJoinStyle: colsettings.borderJoinStyle,
        pointBorderColor: this.preprocessColor(color, colsettings.pointBorderColor),
        pointBackgroundColor: this.preprocessColor(color, colsettings.pointBackgroundColor),
        pointBorderWidth: colsettings.pointBorderWidth,
        pointRadius: colsettings.pointRadius,
        pointHoverRadius: colsettings.pointHoverRadius,
        pointHitRadius: colsettings.pointHitRadius,
        pointHoverBackgroundColor: this.preprocessColor(color, colsettings.pointHoverBackgroundColor),
        pointHoverBorderColor: this.preprocessColor(color, colsettings.pointHoverBorderColor),
        pointHoverBorderWidth: colsettings.pointHoverBorderWidth,
        pointStyle: colsettings.pointStyle,
        hoverBackgroundColor: this.preprocessColor(color, colsettings.hoverBackgroundColor),
        hoverBorderColor: this.preprocessColor(color, colsettings.hoverBorderColor),
        hoverBorderWidth: colsettings.hoverBorderWidth,
      });
    }
    this.directive.cd.detectChanges();
    this.chart.update();
  }

  preprocessColor(color: string | string[], opacity) {
    const ts = this.screenComponent.ts;
    if (isArray(color)) {
      const arr = [];
      color.forEach((col) => {
        arr.push(ts.rgba(col, opacity));
      });
      return arr;
    } else {
      return ts.rgba(color, opacity);
    }
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
  public chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    // console.log(event, active);
  }
}
