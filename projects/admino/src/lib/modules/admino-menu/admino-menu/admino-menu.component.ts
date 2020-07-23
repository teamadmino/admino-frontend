import { AdminoMenuItem, AdminoMenuEvent } from "./../../../interfaces";
import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "admino-menu",
  templateUrl: "./admino-menu.component.html",
  styleUrls: ["./admino-menu.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdminoMenuComponent implements OnInit {
  @Input() menus: AdminoMenuItem[];
  @Output() clickEvent: EventEmitter<AdminoMenuEvent> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  clicked(menuEvent: AdminoMenuEvent) {
    this.clickEvent.emit(menuEvent);
    this.traverse(this.menus);
  }
  traverse(children: AdminoMenuItem[]) {
    for (const menuItem of children) {
      if (menuItem.children) {
        this.traverse(menuItem.children);
      }
      menuItem._isActive = false;
    }
  }
  trackByFn(index, item: AdminoMenuItem) {
    return item.id;
  }
}
