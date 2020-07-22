import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";

@Component({
  selector: "admino-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"],
})
export class ImageComponent extends AdminoScreenElement
  implements OnInit, AfterViewInit {
  @ViewChild("imageRef", { static: true, read: ElementRef })
  imageRef: ElementRef;
  loadedImage;
  imgWidth = "0px";
  imgHeight = "0px";
  @HostListener("window:resize") resize() {
    this.recalculate();
  }
  ngOnInit() {
    this.imgWidth = this.element.width;
    this.imgHeight = this.element.height;
    this.onChange(null);
  }

  ngAfterViewInit() {}
  onChange(changes: any) {
    this.loadImage();
    this.loadedImage.src = this.element.src;
  }

  recalculate() {
    const maxW = this.imageRef.nativeElement.parentNode.parentNode.clientWidth;
    this.imgWidth =
      this.element.width !== undefined
        ? this.element.width
        : this.loadedImage.width + "px";
    this.directive.cd.detectChanges();
    let w = this.imageRef.nativeElement.clientWidth;
    let h = this.loadedImage.height;
    h = this.loadedImage.height * (w / this.loadedImage.width);
    this.imgHeight = h + "px";
    this.directive.cd.detectChanges();
    // if (this.element.height !== undefined) {
    //   this.imgHeight = this.element.height;
    // } else {
    //   // this.imgHeight = this.element.height * (maxW / this.loadedImage.width);
    // }
  }
  loadImage() {
    if (this.loadedImage) {
      this.loadedImage.onload = null;
      this.loadedImage = null;
    }
    this.loadedImage = new Image();
    this.loadedImage.onload = (img) => {
      this.recalculate();
    };
  }
}
