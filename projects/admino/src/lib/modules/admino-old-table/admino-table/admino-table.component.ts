import { cloneDeep } from "lodash";
import { AdminoTableDataSource, VirtualDataSourceInfoColumn, DataSourceState } from "./admino-table.datasource";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { FormatService } from "admino/src/lib/services/format.service";
import { adminoTableAnimation } from "./admino-table.animation";
import { DomSanitizer } from "@angular/platform-browser";
import { isString } from "util";

export interface VirtualRow {
  virtualId: number;
  absoluteId: number;
  pos: number;
  data?: any;
  processedData?: any;
  prevdata?: any;
}

@Component({
  selector: "admino-old-table",
  templateUrl: "./admino-table.component.html",
  styleUrls: ["./admino-table.component.scss"],
  animations: [adminoTableAnimation],
})
export class AdminoOldTableComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.dataSource.indexes = this.indexes;
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

  @ViewChild("tableRef", { read: ElementRef, static: true }) tableRef;
  @ViewChild("scrollerRef", { read: ElementRef, static: true }) scrollerRef;
  @ViewChild("fakeContentRef", { read: ElementRef, static: true })
  fakeContentRef;
  @ViewChild("scrollerContentRef", { read: ElementRef, static: true })
  scrollerContentRef;
  @ViewChild("bodyRef", { static: true }) bodyRef: ElementRef;
  @ViewChild("headerRef", { static: false }) headerRef: ElementRef;
  @ViewChild("mainRef", { static: true }) mainRef: ElementRef;

  columnWidths = [];
  sortedColumn;

  vrows: VirtualRow[] = [];
  @Input() oddRowStyle: any = {};
  @Input() headerHeight = 50;
  @Input() rowHeight = 50;
  @Input() hideHeader = false;
  @Input() debug = false;
  @Input() selectedRowStyle = {};
  @Input() selectedCellStyle = {};
  @Input() inactiveSelectedRowStyle = {};
  @Input() inactiveSelectedCellStyle = {};

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
  leavespace = 2;
  @Input() keyOverrides: { trigger: string; key: string }[] = [];
  @Input() isFocused = false;

  // @HostListener('window:resize', ['$event'])
  resize(event: MouseEvent) {
    this.updateSize();
    this.scrollEvent();
  }
  @HostListener("document:mouseup", ["$event"])
  mouseUp(event: MouseEvent) {
    this.manualScroll = false;
  }
  @HostListener("keydown", ["$event"]) onKeydownHandler(event: KeyboardEvent) {
    if (
      this.keyOverrides.find((override) => {
        return override.key === "any" || (override.key === event.key && override.trigger === "keydown");
      })
    ) {
      console.log("OVERRIDE");
      return;
    }
    // if (event.key === "ArrowDown") {
    //   // Your row selection code
    //   console.log(event);
    // } else if ()
    let cursorpos = this.dataSource.state.cursorpos;

    // console.log("____")
    // console.log("isViewOutsideTop", this.isViewOutsideTop());
    // console.log("isViewOutsideBottom", this.isViewOutsideBottom());
    // console.log("isOutsideTop", this.isOutsideTop());
    // console.log("isOutsideBottom", this.isOutsideBottom());
    // console.log("isAtEnd", this.isAtEnd());
    // console.log("isAtStart", this.isAtStart());
    // console.log("____")
    const leavespace = 2;
    switch (event.key) {
      case "ArrowDown":
        if (
          ((this.isViewOutsideTop() || this.isViewOutsideBottom()) && !this.isAtStart() && !this.isAtEnd()) ||
          this.dataSource.state.cursorpos < 0 ||
          this.dataSource.state.cursorpos > this.dataSource.state.count - 1
        ) {
          // középre igazít
          console.log("center");
          if (this.isOutsideBottom()) {
            cursorpos = this.dataSource.state.count - this.leavespace;
          } else {
            cursorpos = this.leavespace;
          }

          this.dataSource.state.cursorpos = cursorpos;
          this.dataSource.loadData().then(() => {
            this.gotoPos(this.dataSource.viewpos);
          });
        } else if (!this.isOutsideBottomMinusOne() && this.dataSource.cursorAbsPos < this.dataSource.totalsize - 1) {
          // léptet egyet le csak frontenden
          console.log("léptet");

          cursorpos += 1;
          this.dataSource.cursorAbsPos++;
          this.dataSource.state.cursorpos = cursorpos;
          this.setKeys(this.getKeyAtCursor(cursorpos));
        } else {
          // leshiftel
          if (this.isOutsideBottom()) {
            cursorpos -= 1;
            console.log("shiftel1");
          } else if (this.isOutsideTop()) {
            cursorpos += 1;
            console.log("shiftel2");
          }
          this.dataSource.state.cursorpos = cursorpos;

          this.dataSource.loadData(1).then(() => {
            this.gotoPos(this.dataSource.viewpos);
          });
        }
        event.preventDefault();
        break;
      case "ArrowUp":
        if ((this.isViewOutsideTop() || this.isViewOutsideBottom()) && !this.isAtStart() && !this.isAtEnd()) {
          // cursorpos = Math.floor(this.dataSource.state.count / 2);
          if (this.isOutsideBottom()) {
            cursorpos = this.dataSource.state.count - this.leavespace;
          } else {
            cursorpos = this.leavespace;
          }

          this.dataSource.state.cursorpos = cursorpos;
          this.dataSource.loadData().then(() => {
            this.gotoPos(this.dataSource.viewpos);
          });
        } else if (!this.isOutsideTopMinusOne() && this.dataSource.cursorAbsPos > 0) {
          cursorpos -= 1;
          this.dataSource.cursorAbsPos--;
          this.dataSource.state.cursorpos = cursorpos;
          this.setKeys(this.getKeyAtCursor(cursorpos));
        } else {
          if (this.isOutsideBottom()) {
            cursorpos -= 1;
          } else if (this.isOutsideTop()) {
            cursorpos += 1;
          }
          this.dataSource.state.cursorpos = cursorpos;
          this.dataSource.loadData(-1).then(() => {
            this.gotoPos(this.dataSource.viewpos);
          });
        }

        event.preventDefault();

        break;
      case "Home":
        this.dataSource.state.keys = { "#position": "first" };
        this.dataSource.state.cursorpos = 0;
        this.dataSource.loadData().then(() => {
          this.gotoPos(this.dataSource.viewpos);

          console.log(this.dataSource.data);
          console.log(this.vrows);
        });
        event.preventDefault();

        break;
      case "End":
        this.dataSource.state.keys = { "#position": "last" };
        this.dataSource.state.cursorpos = this.dataSource.state.count - 2;
        this.dataSource.loadData().then(() => {
          this.gotoPos(this.dataSource.viewpos);
        });

        event.preventDefault();

        break;
      case "PageUp":
        this.dataSource.loadData(-(this.dataSource.state.count - 1)).then(() => {
          this.gotoPos(this.dataSource.viewpos);
        });
        event.preventDefault();

        break;
      case "PageDown":
        this.dataSource.loadData(this.dataSource.state.count - 1).then(() => {
          this.gotoPos(this.dataSource.viewpos);
        });
        event.preventDefault();
        break;
      case "Enter":
        this.cellClick.next();
        event.preventDefault();
        break;
      case "ArrowRight":
        if (this.dataSource.state.selectedColumnIndex < this.dataSource.columns.length - 1) {
          this.dataSource.state.selectedColumnIndex++;
        }
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (this.dataSource.state.selectedColumnIndex > 0) {
          this.dataSource.state.selectedColumnIndex--;
        }
        event.preventDefault();
        break;

      default:
        break;
    }
  }
  isViewOutsideTop() {
    return this.dataSource.cursorAbsPos < this.rowStart;
  }
  isViewOutsideBottom() {
    return this.dataSource.cursorAbsPos > this.rowEnd;
  }

  isOutsideTop() {
    return this.dataSource.state.cursorpos < this.leavespace;
  }
  isOutsideTopMinusOne() {
    return this.dataSource.state.cursorpos <= this.leavespace;
  }
  isOutsideBottom() {
    return this.dataSource.state.cursorpos > this.dataSource.state.count - this.leavespace;
  }
  isOutsideBottomMinusOne() {
    return this.dataSource.state.cursorpos >= this.dataSource.state.count - this.leavespace;
  }
  isAtStart() {
    return this.dataSource.cursorAbsPos < this.leavespace;
  }
  isAtEnd() {
    return this.dataSource.cursorAbsPos > this.dataSource.state.totalsize - 1 - this.leavespace;
  }
  getKeyAtCursor(cursorpos) {
    if (this.dataSource.data && this.dataSource.data.data[cursorpos]) {
      return this.dataSource.data.data[cursorpos];
    }
  }
  setKeys(data: any) {
    this.dataSource.setKeys(data);
    this.valueChange.next(this.dataSource.state);
  }

  constructor(public cd: ChangeDetectorRef, public formatService: FormatService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.browserMaxSize = this.calcMaxBrowserScrollSize();
    this.scrollBarWidth = this.getScrollbarWidth();
    this.calculateWidths();
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

    this.dataSource
      .connect()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
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
          this.refreshVrows();
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
      // this.calculateWidths();
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
    if (vrow.data && vrow.data.data && vrow.data.data.processedData) {
      this.dataSource.cursorAbsPos = vrow.absoluteId;
      this.setKeys(vrow.data.data.origData);
      this.dataSource.state.cursorpos = vrow.absoluteId - this.rowStart;
      this.dataSource.state.selectedColumnIndex = columnIndex;
      this.cellClick.next();
    }
    // this.dataSource.state.cursor = vrow.absoluteId - this.rowStart;
    // this.updateDataSource(true);
    // this.dataSource.loadData();
    // console.log(vrow.data)
  }
  gotoPos(absoluteId = 0) {
    // console.log("goto", absoluteId);
    let lastRowFix = 0;
    if (absoluteId >= this.adjustedTotalsize) {
      absoluteId = this.adjustedTotalsize - 0.0001;
      lastRowFix = this.notfittingRowHeight;
    }

    const targetPage = this.largePageSize > 0 ? Math.floor(absoluteId / this.largePageSize) : 0;
    this.largePage = targetPage;
    this.pageChange();

    const remainder = this.largePageSize > 0 ? absoluteId % this.largePageSize : 0;
    this.scrollPos = this.tableRef.nativeElement.scrollTop = (remainder + this.largePageCoeff) * this.rowHeight + lastRowFix;
    this.updateRows();
    // console.log("remainder", this.largePageCoeff)
    this.refreshVrows();
  }
  scrollbarMouseDown() {
    this.manualScroll = true;
  }
  scrollbarScroll(e) {
    if (this.manualScroll) {
      const target =
        (this.scrollerRef.nativeElement.scrollTop /
          (this.scrollerRef.nativeElement.scrollHeight - this.scrollerRef.nativeElement.clientHeight)) *
        this.adjustedTotalsize;
      console.log("maxscrollpos", this.scrollerRef.nativeElement.scrollHeight - this.scrollerRef.nativeElement.clientHeight);
      console.log("target", target);
      this.gotoPos(target);
    }
  }
  scrollEvent() {
    // console.log("scrololEvent");
    // console.log(asd === asd + 10000);
    // console.log(9007199254740991 * 9007199254740991);

    // if (Math.abs(this.scrollPos - this.prevScrollPos) > this.viewportSize) {
    //   // this.lpage = Math.floor(scrollPos * ((this.combinedSizeOfItems - this.viewportSize)
    //   //   / (this.realScrollSize - this.viewportSize)) * (1 / this.pageHeight));
    // } else {
    // }

    this.scrollPos = this.tableRef.nativeElement.scrollTop;
    // console.log(this.largePage, this.lastLargePage)
    // console.log((this.rowCountOnLastLargePage + 1) * this.rowHeight - 1)
    const scrollmax = (this.rowCountOnLastLargePage + 1) * this.rowHeight + this.notfittingRowHeight - 1;
    if (this.largePage === this.lastLargePage && this.scrollPos >= scrollmax) {
      this.scrollPos = this.tableRef.nativeElement.scrollTop = scrollmax;
    }

    // && this.adjustedTotalsize > (this.lpage + 1) * this.lpageSize
    // console.log(this.scrollPos, this.maxScrollPos)
    if (this.scrollPos >= this.maxScrollPos && this.largePage < this.lastLargePage) {
      this.largePage++;
      this.pageChange();
      console.log("pageChange up");
      this.scrollPos = this.tableRef.nativeElement.scrollTop = this.rowHeight;
    } else if (this.scrollPos <= 0 && this.largePage > 0) {
      this.largePage--;
      this.pageChange();
      console.log("pageChange down");
      this.scrollPos = this.tableRef.nativeElement.scrollTop = this.maxScrollPos - this.rowHeight;
    }

    // this.scrollPosCoeffNormal + this.rowCount + ((this.rowCount) * this.spage)
    //   + this.lpage * (this.lpageSize - 1) + this.lpageCoeff * (this.lpage - 1);
    // console.log(this.scrollPos / this.maxScrollPos);
    // console.log(absPos);
    // this.scrollPercent =this.scrollPos;
    this.updateRows();

    this.scrollPercent = this.rowStart / this.adjustedTotalsize;
    if (!this.manualScroll) {
      this.scrollerRef.nativeElement.scrollTop = (this.maxScrollPos + this.notfittingRowHeight) * this.scrollPercent;
    }
    this.updateDataSource();
    // if (this.scrollPos >= this.rowHeight * this.bufferSize) {
    //   this.tableRef.nativeElement.scrollTop = this.rowHeight;
    //   this.lpage++;
    // }
    this.prevScrollPos = this.scrollPos;

    if (this.headerRef) {
      this.headerRef.nativeElement.style.marginLeft = -this.tableRef.nativeElement.scrollLeft + "px";
    }
  }

  updateDataSource(force = false) {
    // console.log("_________________")
    // console.log("start", this.dataSource.viewpos, "end", this.dataSource.viewpos + this.dataSource.state.count)
    // console.log("start", this.rowStart, "end", this.rowEnd)
    const currentLoadedStart = this.dataSource.viewpos;
    const currentLoadedEnd = this.dataSource.viewpos + this.dataSource.state.count;

    if (force || currentLoadedStart !== this.rowStart || currentLoadedEnd !== this.rowEnd) {
      // console.log("UPDATE")

      // if (this.prevRowEnd < this.rowEnd) {
      //   this.dataSource.buffer.clear(this.prevRowEnd + 1, this.rowEnd);
      // }
      // if (this.prevRowStart > this.rowStart) {
      //   this.dataSource.buffer.clear(this.prevRowStart - 1, this.rowStart);
      // }
      this.refreshVrows();
      const rowCount = Math.ceil(this.viewportSize / this.rowHeight) + 1;
      const count = Math.max(this.visibleRowCount - 2, rowCount - 2);
      console.log("count", rowCount, count);
      //  (this.visibleRowCount - 1) > this.totalsize ? this.totalsize : this.visibleRowCount - 1;
      this.dataSource.state.count = count;
      // this.dataSource.buffer.maxBufferSize = count * 3;
      // this.dataSource.state.cursor = -e.visibleStart + this.dataSource.cursorAbsPos;
      // console.log(this.dataSource.buffer.container);
      // console.log(this.dataSource.buffer.container);
      this.dataSource.state.cursorpos = -(this.rowStart - this.dataSource.cursorAbsPos);
      this.dataSource.loadData();
      this.cd.detectChanges();
    }
    // this.prevRowStart = this.rowStart;
    // this.prevRowEnd = this.rowEnd;
  }

  pageChange() {
    this.maxScrollPos = Math.floor(this.largePageSize * this.rowHeight);
    // if (this.largePage === 0) {
    // } else {
    //   this.maxScrollPos = Math.floor((this.largePageSize + 1) * this.rowHeight);
    // }
    this.fakeScrollerHeight = this.maxScrollPos + (this.visibleRowCount - 1) * this.rowHeight;
    this.fakeContentRef.nativeElement.style.height = this.fakeScrollerHeight + "px";

    if (this.largePage > this.lastLargePage) {
      this.largePage = this.lastLargePage;
      this.scrollPos = this.tableRef.nativeElement.scrollTop = this.rowCountOnLastLargePage * this.rowHeight - 1;
    }
    this.largePageCoeff = this.largePage - 1 >= 0 ? 1 : 0;

    // console.log("pageChange")
    // console.log("scrollersize", this.lastPage, this.lpage)
    // if (this.lastPage === this.lpage) {
    //   this.fakeContentRef.nativeElement.style.height =
    //     this.rowCountOnLastPage * this.rowHeight + this.lpage * this.rowHeight
    //     + (this.rowCount - 1) * this.rowHeight + 'px';
    //   // this.rowCountOnLastPage * this.rowHeight + (this.rowCount - 1) * this.rowHeight + (this.rowCount - 1) * this.rowHeight + 'px';
    //   console.log('last', this.rowCountOnLastPage + (this.rowCount - 1));
    // } else {

    // }
    // this.cd.markForCheck();
  }
  updateSize() {
    console.log("UPDATESIZE");
    this.calculateWidths();
    this.cd.detectChanges();
    // this.tableRef.nativeElement.style.paddingRight = this.scrollBarWidth + 'px';
    this.viewportSize = this.tableRef.nativeElement.clientHeight;
    const count = Math.floor(this.viewportSize / this.rowHeight);
    // this.rowHeight = Math.ceil(this.viewportSize / (count * this.rowHeight) * this.rowHeight);

    this.visibleRowCount = Math.ceil(this.viewportSize / this.rowHeight) + 1;
    if (this.totalsize === -1) {
      this.totalsize = this.visibleRowCount;
      // console.log("totatlsiz", this.tableRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.clientHeight)
    }
    this.visibleRowCount = this.visibleRowCount > this.totalsize ? this.totalsize : this.visibleRowCount;

    this.notfittingRowHeight = Math.ceil(this.viewportSize / this.rowHeight) * this.rowHeight - this.viewportSize;

    this.largePageSize = Math.floor((this.browserMaxSize * 0.5) / this.rowHeight);
    this.largePageSize = 15000;
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
        this.vrows.push({
          virtualId: this.vrows.length,
          absoluteId: this.vrows.length,
          pos: 0,
        });
      }
    } else if (this.vrows.length > this.visibleRowCount) {
      for (let i = 0; i < rowDifference; i++) {
        this.vrows.pop();
      }
    }
    this.vrows.forEach((vrow) => {
      vrow.pos = 0;
    });

    this.maxScrollPos = Math.floor(this.largePageSize * this.rowHeight);
    // this.fakeContentRef.nativeElement.style.height = this.maxScrollPos + (this.rowCount - 1) * this.rowHeight + 'px';
    this.scrollerContentRef.nativeElement.style.height =
      this.largePageSize * this.rowHeight + (this.visibleRowCount - 1) * this.rowHeight + "px";
    // this.tableRef.nativeElement.clientHeight * 5 + 'px';
    // this.fakeContentRef.nativeElement.style.width = 1 + 'px';
    // this.fakeContentRef.nativeElement.style.background = 'red';

    this.scrollerRef.nativeElement.style.width = this.scrollBarWidth + "px";

    // this.cd.detectChanges();
    // this.calculateWidths();
  }

  updateRows() {
    this.scrollPosCoeff = Math.floor(this.scrollPos / this.rowHeight);

    // this.scrollPosCoeff = this.scrollPosCoeff >= this.adjustedTotalsize - this.lpage * this.lpageSize ? this.adjustedTotalsize - this.lpage * this.lpageSize - 1 : this.scrollPosCoeff;
    this.smallPage = Math.floor(this.scrollPosCoeff / this.visibleRowCount);
    this.scrollPosCoeffNormal = this.scrollPosCoeff - this.smallPage * this.visibleRowCount;

    // console.log("smallPage", this.smallPage);
    // console.log("largePageCoeff", this.largePageCoeff);
    this.rowStart = this.scrollPosCoeff + this.largePage * this.largePageSize - this.largePageCoeff;
    this.rowEnd = Math.max(this.rowStart + this.visibleRowCount - 1, this.rowStart);

    for (const vrow of this.vrows) {
      this.updateRow(vrow);
    }
  }
  updateRow(vrow: VirtualRow) {
    const possibleAbsId =
      vrow.virtualId +
      this.visibleRowCount +
      this.visibleRowCount * this.smallPage +
      this.largePage * (this.largePageSize - 1) +
      this.largePageCoeff * (this.largePage - 1);
    // && possibleAbsId <= this.totalsize - 1
    if (vrow.virtualId < this.scrollPosCoeffNormal) {
      // console.log('jump', vrow.virtualId)

      if (possibleAbsId < this.totalsize) {
        vrow.absoluteId = possibleAbsId;
        // console.log("sethere")
        // console.log(vrow.absoluteId)
        vrow.pos =
          vrow.virtualId * this.rowHeight + this.visibleRowCount * this.rowHeight + this.smallPage * this.rowHeight * this.visibleRowCount;
      }
    } else {
      vrow.absoluteId =
        vrow.virtualId +
        this.smallPage * this.visibleRowCount +
        this.largePage * (this.largePageSize - 1) +
        this.largePageCoeff * (this.largePage - 1);
      if (vrow.absoluteId < this.totalsize) {
        vrow.pos = vrow.virtualId * this.rowHeight + this.smallPage * this.rowHeight * this.visibleRowCount;
      }
    }
    // console.log(vrow.absoluteId);
  }

  refreshVrows() {
    for (const vrow of this.vrows) {
      const d = this.dataSource.buffer.get(vrow.absoluteId);
      vrow.data = d;
    }
    // console.log(this.vrows)
  }

  // refreshVrows1() {
  //   for (const vrow of this.vrows) {
  //     const d = this.dataSource.buffer.get(vrow.absoluteId);
  //     const prevTemp = cloneDeep(d);
  //     // vrow.origdata = prevTemp;
  //     vrow.data = d;
  //     // const prevdata = vrow.data && vrow.data.data;
  //     // const newdata = d && d.data;
  //     if (vrow.data && vrow.data.data) {
  //       // vrow.data.data = prevdata;
  //       this.refreshVrow(vrow);
  //     }
  //     vrow.prevdata = prevTemp;
  //   }
  // }
  // refreshVrow(vrow: VirtualRow) {
  //   if (!vrow.processedData) {
  //     vrow.processedData = {};
  //   }
  //   for (const key of Object.keys(vrow.data.data)) {
  //     if (isString(vrow.data.data[key])) {
  //       // && key.startsWith('$')
  //       // key.startsWith('$')
  //       const prev = vrow.prevdata && vrow.prevdata.data && vrow.prevdata.data[key];
  //       const orig = vrow.data && vrow.data.data && vrow.data.data[key];
  //       if (orig !== prev) {
  //         vrow.processedData[key] = this.sanitizer.bypassSecurityTrustHtml(vrow.data.data[key]);
  //       }
  //     } else {
  //       vrow.processedData[key] = vrow.data.data[key];
  //     }
  //   }
  // }
  calculateWidths() {
    console.log(this.bodyRef.nativeElement.clientWidth);

    if (!(this.bodyRef.nativeElement as HTMLElement).children[0]) {
      console.log("returned");
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
    this.dataSource.columns.forEach((col) => {
      max += col.length;
    });
    for (let i = 0; i < this.dataSource.columns.length; i++) {
      const col = this.dataSource.columns[i];
      this.columnWidths[i] = (availableWidth / max) * col.length;
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
    const div = document.createElement("div");
    const style = div.style;
    style.position = "absolute";
    style.left = "99999999999999px";
    style.top = "9999999999999999px";
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
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll"; // forcing scrollbar to appear
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  ///////////////////

  updateColumns() {
    this.dataSource.columns = [];
    // this.dataSource.displayedColumns = [];
    this.dataSource.keyIds = [];
    this._columns.forEach((col: VirtualDataSourceInfoColumn) => {
      const column = {
        description: this.sanitizer.bypassSecurityTrustHtml(col.description),
        length: col.length,
        id: col.id,
        style: col.style,
        containerStyle: col.containerStyle,
        headerStyle: col.headerStyle,
        headerContainerStyle: col.headerContainerStyle,
        extraCellDefinitions: col.extraCellDefinitions,
        align: col.align,
        format: col.format,
      };
      this.dataSource.columns.push(column);
      // this.dataSource.displayedColumns.push(column);
      this.dataSource.keyIds.push(col.id);
    });
  }

  // updateIndexes() {
  //   this.dataSource.indexes = this.indexes;
  //   this._indexes.forEach((index) => {
  //     const id = index.keys[0];
  //     const found = this.dataSource.columns.find((column) => {
  //       return column.id === id;
  //     });
  //     if (found) {
  //       found.sortable = true;
  //     }
  //   });
  // }

  format(val, format) {
    return this.formatService.format(val, format);
  }

  // sortClicked(column, sorter) {
  //   // const dir = e.direction === 'asc' ? 1 : -1;
  //   sorter.direction = sorter.direction * -1;
  //   if (this.sortedColumn === column && sorter.direction === 1) {
  //     this.sortedColumn = null;
  //     sorter.direction = -1;
  //     this.dataSource.state.index = 1;
  //   } else {
  //     this.sortedColumn = column;
  //     const found = this.dataSource.indexes.find((index) => {
  //       return index.keys[0] === this.sortedColumn.id;
  //     });
  //     if (found) {
  //       this.dataSource.state.index = (this.dataSource.indexes.indexOf(found) + 1) * sorter.direction;
  //     } else {
  //       this.dataSource.state.index = 1;
  //     }
  //   }
  //   this.updateDataSource(true);
  //   // this.vsRef.refresh();
  //   // this.dataSource.loadData().then(() => {
  //   //   // this.cd.detectChanges();
  //   //   // this.vsRef.refresh();
  //   //   // this.scrollToSelected();
  //   // });
  // }

  getHeaderContainerStyle(column, i) {
    const lastColumnFix = i === this.dataSource.columns.length - 1 ? this.scrollBarWidth : 0;
    const w = this.columnWidths[i] + lastColumnFix;
    return Object.assign(
      {
        width: w + "px",
        "max-width": w + "px",
        "min-width": w + "px",
        "text-align": column.align ? column.align : "left",
      },
      column.headerContainerStyle
    );
  }
  getHeaderStyle(column, i) {
    return column.headerStyle;
  }
  getRowStyle(vrow) {
    // transform1: 'translateY(' + vrow.pos + 'px)',
    const style = { height: this.rowHeight + "px", top: vrow.pos + "px" };
    if (vrow.absoluteId === this.dataSource.cursorAbsPos && this.selectedRowStyle) {
      Object.assign(style, this.selectedRowStyle);
    }
    return style;
  }
  getContainerStyle(column, data, i, vrow) {
    const containerStyle = Object.assign(
      {
        width: this.columnWidths[i] + "px",
        "max-width": this.columnWidths[i] + "px",
        "min-width": this.columnWidths[i] + "px",
      },
      column.containerStyle
    );

    const extra = data && data.styles && data.styles[column.id] && data.styles[column.id].containerStyle;

    // data && data[column.extraCellDefinitions];
    // const extraStyle = extra && extra.containerStyle;
    // const extraPredefinedStyle = extra && extra.predefinedContainerStyleId !== undefined && this.dataSource.predefinedStyles !== undefined
    //   && this.dataSource.predefinedStyles[extra.predefinedContainerStyleId];

    // if (extraPredefinedStyle) {
    //   Object.assign(containerStyle, extraPredefinedStyle);
    // }
    if (extra) {
      Object.assign(containerStyle, extra);
    }

    if (vrow.absoluteId === this.dataSource.cursorAbsPos && i === this.dataSource.state.selectedColumnIndex && this.selectedCellStyle) {
      Object.assign(containerStyle, this.selectedCellStyle);
    }

    return containerStyle;
  }
  getStyle(column, data, i) {
    // const style = column.style ? cloneDeep(column.style) : {};
    // const extra = data && data[column.extraCellDefinitions];
    // const extraStyle = extra && extra.style;
    // const extraPredefinedStyle = extra && extra.predefinedStyleId !== undefined && this.dataSource.predefinedStyles !== undefined
    //   && this.dataSource.predefinedStyles[extra.predefinedStyleId];

    // if (extraStyle) {
    //   Object.assign(style, extraStyle);
    // }
    // if (extraPredefinedStyle) {
    //   Object.assign(style, extraPredefinedStyle);
    // }
    return data && data.styles && data.styles[column.id] && data.styles[column.id].style;
  }
  getBarStyle(column, data, i) {
    // const style = {};
    // const extra = data && data[column.extraCellDefinitions];
    // const barStyle = extra && extra.bar;

    // const extraPredefinedBarStyle = extra && extra.predefinedBarStyleId !== undefined && this.dataSource.predefinedStyles !== undefined
    //   && this.dataSource.predefinedStyles[extra.predefinedBarStyleId];

    // if (barStyle) {
    //   Object.assign(style, barStyle);
    // }
    // if (extraPredefinedBarStyle) {
    //   Object.assign(style, extraPredefinedBarStyle);
    // }

    return data && data.styles && data.styles[column.id] && data.styles[column.id].barStyle;
  }
  sanitize(val) {
    if (val === undefined) {
      return "";
    }
    const sanitized = this.sanitizer.bypassSecurityTrustHtml(val);
    return val;
  }
  getCellContent(vrow, column) {
    if (vrow.data && vrow.data.data && vrow.data.data.processedData) {
      if (vrow.data.data.processedData["$" + column.id]) {
        return vrow.data.data.processedData["$" + column.id];
      } else {
        return vrow.data.data.processedData[column.id];
      }
    }
    // if (vrow.processedData) {
    //   if (vrow.processedData['$' + column.id]) {
    //     return vrow.processedData['$' + column.id];
    //   } else {
    //     return vrow.processedData[column.id];
    //   }
    // }
    return "";
  }

  trackByFn(index, item) {
    return item.absoluteId;
    //  index; // or item.id
  }
  trackByFnCell(index) {
    return index;
    //  index; // or item.id
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper);
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
