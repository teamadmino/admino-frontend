import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoTableDataSource } from '../../../admino-table/admino-table/admino-table.datasource';
import { ScreenElementTable, ScreenElementChange } from '../../admino-screen.interfaces';
import { AdminoTableComponent } from '../../../admino-table/admino-table/admino-table.component';

@Component({
  selector: 'admino-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent extends AdminoScreenElement implements OnInit {
  dataSource: AdminoTableDataSource;
  @ViewChild(AdminoTableComponent, { static: true }) table: AdminoTableComponent;

  ngOnInit() {

    const conf = this.element as ScreenElementTable;
    this.dataSource = new AdminoTableDataSource(
      {
        listFunction: (keys, cursorpos, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursorpos, shift, count, index, before, after),
      }
    );

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


    // if (changes.value) {
    //   // const newValue: TableValue = {};
    //   // for (const key of Object.keys(changes.value)) {
    //   //   newValue[key] = changes.value[key].new;
    //   // }
    //   this.table.update(changes.value.new);
    // }
    if (changes.refreshFrequency) {

    }
    // this.table.updateSize();
    this.table.dataSource.loadData();
    // .then((params) => {
    //   this.table.updateSize();
    //   this.table.updateRows();
    // });
    // this.table.updateDataSource();

    if (changes._forceRefresh) {
      this.table.dataSource.loadData().then((params) => {
        this.table.updateSize();
        this.table.updateRows();
        console.log("forcerefresh")
      });
    }
  }
}
