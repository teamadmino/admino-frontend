import { AdminoVirtualTableComponent } from './../../../admino-virtual-table/admino-virtual-table/admino-virtual-table.component';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementTable, ScreenElementChange, TableValue } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoVirtualTableDataSource } from '../../../admino-virtual-table/admino-virtual-table.datasource';
import { Subject } from 'rxjs';
import { propExists } from '../../../../utils/propExists';

@Component({
  selector: 'admino-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends AdminoScreenElement implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();
  @ViewChild(AdminoVirtualTableComponent, { static: true }) table: AdminoVirtualTableComponent;

  dataSource: AdminoVirtualTableDataSource;

  ngOnInit() {
    const conf = this.element as ScreenElementTable;
    this.dataSource = new AdminoVirtualTableDataSource(
      {
        listFunction: (keys, cursor, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursor, shift, count, index, before, after),
      }
    );

    if (this.element.value) {
      if (propExists(this.element.value.index)) {
        this.dataSource.state.index = this.element.value.index;
      }
      if (propExists(this.element.value.keys)) {
        this.dataSource.state.keys = this.element.value.keys;
      }
      if (propExists(this.element.value.cursorPosPercent)) {
        this.table.lastSetCursorPosPercent = this.element.value.cursorPosPercent;
      }
      // this.table.update(this.element.value);
    }


  }
  ngAfterViewInit() {

  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (changes.columns) {
      this.table.columns = changes.columns.new;
    }
    if (changes.indexes) {
      this.table.indexes = changes.indexes.new;
    }

    if (changes.value) {
      // const newValue: TableValue = {};
      // for (const key of Object.keys(changes.value)) {
      //   newValue[key] = changes.value[key].new;
      // }
      this.table.update(changes.value.new);
    }
    if (changes.refreshFrequency) {

    }
    if (changes._forceRefresh) {
      this.table.dataSource.loadData();
    }
  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
