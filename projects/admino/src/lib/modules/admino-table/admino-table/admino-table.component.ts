import { cloneDeep } from 'lodash';
import { AdminoTableDataSource, VirtualDataSourceInfoColumn, DataSourceState } from './admino-table.datasource';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, ChangeDetectorRef, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormatService } from 'admino/src/lib/services/format.service';
import { adminoTableAnimation } from './admino-table.animation';

export interface VirtualRow {
  virtualId: number;
  absoluteId: number;
  pos: number;
  data?: any;
}

@Component({
  selector: 'admino-table',
  templateUrl: './admino-table.component.html',
  styleUrls: ['./admino-table.component.scss'],
  animations: [adminoTableAnimation]

})
export class AdminoTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() cellClick: EventEmitter<any> = new EventEmitter();
  @Output() headerCellClick: EventEmitter<any> = new EventEmitter();

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
  _autoRefresh = 0;
  @Input() public set autoRefresh(v: any) {
    this._autoRefresh = v;
    this.dataSource.autoRefresh = this.autoRefresh;
    this.dataSource.setAutoRefresh();
  }
  public get autoRefresh(): any {
    return this._autoRefresh;
  }



  @ViewChild('tableRef', { read: ElementRef, static: true }) tableRef;
  @ViewChild('scrollerRef', { read: ElementRef, static: true }) scrollerRef;
  @ViewChild('fakeContentRef', { read: ElementRef, static: true }) fakeContentRef;
  @ViewChild('scrollerContentRef', { read: ElementRef, static: true }) scrollerContentRef;
  @ViewChild('bodyRef', { static: true }) bodyRef: ElementRef;

  columnWidths = [];
  sortedColumn;


  vrows: VirtualRow[] = [];

  @Input() headerHeight = 50;
  @Input() rowHeight = 50;
  roundedRowHeight = 50;

  viewportSize = 0;
  browserMaxSize = 0;

  // largePagination
  largePage = 0;
  largePageSize = 30000;
  lastLargePage = 0;
  rowCountOnLastLargePage = 0;
  notfittingRowHeight = 0;
  // smallPagination
  smallPage = 0;
  visibleRowCount = 10;

  scrollPos = 0;
  maxScrollPos = 0;
  prevScrollPos = 0;
  scrollPosCoeff = 0;
  scrollPosCoeffNormal = 0;
  scrollBarWidth = 0;
  largePageCoeff = 0;
  //
  totalsize = -1;
  adjustedTotalsize = 0;

  scrollPercent = 1;
  fakeScrollerHeight = 0;
  manualScroll = false;

  rowStart = 0;
  rowEnd = 0;
  prevRowStart = -1;
  prevRowEnd = -1;

  asd = 100;
  timeoutHelper;

  @HostListener('window:resize', ['$event'])
  resize(event: MouseEvent) {
    this.updateSize();
    this.scrollEvent();
  }


  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.manualScroll = false;
  }
  constructor(public cd: ChangeDetectorRef, public formatService: FormatService) { }

  ngOnInit() {
    this.browserMaxSize = this.calcMaxBrowserScrollSize();
    // this.gotoPos(900719000);
    // this.gotoPos(9007199254740991);
    // this.gotoPos(9007199254740991);
    // setTimeout((params) => {
    //   this.gotoPos(1);

    // }, 100)

    // setInterval(() => {
    //   this.gotoPos(this.asd);
    //   // this.asd += 10000;
    // }, 1000);
    // this.gotoPos(9007199254740991);
  }
  ngAfterViewInit() {

    this.dataSource.loadDataStart.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.valueChange.next(value);
    });


    this.dataSource.connect().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        // console.log('browse response');
        // console.log(data);
        if (this.totalsize !== this.dataSource.totalsize) {
          this.totalsize = this.dataSource.totalsize;
          this.updateSize();
          this.pageChange();
          this.calculateWidths();
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
      this.valueChange.next(this.dataSource.state);
    });
    this.timeoutHelper = setTimeout((params) => {
      this.reinit();
      this.updateDataSource(true);

    });

  }
  reinit() {
    this.updateSize();
    this.updateRows();
    this.pageChange();

    this.prevRowStart = this.rowStart;
    this.prevRowEnd = this.rowEnd;

  }
  // update(state: DataSourceState) {

  //   this.dataSource.state = Object.assign(this.dataSource.state, state);
  //   this.dataSource.state.shift = 0;
  //   // console.log("state", this.dataSource.state);
  //   const shift = state.shift !== undefined ? state.shift : 0;
  //   this.dataSource.loadData(shift).then(() => {
  //     this.gotoPos(this.dataSource.viewpos);

  //   });
  // }
  setSelectedHeader(columnIndex) {
    this.dataSource.state.selectedHeaderColumnIndex = columnIndex;
    this.headerCellClick.next();
  }
  setSelected(vrow: VirtualRow, columnIndex, rowIndex) {
    if (vrow.data && vrow.data.data) {
      this.dataSource.cursorAbsPos = vrow.absoluteId;
      this.dataSource.setKeys(vrow.data.data);
    }
    this.dataSource.state.cursorpos = vrow.absoluteId - this.rowStart;
    // this.dataSource.state.cursor = vrow.absoluteId - this.rowStart;
    this.dataSource.state.selectedColumnIndex = columnIndex;
    this.cellClick.next();
    this.updateDataSource(true);
    // this.dataSource.loadData();
    // console.log(vrow.data)
  }
  gotoPos(absoluteId = 0) {
    let lastRowFix = 0;
    if (absoluteId >= this.adjustedTotalsize) {
      absoluteId = this.adjustedTotalsize;
      lastRowFix = this.notfittingRowHeight;
    }

    const targetPage = this.largePageSize > 0 ? Math.floor(absoluteId / this.largePageSize) : 0;
    this.largePage = targetPage;
    this.pageChange();

    const remainder = this.largePageSize > 0 ? absoluteId % (this.largePageSize) : 0;
    this.tableRef.nativeElement.scrollTop = (remainder + this.largePageCoeff) * this.roundedRowHeight + lastRowFix;
    this.updateRows();
  }
  scrollbarMouseDown() {
    this.manualScroll = true;
  }
  scrollbarScroll(e) {
    if (this.manualScroll) {
      const target = (this.scrollerRef.nativeElement.scrollTop /
        (this.scrollerRef.nativeElement.scrollHeight - this.scrollerRef.nativeElement.clientHeight))
        * (this.adjustedTotalsize);
      console.log(target)
      this.gotoPos(target);
    }
  }
  scrollEvent() {
    console.log("scrololEvent")
    // console.log(asd === asd + 10000);
    // console.log(9007199254740991 * 9007199254740991);

    // if (Math.abs(this.scrollPos - this.prevScrollPos) > this.viewportSize) {
    //   // this.lpage = Math.floor(scrollPos * ((this.combinedSizeOfItems - this.viewportSize)
    //   //   / (this.realScrollSize - this.viewportSize)) * (1 / this.pageHeight));
    // } else {
    // }



    this.scrollPos = this.tableRef.nativeElement.scrollTop;
    // console.log(this.largePage, this.lastLargePage)
    // console.log((this.rowCountOnLastLargePage + 1) * this.roundedRowHeight - 1)
    const scrollmax = (this.rowCountOnLastLargePage + 1) * this.roundedRowHeight + this.notfittingRowHeight - 1;
    if (this.largePage === this.lastLargePage && this.scrollPos >= scrollmax) {
      this.scrollPos = this.tableRef.nativeElement.scrollTop = scrollmax;
    }

    // && this.adjustedTotalsize > (this.lpage + 1) * this.lpageSize
    // console.log(this.scrollPos, this.maxScrollPos)
    if (this.scrollPos >= this.maxScrollPos && this.largePage < this.lastLargePage) {
      this.largePage++;
      this.pageChange();
      console.log("pageChange up")
      this.scrollPos = this.tableRef.nativeElement.scrollTop = this.roundedRowHeight;
    } else if (this.scrollPos <= 0 && this.largePage > 0) {
      this.largePage--;
      this.pageChange();
      console.log("pageChange down")
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

  updateDataSource(force = false) {
    if (force || this.prevRowStart !== this.rowStart || this.prevRowEnd !== this.rowEnd) {

      // if (this.prevRowEnd < this.rowEnd) {
      //   this.dataSource.buffer.clear(this.prevRowEnd + 1, this.rowEnd);
      // }
      // if (this.prevRowStart > this.rowStart) {
      //   this.dataSource.buffer.clear(this.prevRowStart - 1, this.rowStart);
      // }
      for (const vrow of this.vrows) {
        vrow.data = this.dataSource.buffer.get(vrow.absoluteId);
      }
      const count = this.visibleRowCount - 2;
      console.log("count", count)
      //  (this.visibleRowCount - 1) > this.totalsize ? this.totalsize : this.visibleRowCount - 1;
      this.dataSource.state.count = count;
      // this.dataSource.state.cursor = -e.visibleStart + this.dataSource.cursorAbsPos;
      // console.log(this.dataSource.buffer.container);
      // console.log(this.dataSource.buffer.container);
      this.dataSource.state.cursorpos = -(this.rowStart - this.dataSource.cursorAbsPos);
      this.dataSource.loadData();
      this.cd.detectChanges();
    }
    this.prevRowStart = this.rowStart;
    this.prevRowEnd = this.rowEnd;

  }

  pageChange() {
    this.largePageCoeff = this.largePage - 1 >= 0 ? 1 : 0;

    this.maxScrollPos = Math.floor(this.largePageSize * this.roundedRowHeight);
    // if (this.largePage === 0) {
    // } else {
    //   this.maxScrollPos = Math.floor((this.largePageSize + 1) * this.roundedRowHeight);
    // }
    this.fakeScrollerHeight = this.maxScrollPos + (this.visibleRowCount - 1) * this.roundedRowHeight;
    this.fakeContentRef.nativeElement.style.height = this.fakeScrollerHeight + 'px';


    if (this.largePage > this.lastLargePage) {
      this.largePage = this.lastLargePage;
      this.scrollPos = this.tableRef.nativeElement.scrollTop = (this.rowCountOnLastLargePage) * this.roundedRowHeight - 1;
    }

    // console.log("pageChange")
    // console.log("scrollersize", this.lastPage, this.lpage)
    // if (this.lastPage === this.lpage) {
    //   this.fakeContentRef.nativeElement.style.height =
    //     this.rowCountOnLastPage * this.roundedRowHeight + this.lpage * this.roundedRowHeight
    //     + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    //   // this.rowCountOnLastPage * this.roundedRowHeight + (this.rowCount - 1) * this.roundedRowHeight + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    //   console.log('last', this.rowCountOnLastPage + (this.rowCount - 1));
    // } else {

    // }
    // this.cd.markForCheck();
  }
  updateSize() {

    this.calculateWidths();
    this.cd.detectChanges();
    this.scrollBarWidth = this.getScrollbarWidth();
    // this.tableRef.nativeElement.style.paddingRight = this.scrollBarWidth + 'px';
    this.viewportSize = this.tableRef.nativeElement.clientHeight;
    const count = Math.floor(this.viewportSize / this.rowHeight);
    // this.roundedRowHeight = Math.ceil(this.viewportSize / (count * this.rowHeight) * this.rowHeight);
    this.roundedRowHeight = this.rowHeight;

    this.visibleRowCount = Math.ceil(this.viewportSize / this.roundedRowHeight) + 1;
    if (this.totalsize === -1) {
      this.totalsize = this.visibleRowCount;
      // console.log("totatlsiz", this.tableRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.clientHeight)
    }
    this.visibleRowCount = this.visibleRowCount > this.totalsize ? this.totalsize : this.visibleRowCount;


    this.notfittingRowHeight = (Math.ceil(this.viewportSize / this.roundedRowHeight) * this.roundedRowHeight) - this.viewportSize;

    this.largePageSize = Math.floor((this.browserMaxSize * 0.5) / this.roundedRowHeight);
    this.largePageSize = 150;
    this.adjustedTotalsize = this.totalsize - (this.visibleRowCount - 1);
    this.lastLargePage = Math.floor(this.adjustedTotalsize / this.largePageSize);
    this.rowCountOnLastLargePage = this.adjustedTotalsize % this.largePageSize;
    this.largePageSize = this.adjustedTotalsize > this.largePageSize ? this.largePageSize : this.adjustedTotalsize;
    // this.dataSource.buffer.maxBufferSize = this.lpageSize;
    // this.dataSource.buffer.maxBufferSize = 100;
    // this.lastPage = this.lpageSize - 1 > 0 ? Math.floor(this.totalsize / (this.lpageSize - 1)) : 0;
    // this.rowCountOnLastPage = this.lpageSize >= this.adjustedTotalsize ? this.adjustedTotalsize : this.adjustedTotalsize % this.lpageSize;

    //if totalsize changes and table was already scrolled 


    // this.vrows = []
    // for (let i = 0; i < this.visibleRowCount; i++) {
    //   this.vrows.push({ virtualId: this.vrows.length, absoluteId: this.vrows.length, pos: 0 });
    // }


    const rowDifference = Math.abs(this.visibleRowCount - this.vrows.length);
    if (this.vrows.length < this.visibleRowCount) {
      for (let i = 0; i < rowDifference; i++) {
        // this.vrows[i] = { virtualId: i, absoluteId: i, pos: 0 };
        this.vrows.push({ virtualId: this.vrows.length, absoluteId: this.vrows.length, pos: 0 });
      }
    } else if (this.vrows.length > this.visibleRowCount) {
      for (let i = 0; i < rowDifference; i++) {
        this.vrows.pop();
      }
    }
    this.vrows.forEach((vrow) => {
      vrow.pos = 0;
    });


    this.maxScrollPos = Math.floor(this.largePageSize * this.roundedRowHeight);
    // this.fakeContentRef.nativeElement.style.height = this.maxScrollPos + (this.rowCount - 1) * this.roundedRowHeight + 'px';
    this.scrollerContentRef.nativeElement.style.height = (this.largePageSize * this.roundedRowHeight) + (this.visibleRowCount - 1) * this.roundedRowHeight + 'px';
    // this.tableRef.nativeElement.clientHeight * 5 + 'px';
    // this.fakeContentRef.nativeElement.style.width = 1 + 'px';
    // this.fakeContentRef.nativeElement.style.background = 'red';

    this.scrollerRef.nativeElement.style.width = this.scrollBarWidth + 'px';

    // this.cd.detectChanges();
    // this.calculateWidths();
  }


  updateRows() {
    this.scrollPosCoeff = Math.floor(this.scrollPos / this.roundedRowHeight);

    // this.scrollPosCoeff = this.scrollPosCoeff >= this.adjustedTotalsize - this.lpage * this.lpageSize ? this.adjustedTotalsize - this.lpage * this.lpageSize - 1 : this.scrollPosCoeff;
    this.smallPage = Math.floor(this.scrollPosCoeff / (this.visibleRowCount));
    this.scrollPosCoeffNormal = this.scrollPosCoeff - this.smallPage * (this.visibleRowCount);

    // console.log("debug", this.scrollPosCoeff, this.lpage);
    this.rowStart = this.scrollPosCoeff + (this.largePage * this.largePageSize) - this.largePageCoeff;
    this.rowEnd = this.rowStart + this.visibleRowCount - 1;
    for (const vrow of this.vrows) {
      this.updateRow(vrow);
    }



  }
  updateRow(vrow: VirtualRow) {
    const possibleAbsId = vrow.virtualId + this.visibleRowCount + ((this.visibleRowCount) * this.smallPage)
      + this.largePage * (this.largePageSize - 1) + this.largePageCoeff * (this.largePage - 1);
    // && possibleAbsId <= this.totalsize - 1
    if (vrow.virtualId < this.scrollPosCoeffNormal) {
      // console.log('jump', vrow.virtualId)
      vrow.absoluteId = possibleAbsId;
      if (vrow.absoluteId < this.totalsize) {
        vrow.pos = vrow.virtualId * this.roundedRowHeight
          + (this.visibleRowCount * this.roundedRowHeight) + this.smallPage * this.roundedRowHeight * (this.visibleRowCount);
      }
    } else {
      vrow.absoluteId = vrow.virtualId + (this.smallPage * (this.visibleRowCount))
        + this.largePage * (this.largePageSize - 1) + this.largePageCoeff * (this.largePage - 1);
      if (vrow.absoluteId < this.totalsize) {
        vrow.pos = vrow.virtualId * this.roundedRowHeight + this.smallPage * this.roundedRowHeight * (this.visibleRowCount);
      }
    }
  }

  calculateWidths() {
    console.log('calculateWidths');
    if (!(this.bodyRef.nativeElement as HTMLElement).children[0]) {
      return;
    }
    const fullWidth = this.bodyRef.nativeElement.clientWidth;
    // const trArr = (this.bodyRef.nativeElement as HTMLElement).children[0].children;
    this.scrollBarWidth = this.bodyRef.nativeElement.offsetWidth - this.bodyRef.nativeElement.clientWidth;
    // console.log(fullWidth)
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
    // this.cd.detectChanges();
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
      const column = {
        label: col.description, length: col.length, id: col.id, style: col.style, containerStyle: col.containerStyle,
        headerStyle: col.headerStyle, headerContainerStyle: col.headerContainerStyle, extraCellDefinitions: col.extraCellDefinitions,
        align: col.align, format: col.format
      };
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
    this.updateDataSource(true);
    // this.vsRef.refresh();
    // this.dataSource.loadData().then(() => {
    //   // this.cd.detectChanges();
    //   // this.vsRef.refresh();
    //   // this.scrollToSelected();
    // });
  }

  getHeaderContainerStyle(column, i) {
    return Object.assign({
      width: this.columnWidths[i] + 'px',
      'max-width': this.columnWidths[i] + 'px',
      'min-width': this.columnWidths[i] + 'px',
      'text-align': column.align ? column.align : 'left'
    }, column.headerContainerStyle);
  }
  getHeaderStyle(column, i) {
    return column.headerStyle;
  }


  getContainerStyle(column, data, i) {
    const containerStyle = Object.assign(
      {
        width: this.columnWidths[i] + 'px',
        'max-width': this.columnWidths[i] + 'px',
        'min-width': this.columnWidths[i] + 'px'
      },
      column.containerStyle);

    const extra = data && data[column.extraCellDefinitions];
    const extraStyle = extra && extra.containerStyle;
    const extraPredefinedStyle = extra && extra.predefinedContainerStyleId && this.dataSource.predefinedStyles
      && this.dataSource.predefinedStyles[extra.predefinedContainerStyleId];

    if (extraStyle) {
      Object.assign(containerStyle, extraStyle);
    }
    if (extraPredefinedStyle) {
      Object.assign(containerStyle, extraPredefinedStyle);
    }

    return containerStyle;

  }
  getStyle(column, data, i) {
    const style = column.style ? cloneDeep(column.style) : {};
    const extra = data && data[column.extraCellDefinitions];
    const extraStyle = extra && extra.style;
    const extraPredefinedStyle = extra && extra.predefinedStyleId && this.dataSource.predefinedStyles
      && this.dataSource.predefinedStyles[extra.predefinedStyleId];

    if (extraStyle) {
      Object.assign(style, extraStyle);
    }
    if (extraPredefinedStyle) {
      Object.assign(style, extraPredefinedStyle);
    }
    return style;
  }
  getBarStyle(column, data, i) {
    const extra = data && data[column.extraCellDefinitions];
    const barStyle = extra && extra.bar;
    return barStyle;
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper)
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
