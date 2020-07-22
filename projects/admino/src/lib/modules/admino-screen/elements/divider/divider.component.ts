import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";

@Component({
  selector: "admino-divider",
  templateUrl: "./divider.component.html",
  styleUrls: ["./divider.component.scss"],
})
export class DividerComponent extends AdminoScreenElement implements OnInit {
  ngOnInit() {}
}
