import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { v4 as uuidv4 } from "uuid";
import { ScreenElementChange } from "../../admino-screen.interfaces";

@Component({
  selector: "admino-progressbar",
  templateUrl: "./progressbar.component.html",
  styleUrls: ["./progressbar.component.scss"],
})
export class ProgressBarComponent extends AdminoScreenElement implements OnInit {
  idPrefix;

  defaultSetup = {
    percent: 0,
    width: 600,
    height: 50,
    animation: "on",
  };

  frequency = 20;
  colorFrequency = 100;
  setup: any = {};
  timerInterval;
  divFull;
  divCompleted;

  ngOnInit() {
    this.idPrefix = "admino_" + this.element.id + "_" + uuidv4() + "_";
    this.cd.detectChanges();
    // this.onResize();
    // if (this.element.setup) {
    //   Object.assign(this.setup, this.element.setup);
    // }
    this.setupProgressBar();
  }

  setupProgressBar() {
    this.setupParameter("height");
    this.setupParameter("width");
    this.setupParameter("percent");
    this.setupParameter("animation");
    this.setup.current = 0;
    this.divFull = document.getElementById(this.idPrefix + "progressbardiv");
    this.divFull.style.height = this.setup.height + "px";
    this.divFull.style.lineHeight = this.setup.height + "px";
    this.divFull.style.width = this.setup.width + "px";
    this.divFull.style.position = "relative";
    this.divFull.style.backgroundColor = "#777";
    this.divFull.style.color = "#FFF";
    this.divFull.innerHTML = "<div id='" + this.idPrefix + "inner'></div>";
    this.divCompleted = document.getElementById(this.idPrefix + "inner");
    this.divCompleted.style.height = this.setup.height + "px";
    this.divCompleted.style.width = "0px";
    this.divCompleted.style.backgroundColor = "#060";
    this.divCompleted.style.textAlign = "center";
    this.divCompleted.innerHTML = "&nbspRunning&nbsp";
    this.setup.updated = 0;
    this.updateDiv();
  }

  setupParameter(param) {
    if (this.element.setup != undefined) {
      if (this.element.setup[param] != undefined) {
        this.setup[param] = this.element.setup[param];
        this.element.setup[param] = undefined;
      }
    }
    if (this.setup[param] === undefined) {
      this.setup[param] = this.defaultSetup[param];
    }
  }

  onChange(changes: { [id: string]: ScreenElementChange }) {
    // if (changes.setup) {
    //   Object.assign(this.setup, this.element.setup);
    // }
    this.setupParameter("percent");
    this.setupParameter("animation");
    this.setup.updated = 16;
    this.updateDiv();
  }

  onDestroy() {
    clearInterval(this.timerInterval);
  }

  onResize() {}

  updateDiv() {
    clearInterval(this.timerInterval);
    var div2 = document.getElementById(this.idPrefix + "inner");
    if (this.setup.animation != "on") {
      this.setup.current = this.setup.percent;
      this.setup.updated = 0;
    } else {
      var diff = this.setup.percent - this.setup.current;
      var step = (((Math.abs(diff) + 19) / 20) | 0) * Math.sign(diff);
      this.setup.current += step;
      if (this.setup.updated > 0) this.setup.updated--;
    }
    var color = "#" + (0xfff - this.setup.updated).toString(16);
    div2.style.width = (this.setup.width * this.setup.current) / 100 + "px";
    div2.innerHTML = "&nbspRunning&nbsp" + this.setup.current + "%";
    div2.style.color = color;
    if (this.setup.percent == this.setup.current && this.setup.updated == 0) return;
    this.timerInterval = setInterval(
      () => {
        this.updateDiv();
      },
      this.setup.percent == this.setup.current ? this.colorFrequency : this.frequency
    );
  }
}
