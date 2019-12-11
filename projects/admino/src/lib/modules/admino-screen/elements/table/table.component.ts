import { AdminoVirtualTableComponent } from './../../../admino-virtual-table/admino-virtual-table/admino-virtual-table.component';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementTable } from './../../admino-screen.interfaces';
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
    this.control.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((values) => {
      if (values.__update__) {
        delete values.__update__;
        this.table.update(values);
      }
    });

    this.screenComponent.updateEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.table.columns = this.table.columns;
    });


    const conf = this.element as ScreenElementTable;
    this.dataSource = new AdminoVirtualTableDataSource(
      {
        listFunction: (keys, cursor, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursor, shift, count, index, before, after),
      }
    );
  }

  valueChange(state) {
    this.control.setValue(state);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
