import { OverlaycontentComponent } from "./overlaycontent/overlaycontent.component";
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { ComponentPortal } from "@angular/cdk/portal";
import { FlexibleConnectedPositionStrategy } from "@angular/cdk/overlay";

@Component({
  selector: "admino-tableselect",
  templateUrl: "./tableselect.component.html",
  styleUrls: ["./tableselect.component.scss"],
})
export class TableselectComponent extends AdminoScreenElement implements OnInit, AfterViewInit {
  @ViewChild("searchboxRef", { static: true }) sbRef: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    const overlayRef = this.directive.overlay.create({
      height: "400px",
      width: "600px",
      positionStrategy: this.directive.overlay
        .position()
        .flexibleConnectedTo(this.sbRef)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
          },
          {
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
          },
        ]),

      // { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }
    });

    setTimeout((params) => {
      overlayRef.updatePosition();
    }, 1000);

    const userProfilePortal = new ComponentPortal(OverlaycontentComponent);
    overlayRef.attach(userProfilePortal);
  }
}
