import { AdminoTableDataSource, VirtualDataSourceInfoColumn } from './admino-table.datasource';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormatService } from 'admino/src/lib/services/format.service';

export interface VirtualRow {
  virtualId: number;
  absoluteId: number;
  pos: number;
  data?: any;
}

@Component({
  selector: 'admino-table',
  templateUrl: './admino-table.component.html',
  styleUrls: ['./admino-table.component.scss']
})
export class AdminoTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @Input() dataSource: AdminoTableDataSource;
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




  @ViewChild('tableRef', { read: ElementRef, static: true }) tableRef;
  @ViewChild('scrollerRef', { read: ElementRef, static: true }) scrollerRef;
  @ViewChild('fakeContentRef', { read: ElementRef, static: true }) fakeContentRef;
  @ViewChild('scrollerContentRef', { read: ElementRef, static: true }) scrollerContentRef;
  @ViewChild('bodyRef', { static: true }) bodyRef: ElementRef;

  columnWidths = [];
  sortedColumn;


  vrows: VirtualRow[] = [];
  rowHeight = 50;
  roundedRowHeight = 50;
  viewportSize = 0;
  browserMaxSize = 0;

  // largePagination
  lpage = 0;
  lpageSize = 30000;
  lastPage = 0;
  rowCountOnLastPage = 0;
  // smallPagination
  spage = 0;
  rowCount = 10;

  scrollPos = 0;
  maxScrollPos = 0;
  prevScrollPos = 0;
  scrollPosCoeff = 0;
  scrollPosCoeffNormal = 0;
  scrollBarWidth = 0;
  lpageCoeff = 0;
  //
  totalsize = 100000;
  adjustedTotalsize = 0;


  scrollPercent = 1;
  fakeScrollerHeight = 0;
  manualScroll = false;

  rowStart = 0;
  rowEnd = 0;
  prevRowStart = null;
  prevRowEnd = null;

  asd = 1;

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.manualScroll = true;
  }
  constructor(private cd: ChangeDetectorRef, public formatService: FormatService) { }

  ngOnInit() {
    this.browserMaxSize = this.calcMaxBrowserScrollSize();
    this.reinit();
    // this.gotoPos(900719000);
    // this.gotoPos(9007199254740991);
    // this.gotoPos(9007199254740991);

    // setInterval(() => {
    //   this.gotoPos(this.asd);
    //   this.asd += 100000;
    // }, 100);
    // this.gotoPos(9007199254740991);
  }
  ngAfterViewInit() {
    this.dataSource.connect().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {


        // console.log('browse response');
        // console.log(data);
        if (this.totalsize !== this.dataSource.totalsize) {
          this.totalsize = this.dataSource.totalsize;
          this.updateSize();
        }
        this.updateRows();
        for (const vrow of this.vrows) {
          vrow.data = this.dataSource.buffer.get(vrow.absoluteId);
        }
        // this.vsRef.patchData(this.dataSource.rows);
        this.cd.detectChanges();
        // console.log("count", this.dataSource.count)
        // if (this.lastSetCursorPosPercent != null) {
        //   this.scrollToSelected(this.lastSetCursorPosPercent);
        //   this.lastSetCursorPosPercent = null;
        //   // console.log("SCROLL HAPPENDED")
        // }

      }
    });
    this.dataSource.loadData();
  }
  reinit() {
    this.updateSize();
    this.updateRows();
    this.pageChange();

  }
  gotoPos(absoluteId = 0) {
    if (absoluteId >= this.adjustedTotalsize) {
      absoluteId = this.adjustedTotalsize;
    }
    const targetPage = this.lpageSize > 0 ? Math.floor(absoluteId / this.lpageSize) : 0;
    this.lpage = targetPage;
    this.pageChange();
    // console.log("targetPage", targetPage);
    // absoluteId = absoluteId - this.lpage;

    // const remainder = absoluteId > this.lpageSize && (this.lpageSize - 1) > 0 ? absoluteId % (this.lpageSize - 1) : absoluteId;
    const remainder = this.lpageSize > 0 ? absoluteId % (this.lpageSize) : 0;
    this.tableRef.nativeElement.scrollTop = (remainder + this.lpageCoeff) * this.roundedRowHeight;
    // console.log(this.tableRef.nativeElement.scrollTop);
    this.updateRows();
    // console.log(targetPage);
  }
  scrollbarMouseDown() {
    this.manualScroll = true;
  }
  scrollbarScroll(e) {
    if (this.manualScroll) {
      const target = (this.scrollerRef.nativeElement.scrollTop /
        (this.scrollerRef.nativeElement.scrollHeight - this.scrollerRef.nativeElement.clientHeight))
        * this.adjustedTotalsize;
      this.gotoPos(target);
    }
  }
  scrollEvent() {
    // console.log(asd === asd + 10000);
    // console.log(9007199254740991 * 9007199254740991);

    // if (Math.abs(this.scrollPos - this.prevScrollPos) > this.viewportSize) {
    //   // this.lpage = Math.floor(scrollPos * ((this.combinedSizeOfItems - this.viewportSize)
    //   //   / (this.realScrollSize - this.viewportSize)) * (1 / this.pageHeight));
    // } else {
    // }



    this.scrollPos = this.tableRef.nativeElement.scrollTop;

    if (this.lpage === this.lastPage && this.scrollPos >= (this.rowCountOnLastPage + 1) * this.roundedRowHeight - 1) {
      this.scrollPos = this.tableRef.nativeElement.scrollTop = (this.rowCountOnLastPage + 1) * this.roundedRowHeight - 1;
      console.log("LAST")
    }

    // && this.adjustedTotalsize > (this.lpage + 1) * this.lpageSize
    if (this.scrollPos >= this.maxScrollPos && this.lpage < this.lastPage) {
      this.lpage++;
      this.pageChange();
      this.scrollPos = this.tableRef.nativeElement.scrollTop = this.roundedRowHeight;
    } else if (this.scrollPos <= 0 && this.lpage > 0) {
      this.lpage--;
      this.pageChange();
      this.scrollPos = this.tableRef.nativeElement.scrollTop = this.maxScrollPos - this.roundedRowHeight;
    }



    // this.scrollPosCoeffNormal + this.rowCount + ((this.rowCount) * this.spage)
    //   + this.lpage * (this.lpageSize - 1) + this.lpageCoeff * (this.lpage - 1);
    // console.log(this.scrollPos / this.maxScrollPos);
    // console.log(absPos);
    // this.scrollPercent =this.scrollPos;
    this.updateRows();

    this.scrollPercent = this.rowStart / this.adjustedTotalsize;
    if (!this.manualScroll) {
      this.scrollerRef.nativeElement.scrollTop = this.maxScrollPos * this.scrollPercent;
    }
    this.updateDataSource();
    // if (this.scrollPos >= this.rowHeight * this.bufferSize) {
    //   this.tableRef.nativeElement.scrollTop = this.rowHeight;
    //   this.lpage++;
    // }
    this.prevScrollPos = this.scrollPos;
  }

  updateDataSource() {

    if (this.prevRowStart !== this.rowStart || this.prevRowEnd !== this.rowEnd) {


      // if (this.prevRowStart < this.rowStart) {
      //   this.dataSource.buffer.clear(this.prevRowStart, this.rowStart - 1);
      // } else {
      //   this.dataSource.buffer.clear(this.rowEnd + 1, this.prevRowEnd);
      // }

      const count = this.rowCount;
      this.dataSource.state.count = count;
      // this.dataSource.state.cursor = -e.visibleStart + this.dataSource.cursorAbsPos;
      // console.log(this.dataSource.buffer.container);
      // console.log(this.dataSource.buffer.container);
      this.dataSource.state.cursorpos = -this.rowStart;
      this.dataSource.loadData();
      this.cd.detectChanges();
    }
    this.prevRowStart = this.rowStart;
    this.prevRowEnd = this.rowEnd;
  }

  pageChange() {
    this.lpageCoeff = this.lpage - 1 >= 0 ? 1 : 0;

    if (this.lpage === 0) {
      this.maxScrollPos = this.lpageSize * this.roundedRowHeight;
    } else {
      this.maxScrollPos = (this.lpageSize + 1) * this.roundedRowHeight;
    }
    this.fakeScrollerHeight = this.maxScrollPos + (this.rowCount - 1) * this.roundedRowHeight;
    this.fakeContentRef.nativeElement.style.height = this.fakeScrollerHeight + 'px';
    // console.log("scrollersize", this.lastPage, this.lpage)
    // if (this.lastPage === this.lpage) {
    //   this.fakeContentRef.nativeElement.style.height =
    //     this.rowCountOnLastPage * this.roundedRowHeight + this.lpage * this.roundedRowHeight
    //     + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    //   // this.rowCountOnLastPage * this.roundedRowHeight + (this.rowCount - 1) * this.roundedRowHeight + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    //   console.log('last', this.rowCountOnLastPage + (this.rowCount - 1));
    // } else {

    // }
    // this.cd.detectChanges();
  }
  updateSize() {
    this.scrollBarWidth = this.getScrollbarWidth();
    // this.tableRef.nativeElement.style.paddingRight = this.scrollBarWidth + 'px';
    this.viewportSize = this.tableRef.nativeElement.clientHeight;
    const count = Math.floor(this.viewportSize / this.rowHeight);
    this.roundedRowHeight = this.viewportSize / (count * this.rowHeight) * this.rowHeight;

    this.rowCount = Math.ceil(this.viewportSize / this.roundedRowHeight) + 1;
    this.rowCount = this.rowCount > this.totalsize ? this.totalsize : this.rowCount;

    this.lpageSize = Math.floor((this.browserMaxSize * 0.5) / this.roundedRowHeight);
    this.adjustedTotalsize = this.totalsize - (this.rowCount - 1);
    // this.lpageSize = 20;
    // this.dataSource.buffer.maxBufferSize = this.lpageSize;
    // this.dataSource.buffer.maxBufferSize = 100;
    this.lpageSize = this.adjustedTotalsize > this.lpageSize ? this.lpageSize : this.adjustedTotalsize;
    // this.lastPage = this.lpageSize - 1 > 0 ? Math.floor(this.totalsize / (this.lpageSize - 1)) : 0;
    this.lastPage = Math.floor(this.adjustedTotalsize / this.lpageSize);

    // this.rowCountOnLastPage = this.lpageSize >= this.adjustedTotalsize ? this.adjustedTotalsize : this.adjustedTotalsize % this.lpageSize;
    this.rowCountOnLastPage = this.adjustedTotalsize % this.lpageSize;


    // this.vrows = Array.from(Array(this.rowNum).keys());

    this.vrows = [];
    for (let i = 0; i < this.rowCount; i++) {
      this.vrows[i] = { virtualId: i, absoluteId: i, pos: 0 };
    }
    this.maxScrollPos = this.lpageSize * this.roundedRowHeight;
    // this.fakeContentRef.nativeElement.style.height = this.maxScrollPos + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    this.scrollerContentRef.nativeElement.style.height = (this.lpageSize * this.roundedRowHeight) + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    // this.tableRef.nativeElement.clientHeight * 5 + 'px';
    this.fakeContentRef.nativeElement.style.width = 1 + 'px';
    this.fakeContentRef.nativeElement.style.background = 'red';

    this.scrollerRef.nativeElement.style.width = this.scrollBarWidth + 'px';
    this.calculateWidths();
  }


  updateRows() {
    this.scrollPosCoeff = Math.floor(this.scrollPos / this.roundedRowHeight);
    // this.scrollPosCoeff = this.scrollPosCoeff >= this.adjustedTotalsize - this.lpage * this.lpageSize ? this.adjustedTotalsize - this.lpage * this.lpageSize - 1 : this.scrollPosCoeff;
    this.spage = Math.floor(this.scrollPosCoeff / (this.rowCount));
    this.scrollPosCoeffNormal = this.scrollPosCoeff - this.spage * (this.rowCount);

    // console.log("debug", this.scrollPosCoeff, this.lpage);
    this.rowStart = this.scrollPosCoeff + this.lpage * this.lpageSize - this.lpageCoeff;
    this.rowEnd = this.rowStart + this.rowCount - 1;
    for (const vrow of this.vrows) {
      this.updateRow(vrow);
    }



  }
  updateRow(vrow: VirtualRow) {
    const possibleAbsId = vrow.virtualId + this.rowCount + ((this.rowCount) * this.spage)
      + this.lpage * (this.lpageSize - 1) + this.lpageCoeff * (this.lpage - 1);
    // && possibleAbsId <= this.totalsize - 1
    if (vrow.virtualId < this.scrollPosCoeffNormal) {
      // console.log('jump', vrow.virtualId)
      vrow.pos = vrow.virtualId * this.roundedRowHeight
        + (this.rowCount * this.roundedRowHeight) + this.spage * this.roundedRowHeight * (this.rowCount);
      vrow.absoluteId = possibleAbsId;
    } else {
      vrow.pos = vrow.virtualId * this.roundedRowHeight + this.spage * this.roundedRowHeight * (this.rowCount);
      vrow.absoluteId = vrow.virtualId + (this.spage * (this.rowCount))
        + this.lpage * (this.lpageSize - 1) + this.lpageCoeff * (this.lpage - 1);

    }
  }

  calculateWidths() {
    // console.log('calculateWidths');
    if (!(this.bodyRef.nativeElement as HTMLElement).children[0]) {
      return;
    }
    const fullWidth = this.bodyRef.nativeElement.clientWidth;
    // const trArr = (this.bodyRef.nativeElement as HTMLElement).children[0].children;
    this.scrollBarWidth = this.bodyRef.nativeElement.offsetWidth - this.bodyRef.nativeElement.clientWidth;

    // const actionsWidth = trArr[trArr.length - 1].clientWidth;
    // const availableWidth = fullWidth - actionsWidth - this.scrollBarWidth;
    const availableWidth = fullWidth;
    let max = 0;
    this.dataSource.displayedColumns.forEach((col) => {
      max += col.length;
    });
    for (let i = 0; i < this.dataSource.displayedColumns.length; i++) {
      const col = this.dataSource.displayedColumns[i];
      this.columnWidths[i] = Math.floor(availableWidth / max * col.length);
      if (this.columnWidths[i] < col.length * 10) {
        this.columnWidths[i] = col.length * 10;
      }
    }
    console.log(this.columnWidths)
    // this.columnWidths[this.dataSource.displayedColumns.length] = actionsWidth;
    // console.log(this.dataSource.displayedColumns);
  }

  private calcMaxBrowserScrollSize(): number {
    // if (!this.realScrollSize) {
    const div = document.createElement('div');
    const style = div.style;
    style.position = 'absolute';
    style.left = '99999999999999px';
    style.top = '9999999999999999px';
    document.body.appendChild(div);

    const size = div.getBoundingClientRect().top;
    document.body.removeChild(div);
    // return Math.abs(size) / 2;
    return size;
    // return 100000;
    // } else {
    //   return this.realScrollSize;
    // }
  }
  getScrollbarWidth() {

    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  ///////////////////



  updateColumns() {
    this.dataSource.columns = [];
    this.dataSource.displayedColumns = [];
    this.dataSource.keyIds = [];
    this._columns.forEach((col: VirtualDataSourceInfoColumn) => {
      const column = { label: col.description, length: col.length, id: col.id, align: col.align, format: col.format };
      this.dataSource.columns.push(column);
      this.dataSource.displayedColumns.push(column);
      this.dataSource.keyIds.push(col.id);
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
  format(val, format) {
    return this.formatService.format(val, format);
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
    // this.vsRef.refresh();
    this.dataSource.loadData().then(() => {
      // this.cd.detectChanges();
      // this.vsRef.refresh();
      // this.scrollToSelected();
    });
  }


  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
