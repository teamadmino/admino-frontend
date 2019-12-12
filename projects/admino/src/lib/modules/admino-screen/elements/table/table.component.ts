import { AdminoVirtualTableComponent } from './../../../admino-virtual-table/admino-virtual-table/admino-virtual-table.component';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementTable, ScreenElementChange } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoVirtualTableDataSource } from '../../../admino-virtual-table/admino-virtual-table.datasource';
import { Subject } from 'rxjs';

@Component({
  selector: 'admino-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends AdminoScreenElement implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();
  @ViewChild(AdminoVirtualTableComponent, { static: true }) table: AdminoVirtualTableComponent;

  dataSource;

  ngOnInit() {
    const conf = this.element as ScreenElementTable;
    this.dataSource = new AdminoVirtualTableDataSource(
      {
        listFunction: (keys, cursor, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursor, shift, count, index, before, after),
      }
    );
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (changes.columns) {
      this.table.columns = changes.columns.new;
    }
    if (changes.value) {
      this.table.update(changes.value.new);
    }
    if (changes.refreshFrequency) {

    }
  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
