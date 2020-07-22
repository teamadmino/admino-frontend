import { Component, OnInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";

@Component({
  selector: "admino-menu-elem",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent extends AdminoScreenElement implements OnInit {
  ngOnInit() {}
  buttonClicked(item) {
    if (item.action) {
      this.handleAction(item.action);
    }
  }
}
