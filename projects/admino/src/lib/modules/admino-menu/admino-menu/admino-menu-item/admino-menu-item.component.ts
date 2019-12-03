import { menuItemAnimation } from './admino-menu-item.animations';
import { AdminoMenuItem, AdminoMenuEvent } from './../../../../interfaces';
import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'admino-menu-item',
  templateUrl: './admino-menu-item.component.html',
  styleUrls: ['./admino-menu-item.component.scss'],
  animations: [menuItemAnimation]
})
export class AdminoMenuItemComponent implements OnInit {
  @Input() menuItem: AdminoMenuItem;
  @Input() level = 0;
  @HostBinding('class') classes;

  @Output() clickEvent: EventEmitter<AdminoMenuEvent> = new EventEmitter();

  open = false;

  constructor() {
  }

  ngOnInit() {
    this.open = this.menuItem._isActive ? true : false;
    this.classes = ('level' + this.level);
  }



  clicked(newWindow = false) {
    if (this.menuItem.children) {
      this.open = !this.open;
    } else {
      this.clickEvent.emit({ url: this.menuItem.action as unknown as string, newWindow, menuItem: this.menuItem });
    }
  }

  childClicked(menuEvent: AdminoMenuEvent) {
    this.clickEvent.emit(menuEvent);
  }
}
