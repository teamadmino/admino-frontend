import { takeUntil } from "rxjs/operators";
import { AdminoTooltipService } from "./../admino-tooltip.service";
import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "admino-tooltip-container",
  templateUrl: "./admino-tooltip-container.component.html",
  styleUrls: ["./admino-tooltip-container.component.scss"],
})
export class AdminoTooltipContainerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @ViewChild("tooltipRef", { read: ElementRef })
  tooltipRef: ElementRef;

  posX = 100;
  posY = 100;
  width = 100;
  calculatedWidth = 100;
  calculatedHeight = 100;

  @HostListener("document:mousemove", ["$event"]) mouseMove(e: MouseEvent) {
    const mx = e.clientX;
    const my = e.clientY;
    const screenSizeW = window.innerWidth;
    const screenSizeH = window.innerHeight;

    const gap = 10;

    this.width = 300 > innerWidth ? innerWidth * 0.8 : 300;

    this.posX = e.clientX + gap;
    this.posY = e.clientY;

    if (this.posX + this.calculatedWidth > screenSizeW) {
      this.posX = Math.round(screenSizeW - this.calculatedWidth - gap);
    }

    if (this.posY + this.calculatedHeight > screenSizeH) {
      this.posY = Math.round(screenSizeH - this.calculatedHeight - gap);
    }
  }
  constructor(public tooltip: AdminoTooltipService, private cd: ChangeDetectorRef, private el: ElementRef) {}

  ngOnInit() {
    this.tooltip.tooltipChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.cd.detectChanges();
      if (this.tooltipRef) {
        this.calculatedHeight = this.tooltipRef.nativeElement.children[0].clientHeight;
        this.calculatedWidth = this.tooltipRef.nativeElement.children[0].clientWidth;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
