import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { ScreenElementChange } from "../../admino-screen.interfaces";
import { cloneDeep } from "lodash";

@Component({
  selector: "admino-progressbar",
  templateUrl: "./progressbar.component.html",
  styleUrls: ["./progressbar.component.scss"],
})
export class ProgressBarComponent extends AdminoScreenElement implements OnInit {
  @ViewChild("innerRef", { static: true }) innerRef: ElementRef;
  @ViewChild("wrapperRef", { static: true }) wrapperRef: ElementRef;

  setup = {
    percent: 0,
    showValue: true,
    animation: "fancy",
    preloaderColor: "#040",
    wrapperColor: "#444",
    textColor: "#FFF",
    textHighlight: "#DD0",
    prefix: " Running ",
    postfix: "%",
    staticLabel: "",
    transitionDuration: 500,
  };

  private = {
    displayValue: undefined,
    appliedColor: undefined,
    animationFrame: undefined,
    restoreTextColorTimeout: undefined,
  };

  ngOnInit() {
    Object.assign(this.setup, cloneDeep(this.element.setup));
    this.private.appliedColor = this.setup.textColor;
    this.updateLabel();
  }

  onChange(changes: { [id: string]: ScreenElementChange }) {
    Object.assign(this.setup, cloneDeep(this.element.setup));
    this.highlightText();
    this.updateLabel();
  }

  onDestroy() {
    cancelAnimationFrame(this.private.animationFrame);
    clearTimeout(this.private.restoreTextColorTimeout);
  }

  onResize() {}

  updateLabel() {
    this.control.setValue(this.setup);
    this.private.animationFrame = window.requestAnimationFrame(() => {
      if (
        this.setup.animation != "off" &&
        Math.abs(this.innerRef.nativeElement.clientWidth - (this.setup.percent / 100) * this.wrapperRef.nativeElement.clientWidth) > 2
      ) {
        this.private.displayValue = Math.floor((this.innerRef.nativeElement.clientWidth / this.wrapperRef.nativeElement.clientWidth) * 100);
        this.updateLabel();
      } else {
        this.private.displayValue = this.setup.percent;
      }
      this.directive.cd.markForCheck();
    });
  }

  highlightText() {
    if (this.setup.animation != "off") {
      this.private.appliedColor = this.setup.textHighlight;
      this.private.restoreTextColorTimeout = setTimeout(() => {
        this.private.appliedColor = this.setup.textColor;
        this.directive.cd.markForCheck();
      }, 500);
    }
  }

  getStyle() {
    let style = {};
    style["backgroundColor"] = this.setup.preloaderColor;
    style["color"] = this.private.appliedColor;
    style["width"] = this.setup.percent + "%";
    switch (this.setup.animation) {
      case "fancy":
        if (this.private.displayValue != 100) {
          style["animation"] = "progress-bar-stripes 1s linear infinite";
          style["backgroundImage"] = "linear-gradient(135deg, transparent, #fff1 25%, transparent 50%, #fff1 75%, transparent)";
          style["backgroundSize"] = "30px 30px";
        }
        style["transition"] = "width " + this.setup.transitionDuration + "ms ease-in-out, color ease-in-out";
        break;
      case "solid":
        style["transition"] = "width " + this.setup.transitionDuration + "ms ease-in-out, color ease-in-out";
        break;
    }
    return style;
  }

  getText() {
    if (this.setup.showValue) {
      return this.setup.prefix + this.private.displayValue + this.setup.postfix;
    } else {
      return this.setup.staticLabel.length == 0 ? "\u00A0" : this.setup.staticLabel;
    }
  }
}
