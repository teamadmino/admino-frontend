import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { ScreenElementChange } from "../../admino-screen.interfaces";
import { deepMerge } from "../../../../utils/deepmerge";

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
    animation: true,
    preloaderColor: "#040",
    wrapperColor: "#444",
    textColor: "#FFF",
    textHighlight: "#AA0",
    prefix: " Running ",
    postfix: "%",
    staticLabel: "",
  };

  private = {
    displayValue: undefined,
    appliedColor: undefined,
    animationFrame: undefined,
    restoreTextColorTimeout: undefined,
  };

  ngOnInit() {
    this.setup = deepMerge(this.setup, this.element.setup);
    this.private.appliedColor = this.setup.textColor;
    this.updateLabel();
  }

  onChange(changes: { [id: string]: ScreenElementChange }) {
    Object.assign(this.setup, this.element.setup);
    this.highlightText();
    this.updateLabel();
  }

  onDestroy() {
    cancelAnimationFrame(this.private.animationFrame);
    clearTimeout(this.private.animationFrame);
    clearTimeout(this.private.restoreTextColorTimeout);
  }

  onResize() {}

  updateLabel() {
    this.private.animationFrame = window.requestAnimationFrame(() => {
      if (
        this.setup.animation &&
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
    if (this.setup.animation) {
      this.private.appliedColor = this.setup.textHighlight;
      this.private.restoreTextColorTimeout = setTimeout(() => {
        this.private.appliedColor = this.setup.textColor;
        this.directive.cd.markForCheck();
      }, 500);
    }
  }
}
