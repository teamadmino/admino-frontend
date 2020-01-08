import { TableValue } from './../../admino-screen/admino-screen.interfaces';
import { ActionEvent, AdminoButton, AdminoAction } from './../../../interfaces';
import { takeUntil } from 'rxjs/operators';
import { AdminoVirtualTableDataSource, VirtualDataSourceInfoField } from '../admino-virtual-table.datasource';
import { Component, OnInit, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChild, Input, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminoVirtualScrollDirective } from '../admino-virtual-scroll.directive';
import { DOWN_ARROW, UP_ARROW, PAGE_DOWN, PAGE_UP, ENTER, SHIFT, CONTROL } from '@angular/cdk/keycodes';
import { adminoVirtualTableAnimation } from './admino-virtual-table.animation';

@Component({
  selector: 'admino-virtual-table',
  templateUrl: './admino-virtual-table.component.html',
  styleUrls: ['./admino-virtual-table.component.scss'],
  animations: [adminoVirtualTableAnimation]
})
export class AdminoVirtualTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe: Subject<null> = new Subject();

  @ViewChild('tableRef', { static: true }) tableRef: ElementRef;
  @ViewChild('headerRef', { static: true }) headerRef: ElementRef;
  @ViewChild('bodyRef', { static: true }) bodyRef: ElementRef;
  @ViewChild(AdminoVirtualScrollDirective, { static: true }) vsRef: AdminoVirtualScrollDirective;
  columnWidths = [];
  scrollBarWidth = 10;
  totalsize = 40000;

  lastSetCursorPosPercent = 0.5;


  sortedColumn;
  @Input() dataSource: AdminoVirtualTableDataSource;


  _columns: any[];
  @Input() public set columns(v: any) {
    this._columns = v;
    this.updateColumns();

  }
  public get columns(): any {
    return this._columns;
  }
  _indexes: any[];
  @Input() public set indexes(v: any) {
    this._indexes = v;
    this.updateIndexes();
  }
  public get indexes(): any {
    return this._indexes;
  }



  @Input() tableButtons: AdminoButton[];
  @Input() rowButtons: AdminoButton[];

  @Output() actionEvent: EventEmitter<AdminoAction> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  prevStart = 0;
  prevEnd = 0;
  prevVisibleStart = 0;
  prevVisibleEnd = 0;
  @Input() itemSize = 51;
  @Input() hideBottomBorder = false;
  @Input() hideSideBorder = false;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // if (!this.focused && !this.forceFocus) {
    //   return;
    // }
    if (event.keyCode === DOWN_ARROW) {
      event.preventDefault();
      this.handleInteraction(1);
    }
    if (event.keyCode === UP_ARROW) {
      event.preventDefault();
      this.handleInteraction(-1);
    }
    if (event.keyCode === PAGE_DOWN) {
      this.handleInteraction(this.dataSource.state.count);
    }
    if (event.keyCode === PAGE_UP) {
      this.handleInteraction(-(this.dataSource.state.count));
    }
    // if (event.keyCode === ENTER) {
    //   if (this.isTableSelect) {
    //     this.selectRow(this.dataSource.resultSubject.value[this.dataSource.cursor]);
    //   } else {
    //     this.handleViewAction(this.dataSource.resultSubject.value[this.dataSource.cursor]);
    //   }
    // }
    // if (event.keyCode === SHIFT) {
    //   if (!this.shiftKey.value) {
    //     const row = this.dataSource.resultSubject.value[this.dataSource.cursor];
    //     if (this.selection.getIndex(row) > -1) {
    //       this.selectionAction = 'deselect';
    //     } else {
    //       this.selectionAction = 'select';

    //     }
    //     this.shiftKey.next(true);
    //   }
    // }
    // if (event.keyCode === CONTROL) {
    //   this.ctrlKey.next(true);
    // }
  }
  constructor(private cd: ChangeDetectorRef) {

  }


  handleInteraction(shift) {
    // this.dataSource.state.shift = shift;
    // this.dataSource.state.cursor = this.dataSource.state.cursor - shift;
    // this.dataSource.loadData(shift);
    // if (this.dataSource.cursorAbsPos + shift >= 0 && this.dataSource.cursorAbsPos + shift <= this.dataSource.totalsize) {
    //   this.dataSource.cursorAbsPos += shift;
    //   this.vsRef.scrollToItem(this.dataSource.cursorAbsPos);
    // }
    // if (!this.dataSource || !this.dataSource.currentData) {
    //   return;
    // }
    // if (shift < 0) {
    //   if (this.dataSource.cursor + shift > -1) {
    //     this.handleLoadData(shift);
    //   } else if (this.dataSource.viewpos > 0) {
    //     this.handleLoadData(shift, true);
    //   }
    // }
    // if (shift > 0) {
    //   if (this.dataSource.cursor + shift < this.dataSource.count
    //     && this.dataSource.cursor + shift < this.dataSource.currentData.data.length) {
    //     this.handleLoadData(shift);
    //   } else if (this.dataSource.viewpos + this.dataSource.count < this.dataSource.totalsize) {
    //     this.handleLoadData(shift, true);
    //   }
    // }
  }
  handleLoadData(shift) {
    this.dataSource.loadData(shift);
  }


  ngOnInit() {
  }
  afterRender(e) {
    if (this.prevStart !== e.start || this.prevEnd !== e.end) {
      const count = e.visibleEnd - e.visibleStart;
      this.dataSource.state.count = count;
      this.dataSource.state.cursor = -e.visibleStart + this.dataSource.cursorAbsPos;
      this.dataSource.loadData();
      this.cd.detectChanges();
      this.refresh();
    }
    this.prevStart = e.start;
    this.prevEnd = e.end;

    this.prevVisibleStart = e.visibleStart;
    this.prevVisibleEnd = e.visibleEnd;



  }
  ngAfterViewInit() {


    this.dataSource.loadDataStart.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      // console.log('table value change');
      // console.log(value);
      this.valueChange.next(value);
    });

    this.dataSource.connect().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        // console.log('browse response');
        // console.log(data);
        if (this.totalsize !== this.dataSource.totalsize) {
          this.totalsize = this.dataSource.totalsize;
          this.cd.detectChanges();
          this.vsRef.refresh();
        }
        this.vsRef.patchData(this.dataSource.rows);
        this.cd.detectChanges();


        // console.log("count", this.dataSource.count)
        if (this.lastSetCursorPosPercent != null) {
          this.scrollToSelected(this.lastSetCursorPosPercent);
          this.lastSetCursorPosPercent = null;
          // console.log("SCROLL HAPPENDED")
        }

      }
    });
    this.calculateWidths();
    this.vsRef.refresh();


  }

  update(value: TableValue) {
    // console.log('table update');
    if (!value) {
      return;
    }
    // console.log(value)
    if (value.keys) {
      this.dataSource.state.keys = value.keys;
    }
    if (value.index !== undefined) {
      this.vsRef.clearData();
      this.dataSource.state.index = value.index;
    }
    if (value.cursorPosPercent !== undefined) {
      this.lastSetCursorPosPercent = value.cursorPosPercent;
    }
    // console.log(this.dataSource.keys)
    this.dataSource.loadData();
  }

  updateColumns() {
    this.dataSource.columns = [];
    this.dataSource.displayedColumns = [];
    this.dataSource.keyIds = [];
    this._columns.forEach((field: VirtualDataSourceInfoField) => {
      const column = { label: field.description, length: field.length, id: field.id };
      this.dataSource.columns.push(column);
      this.dataSource.displayedColumns.push(column);
      this.dataSource.keyIds.push(field.id);
    });
  }
  updateIndexes() {
    this.dataSource.indexes = this.indexes;
    this._indexes.forEach((index) => {
      const id = index.keys[0];
      const found = this.dataSource.columns.find((column) => {
        return column.id === id;
      });
      if (found) {
        found.sortable = true;
      }
    });
  }

  scrollToSelected(cursorPosPercent = 0.5) {
    const cursorPos = this.dataSource.cursorAbsPos - Math.floor((this.dataSource.state.count - 1) * cursorPosPercent);
    this.vsRef.scrollToItem(cursorPos);
  }

  sortClicked(column, sorter) {
    // const dir = e.direction === 'asc' ? 1 : -1;
    sorter.direction = sorter.direction * -1;
    if (this.sortedColumn === column && sorter.direction === 1) {
      this.sortedColumn = null;
      sorter.direction = -1;
      this.dataSource.state.index = 1;
    } else {
      this.sortedColumn = column;
      const found = this.dataSource.indexes.find((index) => {
        return index.keys[0] === this.sortedColumn.id;
      });
      if (found) {
        this.dataSource.state.index = (this.dataSource.indexes.indexOf(found) + 1) * sorter.direction;
      } else {
        this.dataSource.state.index = 1;
      }
    }
    this.vsRef.clearData();
    // this.vsRef.refresh();
    this.dataSource.loadData().then(() => {
      this.scrollToSelected();
    });
  }




  calculateWidths() {
    // console.log('calculateWidths');
    if (!(this.bodyRef.nativeElement as HTMLElement).children[0]) {
      return;
    }
    const fullWidth = this.tableRef.nativeElement.clientWidth;
    const trArr = (this.bodyRef.nativeElement as HTMLElement).children[0].children;
    this.scrollBarWidth = this.bodyRef.nativeElement.offsetWidth - this.bodyRef.nativeElement.clientWidth;

    // const actionsWidth = trArr[trArr.length - 1].clientWidth;
    // const availableWidth = fullWidth - actionsWidth - this.scrollBarWidth;
    const availableWidth = fullWidth - this.scrollBarWidth;
    let max = 0;
    this.dataSource.displayedColumns.forEach((col) => {
      max += col.length;
    });
    for (let i = 0; i < this.dataSource.displayedColumns.length; i++) {
      const col = this.dataSource.displayedColumns[i];
      this.columnWidths[i] = Math.floor(availableWidth / max * col.length);
      if (this.columnWidths[i] < 150) {
        this.columnWidths[i] = 150;
      }
    }
    // this.columnWidths[this.dataSource.displayedColumns.length] = actionsWidth;
    // console.log(this.dataSource.displayedColumns);
  }

  refresh() {
    this.headerRef.nativeElement.childNodes[0].style.marginLeft = - this.bodyRef.nativeElement.scrollLeft + 'px';
    this.scrollBarWidth = this.bodyRef.nativeElement.offsetWidth - this.bodyRef.nativeElement.clientWidth;
    // const availableWidth = this.tableRef.nativeElement.clientWidth - this.columnWidths[this.columnWidths.length - 1];

  }

  setSelected(e, index, absIndex) {
    if (e.__loaded__) {
      this.dataSource.cursorAbsPos = absIndex;
      this.dataSource.state.cursor = this.dataSource.cursorAbsPos - this.prevVisibleStart;
      this.dataSource.setKeys(e);
    }
    this.dataSource.loadData();
  }

  tableButtonClicked(btn: AdminoButton) {
    this.actionEvent.next(btn.action);
  }


  resize() {
    // this.afterRender();
    this.calculateWidths();
    this.refresh();
    this.vsRef.refresh();
  }

  ngOnDestroy() {

    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
