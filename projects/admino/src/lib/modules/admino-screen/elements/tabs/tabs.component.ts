import { Component, OnInit, ViewChildren, QueryList, AfterContentInit, AfterViewInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { AdminoScreenComponent } from "../../admino-screen.component";

@Component({
  selector: "admino-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent extends AdminoScreenElement implements OnInit, AfterViewInit {
  @ViewChildren("screen", { read: AdminoScreenComponent }) screens: QueryList<AdminoScreenComponent>;

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.screens.toArray());
  }
  onChange(changes: any) {
    // this.screen.update(this.element);
  }
}
