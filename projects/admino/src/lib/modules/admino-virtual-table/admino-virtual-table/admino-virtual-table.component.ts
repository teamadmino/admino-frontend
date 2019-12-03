import { takeUntil } from 'rxjs/operators';
import { AdminoVirtualTableDataSource } from '../admino-virtual-table.datasource';
import { Component, OnInit, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChild, Input, OnDestroy, HostListener } from '@angular/core';
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

  columns = [];
  sortedColumn;
  @Input() dataSource: AdminoVirtualTableDataSource;
  prevStart = 0;
  prevEnd = 0;
  prevVisibleStart = 0;
  prevVisibleEnd = 0;
  itemSize = 51;

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
      this.handleInteraction(this.dataSource.count);
    }
    if (event.keyCode === PAGE_UP) {
      this.handleInteraction(-(this.dataSource.count));
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
    // setTimeout((params) => {
    // this.items.length = 5000;
    // }, 1000);
    // this.items.length = 900;
    // setInterval(() => {
    //   this.totalsize = Math.abs(Math.random() * 50000);
    //   console.log('totalsizeChange');
    // }, 5500)
  }
  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout((params) => {
      this.cd.detectChanges();
      this.refresh();
    });

    this.dataSource.infoLoaded.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoaded) => {
      if (isLoaded) {
        this.calculateWidths();
      }
    });

    this.dataSource.connect().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        if (this.totalsize !== this.dataSource.totalsize) {
          this.totalsize = this.dataSource.totalsize;
          this.cd.detectChanges();
          this.vsRef.refresh();
        }
        this.vsRef.patchData(this.dataSource.rows);
        this.cd.detectChanges();
      }
      // this.vsRef.onScroll(null);
    });

    // setInterval((params) => {
    //   this.totalsize = Math.round(60000 * Math.random());
    //   this.cd.detectChanges();
    //   this.vsRef.refresh();
    // }, 3000)

  }

  sortClicked(column, sorter) {
    // const dir = e.direction === 'asc' ? 1 : -1;
    sorter.direction = sorter.direction * -1;
    if (this.sortedColumn === column && sorter.direction === 1) {
      this.sortedColumn = null;
      sorter.direction = -1;
      this.dataSource.selectedIndex = 1;
    } else {
      this.sortedColumn = column;
      const found = this.dataSource.indexes.find((index) => {
        return index.keys[0] === this.sortedColumn.id;
      });
      if (found) {
        this.dataSource.selectedIndex = (this.dataSource.indexes.indexOf(found) + 1) * sorter.direction;
      } else {
        this.dataSource.selectedIndex = 1;
      }
    }
    this.vsRef.clearData();
    this.dataSource.loadData();
  }


  handleInteraction(shift) {

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
    this.dataSource.loadData(shift)
  }
  afterRender(e) {
    if (this.prevStart !== e.start || this.prevEnd !== e.end) {
      // console.log(e);
      const count = e.visibleEnd - e.visibleStart;
      this.dataSource.count = count;
      // console.log(e.start, e.end);
      // this.dataSource.cursorAbsPos -= shift;
      // console.log('cursor ' + this.dataSource.cursor);
      // console.log('cursorAbsPos ' + this.dataSource.cursorAbsPos);

      // const shift = e.start - this.prevStart;
      // this.dataSource.cursorPos += shift;
      // console.log('shift ' + shift);
      // console.log('cursorPos ' + this.dataSource.cursorPos);
      // console.log(this.dataSource.cursorAbsPos);
      // this.dataSource.cursor = this.dataSource.cursorAbsPos - e.visibleStart;
      this.dataSource.cursor = -e.visibleStart + this.dataSource.cursorAbsPos;
      this.dataSource.loadData();
      // this.dataSource.loadData(e.visibleStart);

      this.cd.detectChanges();
      this.refresh();
    }

    this.prevStart = e.start;
    this.prevEnd = e.end;

    this.prevVisibleStart = e.visibleStart;
    this.prevVisibleEnd = e.visibleEnd;
    // console.log(this.headerRef.nativeElement.childNodes[0])
    // for (let j = 0; j < this.columnWidths.length; j++) {
    //   const cw = this.columnWidths[j];
    //   this.headerRef.nativeElement.childNodes[0].childNodes[j].style.maxWidth = cw + 'px';
    //   this.headerRef.nativeElement.childNodes[0].childNodes[j].style.width = cw + 'px';
    // }

  }
  handleScroll() {
    this.refresh();

  }

  calculateWidths() {
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
    // const trArr = (this.bodyRef.nativeElement as HTMLElement).children;
    // this.headerRef.nativeElement.childNodes[0].style.width = trArr[0].scrollWidth + 'px';
    // if (trArr && trArr[0]) {
    //   this.columnWidths = new Array(trArr[0].children.length).fill(0);
    //   for (let a = 0; a < trArr.length; a++) {
    //     const columns = trArr[a].children;
    //     for (let i = 0; i < columns.length; i++) {
    //       const col = columns[i];
    //       if (col.clientWidth > this.columnWidths[i]) {
    //         this.columnWidths[i] = col.clientWidth;
    //       }
    //     }
    //   }
    // }

    this.headerRef.nativeElement.childNodes[0].style.marginLeft = - this.bodyRef.nativeElement.scrollLeft + 'px';
    this.scrollBarWidth = this.bodyRef.nativeElement.offsetWidth - this.bodyRef.nativeElement.clientWidth;

    // const availableWidth = this.tableRef.nativeElement.clientWidth - this.columnWidths[this.columnWidths.length - 1];

    // for (let i = 0; i < this.dataSource.columns.length; i++) {

    // }
    const headers = this.headerRef.nativeElement.childNodes[0].childNodes[0].childNodes;
    // let prevTh;
    headers.forEach(th => {
      if (th.classList && th.classList.contains('stickyEnd')) {
        // th.style.marginRight = this.scrollBarWidth + 'px';
        // th.style.right = this.scrollBarWidth + 'px';
        // th.style.paddingRight = this.scrollBarWidth + 'px';
        // prevTh.classList.add('sticky');
      }
      // prevTh = th;
    });
  }



  setSelected(e, index, absIndex) {
    if (e.__loaded__) {
      this.dataSource.cursorAbsPos = absIndex;
      this.dataSource.cursor = this.dataSource.cursorAbsPos - this.prevVisibleStart;
      this.dataSource.setKeys(e);
    }
    this.dataSource.loadData();
  }
  resize() {
    // this.afterRender();
    this.calculateWidths();
    this.vsRef.refresh();
    this.handleScroll();
  }

  ngOnDestroy() {

    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
