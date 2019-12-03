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
    this.dataSource = new AdminoVirtualTableDataSource(
      {
        infoFunction: this.screenComponent.api.getInfo('uszips'),
        listFunction: (keys, cursor, shift, count, index, before, after) =>
          this.screenComponent.api.list('uszips', keys, cursor, shift, count, index, before, after),
      }
    );
  }
  ngOnDestroy() {
    console.log("ONDESTROY TABLE")

  }
}
