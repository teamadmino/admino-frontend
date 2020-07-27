import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { v4 as uuidv4 } from "uuid";
import { ScreenElementChange } from "../../admino-screen.interfaces";
import { has } from "lodash";

@Component({
  selector: "admino-progressbar",
  templateUrl: "./progressbar.component.html",
  styleUrls: ["./progressbar.component.scss"],
})
export class ProgressBarComponent extends AdminoScreenElement implements OnInit {
  // idPrefix;

  @ViewChild("innerRef", { static: true }) innerRef: ElementRef;
  @ViewChild("wrapperRef", { static: true }) wrapperRef: ElementRef;
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

  percent = 20;
  animation = "on";
  preloaderColor = "#220000";
  wrapperColor = "#444444";
  textColor = "#FFFFFF";
  textHighlight = "#0000FF";

  appliedColor = this.textColor;

  updated = false;
  applyAnimation = true;
  label = 0;
  anim;
  timeout;
  ngOnInit() {
    // this.idPrefix = "admino_" + this.element.id + "_" + uuidv4() + "_";
    // this.cd.detectChanges();
    // this.onResize();
    // if (this.element.setup) {
    //   Object.assign(this.setup, this.element.setup);
    // }
    // this.setupProgressBar();
    // setInterval((params) => {
    //   this.getLabel();
    //   this.directive.cd.markForCheck();
    //   // console.log(this.innerRef.nativeElement.clientWidth);
    // }, 10);
    this.percent = this.element.setup.percent;
    this.animate();
  }

  animate() {
    this.anim = window.requestAnimationFrame((params) => {
      console.log("animating");
      if (Math.abs(this.innerRef.nativeElement.clientWidth - (this.percent / 100) * this.wrapperRef.nativeElement.clientWidth) > 2) {
        this.label = Math.floor((this.innerRef.nativeElement.clientWidth / this.wrapperRef.nativeElement.clientWidth) * 100);
        this.animate();
      } else {
        this.label = this.percent;
      }
      this.directive.cd.markForCheck();
    });
  }

  setupProgressBar() {
    // this.setupParameter("height");
    // this.setupParameter("width");
    // this.setupParameter("percent");
    // this.setupParameter("animation");
    // this.setup.current = 0;
    // this.divFull = document.getElementById(this.idPrefix + "progressbardiv");
    // this.divFull.style.height = this.setup.height + "px";
    // this.divFull.style.lineHeight = this.setup.height + "px";
    // this.divFull.style.width = this.setup.width + "px";
    // this.divFull.style.position = "relative";
    // this.divFull.style.backgroundColor = "#777";
    // this.divFull.style.color = "#FFF";
    // this.divFull.innerHTML = "<div id='" + this.idPrefix + "inner'></div>";
    // this.divCompleted = document.getElementById(this.idPrefix + "inner");
    // this.divCompleted.style.height = this.setup.height + "px";
    // this.divCompleted.style.width = "0px";
    // this.divCompleted.style.backgroundColor = "#060";
    // this.divCompleted.style.textAlign = "center";
    // this.divCompleted.innerHTML = "&nbspRunning&nbsp";
    // this.setup.updated = 0;
    // this.updateDiv();
  }

  // setupParameter(param) {
  //   if (this.element.setup != undefined) {
  //     if (this.element.setup[param] != undefined) {
  //       this.setup[param] = this.element.setup[param];
  //       this.element.setup[param] = undefined;
  //     }
  //   }
  //   if (this.setup[param] === undefined) {
  //     this.setup[param] = this.defaultSetup[param];
  //   }
  // }

  onChange(changes: { [id: string]: ScreenElementChange }) {
    if (changes.setup) {
      // Object.assign(this.setup, this.element.setup);
      // this.wrapperColor = has(this.element.setup,'wrapperColor.color.valami')? this.element.setup.wrapperColor;
      // this.applyAnimation = false;
      // this.directive.cd.detectChanges();
      // this.appliedColor = this.textHighlight;
      // this.directive.cd.detectChanges();
      // setTimeout((params) => {
      //   this.applyAnimation = true;
      //   this.directive.cd.detectChanges();
      // }, 10);
      // setTimeout((params) => {
      //   this.appliedColor = this.textColor;
      //   this.percent = this.element.setup.percent;
      //   this.directive.cd.detectChanges();
      // }, 100);
      this.percent = this.element.setup.percent;
      this.highlightText();

      this.animate();

      // this.animation = this.element.setup.animation;
      // this.preloaderColor = this.element.setup.preloaderColor ? this.element.setup.preloaderColor : "0xfff0000";
      // this.wrapperColor = this.element.setup.wrapperColor ? this.element.setup.wrapperColor : "0x44444";

      // this.highlighText();
    }
    // if (changes._forceRefresh) {
    //   console.log("refresh");
    // }
    // console.log(changes);
    // this.setupParameter("percent");
    // this.setupParameter("animation");
    // this.setup.updated = 16;
    // this.updateDiv();
  }
  highlightText() {
    this.appliedColor = this.textHighlight;
    this.timeout = setTimeout(() => {
      this.appliedColor = this.textColor;
    }, 1000);
  }

  onDestroy() {
    cancelAnimationFrame(this.anim);
    clearInterval(this.timerInterval);
    clearTimeout(this.anim);
  }

  onResize() {}

  // updateDiv() {
  //   clearInterval(this.timerInterval);
  //   var div2 = document.getElementById(this.idPrefix + "inner");
  //   if (this.setup.animation != "on") {
  //     this.setup.current = this.setup.percent;
  //     this.setup.updated = 0;
  //   } else {
  //     var diff = this.setup.percent - this.setup.current;
  //     var step = (((Math.abs(diff) + 19) / 20) | 0) * Math.sign(diff);
  //     this.setup.current += step;
  //     if (this.setup.updated > 0) this.setup.updated--;
  //   }
  //   var color = "#" + (0xfff - this.setup.updated).toString(16);
  //   div2.style.width = (this.setup.width * this.setup.current) / 100 + "px";
  //   div2.innerHTML = "&nbspRunning&nbsp" + this.setup.current + "%";
  //   div2.style.color = color;
  //   if (this.setup.percent == this.setup.current && this.setup.updated == 0) return;
  //   this.timerInterval = setInterval(
  //     () => {
  //       this.updateDiv();
  //     },
  //     this.setup.percent == this.setup.current ? this.colorFrequency : this.frequency
  //   );
  // }
}
