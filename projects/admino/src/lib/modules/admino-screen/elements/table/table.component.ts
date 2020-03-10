import { isEqual, cloneDeep } from 'lodash';
import { AdminoVirtualTableComponent } from './../../../admino-virtual-table/admino-virtual-table/admino-virtual-table.component';
import { takeUntil, skip } from 'rxjs/operators';
import { ScreenElementTable, ScreenElementChange, TableValue } from './../../admino-screen.interfaces';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoVirtualTableDataSource } from '../../../admino-virtual-table/admino-virtual-table.datasource';
import { Subject } from 'rxjs';
import { propExists } from '../../../../utils/propExists';

@Component({
  selector: 'admino-screen-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends AdminoScreenElement implements OnInit, AfterViewInit {
  @ViewChild(AdminoVirtualTableComponent, { static: true }) table: AdminoVirtualTableComponent;

  dataSource: AdminoVirtualTableDataSource;
  element: ScreenElementTable;
  currVal;

  ngOnInit() {
    this.directive.valueChangeEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe((valChange) => {

      if (this.currVal !== undefined && !isEqual(this.currVal.keys, valChange.keys)) {
        if (this.element.keyChangeAction) {
          this.handleAction(this.element.keyChangeAction);
        }
      }
      this.currVal = cloneDeep(valChange);
    });

    const conf = this.element as ScreenElementTable;
    this.dataSource = new AdminoVirtualTableDataSource(
      {
        listFunction: (keys, cursorpos, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursorpos, shift, count, index, before, after),
      }
    );


    if (this.element.value) {
      if (propExists(this.element.value.index)) {
        this.dataSource.state.index = this.element.value.index;
        this.dataSource.state.cursorpos = this.element.value.cursorpos;
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
    if (changes.viewName) {
      this.dataSource.config.listFunction =
        (keys, cursor, shift, count, index, before, after) =>
          this.screenComponent.api.list(changes.viewName.new, keys, cursor, shift, count, index, before, after);
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
    console.log(changes)

    if (changes._forceRefresh) {
      this.table.dataSource.loadData();
    }
  }

}
