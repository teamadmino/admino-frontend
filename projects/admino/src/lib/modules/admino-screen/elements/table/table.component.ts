import { TableConfig } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoVirtualTableDataSource } from '../../../admino-virtual-table/admino-virtual-table.datasource';

@Component({
  selector: 'admino-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends AdminoScreenElement implements OnInit, OnDestroy {


  dataSource;

  ngOnInit() {
    const conf = this.element.config as TableConfig;
    this.dataSource = new AdminoVirtualTableDataSource(
      {
        infoFunction: this.screenComponent.api.getInfo(conf.viewName),
        listFunction: (keys, cursor, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursor, shift, count, index, before, after),
      }
    );
  }

  valueChange(state) {
    this.control.setValue(state);
  }

  ngOnDestroy() {
  }
}
