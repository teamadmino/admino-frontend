import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { AdminoTableDataSource } from '../../../admino-table/admino-table/admino-table.datasource';
import { ScreenElementTable, ScreenElementChange } from '../../admino-screen.interfaces';
import { AdminoTableComponent } from '../../../admino-table/admino-table/admino-table.component';
import { takeUntil, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { isEqual, debounce, cloneDeep } from 'lodash';
import { propExists } from '../../../../utils/propExists';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'admino-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent extends AdminoScreenElement implements OnInit {
  dataSource: AdminoTableDataSource;
  @ViewChild(AdminoTableComponent, { static: true }) table: AdminoTableComponent;
  oldVal;
  valueChangeSub: Subscription;
  ngOnInit() {
    // debounceTime(1000),

    this.subscribeToValueChange();
    const conf = this.element as ScreenElementTable;
    this.dataSource = new AdminoTableDataSource(
      {
        listFunction: (keys, cursorpos, shift, count, index, before, after) =>
          this.screenComponent.api.list(conf.viewName, keys, cursorpos, shift, count, index, before, after, this.element.customVars),
      }, this.directive.sanitizer
    );
  }

  subscribeToValueChange() {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe();
    }
    const keyChangeAction = this.getAction('keyChange');
    const dt = keyChangeAction.debounce ? keyChangeAction.debounce : 50;
    this.valueChangeSub = this.directive.valueChangeEvent.pipe(takeUntil(this.ngUnsubscribe),
      debounceTime(dt),
      filter((newVal) => {
        return !isEqual(this.oldVal, newVal);
      })
    ).subscribe((newVal) => {
      if (this.element.value !== undefined) {
        if (keyChangeAction) {
          this.handleAction(keyChangeAction);
        }
      }
      this.oldVal = cloneDeep(newVal);
    });

  }

  handleCellClick(e) {
    const cellClickAction = this.getAction('cellClick');
    if (cellClickAction) {
      this.handleAction(cellClickAction);
    }
  }
  handleHeaderCellClick(e) {
    const headerClickAction = this.getAction('headerCellClick');
    if (headerClickAction) {
      this.handleAction(headerClickAction);
    }
  }
  onChange(changes: { [id: string]: ScreenElementChange; }) {
    let reinitNeeded = false;
    if (changes.columns) {
      reinitNeeded = true;
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
    if (changes.rowHeight) {
      reinitNeeded = true;
    }
    if (changes.actions) {
      this.subscribeToValueChange();
    }

    if (this.element.value && this.element.value.shift) {
      delete this.element.value.shift;
      delete this.directive.element.value.shift;
    }
    // console.log(this.element.value)
    // console.log(changes.value.new)
    if (propExists(changes.value)) {

      this.dataSource.state = Object.assign(this.dataSource.state, this.element.value);
      this.dataSource.setKeys(this.element.value.keys);
      // console.log("stateMerge", changes.value)
      // if (this.element.value.cursor !== undefined) {
      //   this.table.dataSource.loadData().then((params) => {
      //   });
      // }

      // if (propExists(this.element.value.index)) {
      //   this.dataSource.state.index = this.element.value.index;
      //   this.dataSource.state.cursorpos = this.element.value.cursorpos;
      // }
      // if (propExists(this.element.value.keys)) {
      //   this.dataSource.state.keys = this.element.value.keys;
      // }
      // if (propExists(this.element.value.cursorPosPercent)) {
      //   this.table.lastSetCursorPosPercent = this.element.value.cursorPosPercent;
      // }
      // this.table.update(this.element.value);

    }

    // if (changes.value) {
    //   // const newValue: TableValue = {};
    //   // for (const key of Object.keys(changes.value)) {
    //   //   newValue[key] = changes.value[key].new;
    //   // }
    //   this.table.update(changes.value.new);
    // }

    // this.table.updateSize();
    // .then((params) => {
    //   this.table.updateSize();
    //   this.table.updateRows();
    // });
    // this.table.updateDataSource();

    // this.table.dataSource.loadData().then((params) => {
    //   this.table.scrollEvent();
    // });

    if (reinitNeeded) {
      this.table.updateSize();
      this.table.scrollEvent();
      this.table.pageChange();
    }

    if (changes.value || changes._forceRefresh || changes.forceRefresh) {
      const shift = (propExists(changes.value) && propExists(changes.value.new) && changes.value.new.shift !== undefined) ? changes.value.new.shift : 0;
      // console.log("shift", shift)
      // console.log(this.dataSource.state)
      this.table.dataSource.loadData(shift).then((params) => {

        // if (shift !== 0) {
        // }
        this.table.gotoPos(this.dataSource.viewpos);


        // this.table.prevRowStart = -1;
        // this.table.prevRowEnd = -1;

        // if (propExists(changes.value) && propExists(changes.value.new) && isEqual(changes.value.new.keys, changes.value.old.keys) === false) {
        //   console.log("GOTOPOS", changes.value.new.keys, changes.value.old.keys)
        // } else {
        //   this.table.updateSize();
        //   this.table.scrollEvent();
        //   this.table.pageChange();
        // }
      });
    }
  }
}
