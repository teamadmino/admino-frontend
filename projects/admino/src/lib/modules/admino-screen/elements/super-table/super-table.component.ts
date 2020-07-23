import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { ScreenElementTable, ScreenElementChange } from "../../admino-screen.interfaces";
import { AdminoTableComponent } from "../../../admino-table/admino-table/admino-table.component";
import { takeUntil, debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { isEqual, debounce, cloneDeep } from "lodash";
import { propExists } from "../../../../utils/propExists";
import { timer, Subscription } from "rxjs";
import { AdminoTableDataSource } from "../../../admino-table/admino-table/admino-table.datasource";

@Component({
  selector: "admino-super-table",
  templateUrl: "./super-table.component.html",
  styleUrls: ["./super-table.component.scss"],
})
export class SuperTableComponent extends AdminoScreenElement implements OnInit, AfterViewInit {
  dataSource: AdminoTableDataSource;
  @ViewChild(AdminoTableComponent, { static: true })
  table: AdminoTableComponent;
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
      },
      this.directive.sanitizer
    );
  }

  ngAfterViewInit() {
    if (this.element.value) {
      this.dataSource.state = Object.assign(this.dataSource.state, this.element.value);
      this.dataSource.setKeys(this.element.value.keys);
      this.table.dataSource.loadData().then((params) => {
        this.table.gotoPos(this.dataSource.viewpos);
      });
    }
  }

  subscribeToValueChange() {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe();
    }
    const keyChangeAction = this.getAction("keyChange");
    const dt = keyChangeAction && keyChangeAction.debounce ? keyChangeAction.debounce : 50;
    this.valueChangeSub = this.directive.valueChangeEvent
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(dt),
        filter((newVal) => {
          return !isEqual(this.oldVal, newVal);
        })
      )
      .subscribe((newVal) => {
        if (this.element.value !== undefined) {
          if (keyChangeAction) {
            this.handleAction(keyChangeAction);
          }
        }
        this.oldVal = cloneDeep(newVal);
      });
  }
  handleCellChange(e) {
    const cellChangeAction = this.getAction("cellChange");
    if (cellChangeAction) {
      this.handleAction(cellChangeAction);
    }
  }
  handleCellClick(e) {
    const cellClickAction = this.getAction("cellClick");
    if (cellClickAction) {
      this.handleAction(cellClickAction);
    }
  }
  handleCellDoubleClick(e) {
    const cellClickAction = this.getAction("cellDoubleClick");
    if (cellClickAction) {
      this.handleAction(cellClickAction);
    }
  }
  handleHeaderCellClick(e) {
    const headerClickAction = this.getAction("headerCellClick");
    if (headerClickAction) {
      this.handleAction(headerClickAction);
    }
  }
  onChange(changes: { [id: string]: ScreenElementChange }) {
    let reinitNeeded = false;
    if (changes.columns) {
      reinitNeeded = true;
      this.table.columns = changes.columns.new;
    }
    if (changes.indexes) {
      this.table.indexes = changes.indexes.new;
    }
    if (changes.viewName) {
      this.dataSource.config.listFunction = (keys, cursor, shift, count, index, before, after) =>
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

    if (propExists(changes.value)) {
      this.dataSource.state = Object.assign(this.dataSource.state, this.element.value);
      this.dataSource.setKeys(this.element.value.keys);
    }
    if (changes.hidden) {
      reinitNeeded = true;
    }

    if (reinitNeeded) {
      // this.table.updateSize();
      // this.table.scrollEvent();
      // this.table.pageChange();
      this.table.reinit();
    }
    console.log("forcerefreshoutside", changes);

    if (changes.value || changes._forceRefresh || changes.forceRefresh) {
      console.log("forcerefresh", changes);

      const shift =
        propExists(changes.value) && propExists(changes.value.new) && changes.value.new.shift !== undefined ? changes.value.new.shift : 0;
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
  onDestroy() {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe();
    }
  }
}
