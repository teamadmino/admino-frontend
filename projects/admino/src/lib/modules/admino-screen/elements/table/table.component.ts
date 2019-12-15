import { AdminoVirtualTableComponent } from './../../../admino-virtual-table/admino-virtual-table/admino-virtual-table.component';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementTable, ScreenElementChange, TableValue } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoVirtualTableDataSource } from '../../../admino-virtual-table/admino-virtual-table.datasource';
import { Subject } from 'rxjs';

@Component({
  selector: 'admino-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends AdminoScreenElement implements OnInit, AfterViewInit, OnDestroy {
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

    if (this.element.value) {
      if (this.element.value.index) {
        this.dataSource.index = this.element.value.index;
      }
      if (this.element.value.keys) {
        this.dataSource.keys = this.element.value.keys;
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
    if (changes.value) {
      const newValue: TableValue = {};
      for (const key of Object.keys(changes.value)) {
        newValue[key] = changes.value[key].new;
      }
      this.table.update(newValue);
    }
    if (changes.refreshFrequency) {

    }
  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
