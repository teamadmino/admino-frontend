import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "admino-iframe",
  templateUrl: "./iframe.component.html",
  styleUrls: ["./iframe.component.scss"],
})
export class IframeComponent extends AdminoScreenElement implements OnInit {
  safeUrl: SafeResourceUrl = "";
  @ViewChild("iframeRef", { static: true }) iframeRef: ElementRef;
  boundFunc;
  ngOnInit() {
    this.safeUrl = this.getSafeUrl(this.element.value);
    console.log(this.directive.config.config.server);

    this.boundFunc = (e) => {
      if (e.data === "hello") {
        alert("It works!");
      }
    };
    window.addEventListener("message", this.boundFunc);
  }

  onChange(changes: any) {
    // this.screen.update(this.element);
    if (changes.value) {
      this.safeUrl = this.getSafeUrl(this.element.value);
    }
    if (changes._forceRefresh) {
      this.safeUrl = this.getSafeUrl(this.element.value);
    }
  }
  getSafeUrl(val) {
    return this.directive.sanitizer.bypassSecurityTrustResourceUrl(val);
  }
  iframeLoaded() {
    this.updateIframe();
  }
  updateIframe() {
    this.iframeRef.nativeElement.contentWindow.postMessage(
      "testMessage",
      this.directive.config.config.server
    );
  }

  onDestroy() {
    window.removeEventListener("message", this.boundFunc);
  }
}
