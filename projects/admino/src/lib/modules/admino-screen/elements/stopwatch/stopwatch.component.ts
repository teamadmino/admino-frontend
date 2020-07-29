import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { v4 as uuidv4 } from "uuid";
import { ScreenElementChange } from "../../admino-screen.interfaces";

@Component({
  selector: "admino-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopWatchComponent extends AdminoScreenElement implements OnInit {
  idPrefix;

  defaultSetup = {
    msecValue: 0,
    status: "stop",
    format: "full",
  };

  divWidth = "118px";
  divHeight = "18px";
  divFontSize = "12px";
  frequency = 89;

  setup: any = {};
  timerInterval;
  div;

  ngOnInit() {
    this.idPrefix = "admino_" + this.element.id + "_" + uuidv4() + "_";
    this.cd.detectChanges();
    // this.onResize();
    // if (this.element.setup) {
    //   Object.assign(this.setup, this.element.setup);
    // }
    this.setupStopWatch();

    if (this.idPrefix !== this.divHeight) {
    }
  }

  setupStopWatch() {
    this.setup.baseTime = Date.now();
    this.div = document.getElementById(this.idPrefix + "stopwatchdiv");
    this.div.style.height = this.divHeight;
    this.div.style.lineHeight = this.divHeight;
    this.div.style.textAlign = "right";
    this.div.style.paddingRight = "4px";
    this.div.style.width = this.divWidth;
    this.div.style.position = "relative";
    this.div.style.overflow = "hidden";
    // this.div.style.fontFamily = "Monaco";
    this.div.style.fontSize = this.divFontSize;
    this.updateSetup();
  }

  updateSetup() {
    this.setupParameter("msecValue");
    this.setupParameter("status");
    this.setupParameter("format");
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
    // delete this.setup[param];
  }

  onChange(changes: { [id: string]: ScreenElementChange }) {
    // if (changes.setup) {
    //   Object.assign(this.setup, this.element.setup);
    // }

    this.control.setValue(this.setup);

    this.updateSetup();
  }

  onDestroy() {
    clearInterval(this.timerInterval);
  }

  onResize() {}

  updateDiv() {
    clearInterval(this.timerInterval);
    var value;
    switch (this.setup.status) {
      case "stop":
        this.div.style.backgroundColor = "#070";
        this.div.style.color = "#FFF";
        value = this.setup.msecValue;
        break;
      case "start":
        this.div.style.backgroundColor = "#770";
        this.div.style.color = "#FF0";
        value = this.setup.msecValue;
        this.setup.baseTime = Date.now() - this.setup.msecValue;
        this.setup.status = "run";
        break;
      case "run":
        value = Date.now() - this.setup.baseTime;
        this.div.style.backgroundColor = "#770";
        this.div.style.color = "#FF0";
        break;
    }

    var sec = (value / 1000) | 0;
    var msec = value - sec * 1000;
    var day = (sec / 86400) | 0;
    sec -= day * 86400;
    var hour = (sec / 3600) | 0;
    sec -= hour * 3600;
    var min = (sec / 60) | 0;
    sec -= 60 * min;

    var full =
      this.formatZeroPaddedInteger(day, 2) +
      ":" +
      this.formatZeroPaddedInteger(hour, 2) +
      ":" +
      this.formatZeroPaddedInteger(min, 2) +
      ":" +
      this.formatZeroPaddedInteger(sec, 2) +
      "." +
      this.formatZeroPaddedInteger(msec, 3);

    if (this.setup.format == "full") {
      this.div.innerHTML = full;
    } else {
      var i;
      for (i = 0; i < full.length; i++) {
        switch (full.substring(i, i + 1)) {
          case "0":
          case "-":
          case ":":
            continue;
          case ".":
            i--;
        }
        break;
      }
      this.div.innerHTML = full.substring(i);
    }

    if (this.setup.status != "run") return;
    this.setup.msecValue = value;
    this.timerInterval = setInterval(() => {
      this.updateDiv();
    }, this.frequency);
  }

  formatZeroPaddedInteger(value, length) {
    const str = "" + value;
    return "0000000000".substring(0, length - str.length) + str;
  }
}
