import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AdminoScreenElement} from '../admino-screen-element';
import {HttpResponse} from '@angular/common/http';
import {v4 as uuidv4} from 'uuid';
import {takeUntil, timeout} from 'rxjs/operators';
import {ScreenElementChange} from '../../admino-screen.interfaces';

@Component({
  selector: 'admino-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent extends AdminoScreenElement implements OnInit {

  @ViewChild('fakeScrollerRef', {static: true}) fakeScrollerRef: ElementRef;

  idPrefix;
  defaultSetup = {
    visibleRow: 30,
    visibleCol: 20,
    latency: 0,
    radius: 0,
    distance: 0,
    size: 99,
    backend: 'http://127.0.0.1:4080/matrix',
  };

  global = 0;
  setup: any = {};

  visibleRow;
  visibleCol;
  latency;
  radius;
  distance;
  totalRow;
  totalCol;
  backend;

  frameRow = 1;
  frameCol = 1;

  selectedRow = 1;
  selectedCol = 1;

  navigationRow = 0;
  navigationCol = 0;

  requestedFrameRow = 0;
  requestedFrameCol = 0;

  STATUS_UNKNOWN = -1;      // unknown content
  STATUS_VALID = 0;         // up to date valid content
  STATUS_INVALID = 1;       // invalid, data not available
  STATUS_UPDATED = 2;       // content updated

  workerRow = 0;
  workerCol = 0;
  workerCellElements;
  workerCellStatus;
  pendingUpdate = false;

  pendingRequest = false;
  writeCellCounter = 0;
  cellData: any = {};

  cellHeight = 18;
  cellWidth = 75;
  viewportWidth;
  viewportHeight;


  //setup visual containers
  now = Date.now();
  // matrixdiv = document.getElementById('matrixdiv');
  cells = [];

  boundKeydownHandler = this.keydownHandler.bind(this);

  timerInterval;
  timeouts = [];


  // Hooks
  ngOnInit() {
    this.idPrefix = 'admino_' + this.element.id + '_' + uuidv4() + '_';
    this.cd.detectChanges();
    this.onResize();
    this.timerInterval = setInterval(() => {
      this.timer1();
    }, 1000);

    this.setup = this.defaultSetup;
    if (this.element.setup) {
      Object.assign(this.setup, this.element.setup);
    }

    this.updateVariables();
    this.setupMatrix();
    this.setupListeners();
    this.initializeWorkerCells();
  }

  onFocus() {
  }

  onBlur() {
  }

  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (changes.setup) {
      Object.assign(this.setup, this.element.setup);
    }


    // value írása
    // this.control.setValue({ valami: "valami" });

    // action kezelése
    // const action = this.getAction('cellClick');
    // if (action) {
    //   this.handleAction(action);
    // }

    // configban levő backend szerer url
    // this.directive.config.config;

    this.updateVariables();
  }

  onDestroy() {
    this.focusElRef.nativeElement.removeEventListener('keydown', this.boundKeydownHandler);
    clearInterval(this.timerInterval);
    this.clearTimeouts();
  }

  onResize() {
    this.viewportWidth = this.focusElRef.nativeElement.clientWidth;
    this.viewportHeight = this.focusElRef.nativeElement.clientHeight;

  }

  scrollEvent(evt) {
    // console.log(evt);
  }

  mouseWheelEvent(evt) {
    this.fakeScrollerRef.nativeElement.scrollTop += evt.deltaY;
  }

  /////////////////////////////////////////
  clearTimeouts() {
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.timeouts = [];
  }

  updateVariables() {
    this.visibleRow = this.setup.visibleRow;
    this.visibleCol = this.setup.visibleCol;
    this.latency = this.setup.latency;
    this.radius = this.setup.radius;
    this.distance = this.setup.distance;
    this.totalRow = this.setup.size;
    this.totalCol = this.setup.size;
    this.backend = this.setup.backend;

    this.workerCellElements = new Array(this.visibleRow);
    this.workerCellStatus = new Array(this.visibleRow);
  }

  timer1() {
    // document.getElementById(this.idPrefix + 'timer1').innerHTML = Date.now() + ' - ' + this.format05d(this.global) + ' cell/sec'
    //   + ' / cellWrite ' + this.writeCellCounter;
    console.log(Date.now() + ' - ' + this.format05d(this.global) + ' cell/sec'
      + ' / cellWrite ' + this.writeCellCounter);
    this.global = 0;
  }

  setupMatrix() {
    const matrixdiv = document.getElementById(this.idPrefix + 'matrixdiv');
    matrixdiv.style.background = '#7777BB';
    matrixdiv.style.height = (this.visibleRow * (this.cellHeight + 1) + 1) + 'px';
    matrixdiv.style.width = (this.visibleCol * (this.cellWidth + 1) + 1) + 'px';
    matrixdiv.style.position = 'relative';
    matrixdiv.style.overflow = 'hidden';
    // matrixdiv.style.height = '100%';
    let m = '';
    for (let r = 0; r < this.visibleRow; r++) {
      for (let c = 0; c < this.visibleCol; c++) {
        const d = '<div id=\'' + this.idPrefix + r + ':' + c + '\' style=\''
          + 'height:' + this.cellHeight + 'px;'
          + 'width:' + this.cellWidth + 'px;'
          + 'position:absolute;'
          + 'top:' + (1 + r * (this.cellHeight + 1)) + 'px;'
          + 'left:' + (1 + c * (this.cellWidth + 1)) + 'px;'
          + 'background:#999999;'
          + '\'></div>';
        m += d;
      }
    }
    matrixdiv.innerHTML = m;
  }

  setupListeners() {
    this.focusElRef.nativeElement.addEventListener('keydown', this.boundKeydownHandler);
    // this.focusElRef.nativeElement.addEventListener('mouseover', this.boundKeydownHandler);
  }

  keydownHandler(event) {
    const keyName = event.key;
    if (event.altKey) {
      switch (keyName) {
        case 'Home':
          this.navigationCellAltHome();
          break;
        case 'End':
          this.navigationCellAltEnd();
          break;
        case 'PageDown':
          this.navigationCellAltPageDown();
          break;
        case 'PageUp':
          this.navigationCellAltPageUp();
          break;

        case 'ArrowDown':
          this.navigationCellAltDown();
          break;
        case 'ArrowUp':
          this.navigationCellAltUp();
          break;
        case 'ArrowRight':
          this.navigationCellAltRight();
          break;
        case 'ArrowLeft':
          this.navigationCellAltLeft();
          break;
      }
    } else {
      switch (keyName) {
        case 'Home':
          this.navigationCellHome();
          break;
        case 'End':
          this.navigationCellEnd();
          break;

        case 'ArrowDown':
          this.navigationCellDown();
          break;
        case 'ArrowUp':
          this.navigationCellUp();
          break;
        case 'ArrowRight':
          this.navigationCellRight();
          break;
        case 'ArrowLeft':
          this.navigationCellLeft();
          break;

        case 'PageDown':
          this.navigationCellPageDown();
          break;
        case 'PageUp':
          this.navigationCellPageUp();
          break;

        case ' ':
        case 'Enter':
          this.navagationCellClick();
          break;
      }
    }
  };


  initializeWorkerCells() {
    for (let r = 0; r < this.visibleRow; r++) {
      this.workerCellStatus[r] = new Array(this.visibleCol);
      this.workerCellElements[r] = new Array(this.visibleCol);
      for (let c = 0; c < this.visibleCol; c++) {
        this.workerCellElements[r][c] = document.getElementById(this.idPrefix + r + ':' + c);
        this.workerCellStatus[r][c] = this.STATUS_UNKNOWN;
      }
    }
    this.asyncRefreshMatrix();
  }

  requestData() {
    if (this.requestedFrameRow !== this.frameRow || this.requestedFrameCol !== this.frameCol) {
      if (!this.pendingRequest) {
        this.requestedFrameRow = this.frameRow;
        this.requestedFrameCol = this.frameCol;
        this.pendingRequest = true;
        console.log('Request data:' + this.requestedFrameRow + ':' + this.requestedFrameCol + ' / ' + Date.now());
        this.backendCall();
      }
    }
  }

  backendCall() {
    const request = {
      requestedFrameRow: this.requestedFrameRow,
      requestedFrameCol: this.requestedFrameCol,
      visibleRow: this.visibleRow,
      visibleCol: this.visibleCol,
      latency: this.latency,
      radius: this.radius,
      size: this.totalRow
    };
    const requestJson = JSON.stringify(request);
    const subscription = this.directive.http.post(this.backend, request, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          try {
            const data = response.cellData;
            const r0 = response.row0;
            const r1 = response.row1;
            const c0 = response.col0;
            const c1 = response.col1;
            this.cellData = {};
            let index = 0;
            for (let r = r0; r <= r1; r++) {
              for (let c = c0; c <= c1; c++) {
                this.cellData[r + ':' + c] = data[index++];
              }
            }
            //document.getElementById(this.idPrefix + 'log3').innerHTML = 'Response received: ' + response.area;
            console.log('Response received' + response.area);
          } catch (e) {
            this.cellData = {};
            //document.getElementById(this.idPrefix + 'log3').innerHTML = 'Response received, error: ' + e;
            console.log('Response received, error: ' + e);
          }
          this.pendingRequest = false;
        },
        (error: any) => {
          this.pendingRequest = false;
        });

    // backend hívás cancelelése
    // const timeout = setTimeout(() => {
    //   subscription.unsubscribe();
    //   this.pendingRequest = false;
    //   this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
    // }, 1000);
    // this.timeouts.push(timeout);

    //document.getElementById(this.idPrefix + 'log2').innerHTML = 'Request sent: ' + requestJson;
    console.log('Request sent: ' + requestJson);
  }

  writeCell(r, c) {
    this.writeCellCounter++;
    if (r + this.frameRow > this.totalRow || c + this.frameCol > this.totalCol) {  // out of range, set an empty cell
      this.writeCellStyle(r, c, 'font-size:10px;');
      this.workerCellElements[r][c].innerHTML = 'empty';
      this.workerCellStatus[r][c] = this.STATUS_VALID;
    } else {
      const data = this.cellData[(r + this.frameRow) + ':' + (c + this.frameCol)];
      if (data === undefined) {                                             // data not available, pending
        this.workerCellStatus[r][c] = this.STATUS_INVALID;
        this.writeCellStyle(r, c, 'font-size:9px;');
        if (r === this.navigationRow && c === this.navigationCol) {                   // navigationCell
          this.workerCellElements[r][c].innerHTML = (r + this.frameRow) + ':' + (c + this.frameCol);
        } else {
          this.workerCellElements[r][c].innerHTML = '⧖';
        }
        this.requestData();
        return;
      }

      this.workerCellStatus[r][c] = this.STATUS_VALID;
      this.workerCellElements[r][c].innerHTML = data;
      this.writeCellStyle(r, c, 'font-size:12px;' + (((r + this.frameRow) % 5 === 0
        || (c + this.frameCol) % 5 === 0) ? 'color:#004000;' : ''));
    }
  }

  writeCellStyle(r, c, dataStyle) {
    let style = dataStyle + 'height:' + this.cellHeight + 'px;width:' + this.cellWidth + 'px;';

    style += 'position:absolute;'
      + 'top:' + (1 + r * (this.cellHeight + 1)) + 'px;'
      + 'left:' + (1 + c * (this.cellWidth + 1)) + 'px;';

    if (r + this.frameRow > this.totalRow || c + this.frameCol > this.totalCol) {
      style += 'background-color:#909090;';                                                 // empty
    } else {
      if (this.workerCellStatus[r][c] === this.STATUS_INVALID) {                                       // unknown content
        if (r === this.navigationRow && c === this.navigationCol) {
          style += 'background-color:#770077;color:#FFFF00';                            // navigationCell missing content
        } else {
          style += 'background-color:#777777;';                                         // missing content
        }
      } else {
        if (r === this.navigationRow && c === this.navigationCol) {
          // todo: +selectedRow +selectedCell
          if (this.workerCellStatus[r][c] === this.STATUS_INVALID) {
            style += 'background-color:#770077;color:#FFFF00';                        // navigationCell missing content
          } else {
            style += 'background-color:#880000;';                                     // navigationCell
          }
        } else if (r + this.frameRow === this.selectedRow) {
          if (c + this.frameCol === this.selectedCol) {
            style += 'background-color:#888800;';                                     // selectedCell
          } else {
            style += 'background-color:#777700;';                                     // selectedRow
          }
        } else {
          style += 'background-color:#888888;';                                         // normal
        }
      }
    }
    this.workerCellElements[r][c].style = style;
  }

  format05d(x) {
    const str = '' + x;
    return '00000'.substring(0, 5 - str.length) + str;
  }

  navigationCellDown() {
    if (this.navigationRow + this.frameRow === this.totalRow) {
      return;
    }
    if (this.navigationRow < this.visibleRow - 1 - this.distance || this.frameRow + this.visibleRow > this.totalRow) {
      this.navigationRow++;
      this.writeCell(this.navigationRow - 1, this.navigationCol);
    } else {
      this.frameRow++;
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltDown() {
    if (this.frameRow + this.visibleRow > this.totalRow) {
      return;
    }
    this.frameRow++;
    this.invalidateAll();
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellPageDown() {
    if (this.navigationRow + this.frameRow === this.totalRow) {
      return;
    }
    if (this.navigationRow + this.frameRow + this.visibleRow - 1 >= this.totalRow) {
      this.navigationCellEnd();
      return;
    } else if (this.navigationRow < this.visibleRow - 1 - this.distance) {
      const fromNavigationRow = this.navigationRow;
      this.navigationRow = this.visibleRow - 1 - this.distance;
      if (this.navigationRow + this.frameRow > this.totalRow) {
        this.navigationRow = this.totalRow - this.frameRow;
      }
      this.writeCell(fromNavigationRow, this.navigationCol);
    } else if (this.frameRow + this.visibleRow - 1 + this.visibleRow - 1 <= this.totalRow) {
      this.frameRow += this.visibleRow - 1;
      this.invalidateAll();
    } else {
      const fromNavigationRow = this.navigationRow;
      let newPos = this.navigationRow + this.frameRow + this.visibleRow - 1;
      if (newPos > this.totalRow) {
        newPos = this.totalRow;
      }
      this.frameRow = this.totalRow - this.visibleRow + 1;
      this.navigationRow = newPos - this.frameRow;
      this.writeCell(fromNavigationRow, this.navigationCol);
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltPageDown() {
    if (this.navigationCol + this.frameCol === this.totalCol) {
      return;
    }
    if (this.navigationCol + this.frameCol + this.visibleCol - 1 >= this.totalCol) {
      this.navigationCellAltEnd();
      return;
    } else if (this.navigationCol < this.visibleCol - 1 - this.distance) {
      const fromNavigationCol = this.navigationCol;
      this.navigationCol = this.visibleCol - 1 - this.distance;
      if (this.navigationCol + this.frameCol > this.totalCol) {
        this.navigationCol = this.totalCol - this.frameCol;
      }
      this.writeCell(this.navigationRow, fromNavigationCol);
    } else if (this.frameCol + this.visibleCol - 1 + this.visibleCol - 1 <= this.totalCol) {
      this.frameCol += this.visibleCol - 1;
      this.invalidateAll();
    } else {
      const fromNavigationCol = this.navigationCol;
      let newPos = this.navigationCol + this.frameCol + this.visibleCol - 1;
      if (newPos > this.totalCol) {
        newPos = this.totalCol;
      }
      this.frameCol = this.totalCol - this.visibleCol + 1;
      this.navigationCol = newPos - this.frameCol;
      this.writeCell(this.navigationRow, fromNavigationCol);
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellUp() {
    if (this.navigationRow + this.frameRow === 1) {
      return;
    }
    if (this.navigationRow > this.distance || this.frameRow === 1) {
      this.navigationRow--;
      this.writeCell(this.navigationRow + 1, this.navigationCol);
    } else {
      this.frameRow--;
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltUp() {
    if (this.frameRow === 1) {
      return;
    }
    this.frameRow--;
    this.invalidateAll();
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellPageUp() {
    if (this.navigationRow + this.frameRow === 1) {
      return;
    }
    if (this.navigationRow + this.frameRow - (this.visibleRow - 1) <= 1) {
      this.navigationCellHome();
      return;
    } else if (this.navigationRow > this.distance) {
      const fromNavigationRow = this.navigationRow;
      this.navigationRow = this.distance;
      this.writeCell(fromNavigationRow, this.navigationCol);
    } else if (this.frameRow - (this.visibleRow - 1) >= 1) {
      this.frameRow -= this.visibleRow - 1;
      this.invalidateAll();
    } else {
      const fromNavigationRow = this.navigationRow;
      let newPos = this.navigationRow + this.frameRow - (this.visibleRow - 1);
      if (newPos < 0) {
        newPos = 0;
      }
      this.frameRow = 1;
      this.navigationRow = newPos - this.frameRow;
      this.writeCell(fromNavigationRow, this.navigationCol);
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltPageUp() {
    if (this.navigationCol + this.frameCol === 1) {
      return;
    }
    if (this.navigationCol + this.frameCol - (this.visibleCol - 1) <= 1) {
      this.navigationCellAltHome();
      return;
    } else if (this.navigationCol > this.distance) {
      const fromNavigationCol = this.navigationCol;
      this.navigationCol = this.distance;
      this.writeCell(this.navigationRow, fromNavigationCol);
    } else if (this.frameCol - (this.visibleCol - 1) >= 1) {
      this.frameCol -= this.visibleCol - 1;
      this.invalidateAll();
    } else {
      const fromNavigationCol = this.navigationCol;
      let newPos = this.navigationCol + this.frameCol - (this.visibleCol - 1);
      if (newPos < 0) {
        newPos = 0;
      }
      this.frameCol = 1;
      this.navigationCol = newPos - this.frameCol;
      this.writeCell(this.navigationRow, fromNavigationCol);
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellRight() {
    if (this.navigationCol + this.frameCol === this.totalCol) {
      return;
    }
    if (this.navigationCol < this.visibleCol - 1 - this.distance || this.frameCol + this.visibleCol > this.totalCol) {
      this.navigationCol++;
      this.writeCell(this.navigationRow, this.navigationCol - 1);
    } else {
      this.frameCol++;
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltRight() {
    if (this.frameCol + this.visibleCol > this.totalCol) {
      return;
    }
    this.frameCol++;
    this.invalidateAll();
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellLeft() {
    if (this.navigationCol + this.frameCol === 1) {
      return;
    }
    if (this.navigationCol > this.distance || this.frameCol === 1) {
      this.navigationCol--;
      this.writeCell(this.navigationRow, this.navigationCol + 1);
    } else {
      this.frameCol--;
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltLeft() {
    if (this.frameCol === 1) {
      return;
    }
    this.frameCol--;
    this.invalidateAll();
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellHome() {
    if (this.frameRow + this.navigationRow === 1) {
      return;
    }
    const fromNavigationRow = this.navigationRow;
    if (this.frameRow !== 1) {
      this.navigationRow = 0;
      this.frameRow = 1;
      this.invalidateAll();
    } else {
      this.navigationRow = 0;
    }
    this.writeCell(fromNavigationRow, this.navigationCol);
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltHome() {
    if (this.frameCol + this.navigationCol === 1) {
      return;
    }
    const fromNavigationCol = this.navigationCol;
    if (this.frameCol !== 1) {
      this.navigationCol = 0;
      this.frameCol = 1;
      this.invalidateAll();
    } else {
      this.navigationCol = 0;
    }
    this.writeCell(this.navigationRow, fromNavigationCol);
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellEnd() {
    if (this.frameRow + this.navigationRow === this.totalRow) {
      return;
    }
    const fromNavigationRow = this.navigationRow;
    if (this.frameRow + this.visibleRow - 1 >= this.totalRow) {
      this.navigationRow = this.totalRow - this.frameRow;
    } else {
      this.frameRow = this.totalRow - this.visibleRow + 1;
      if (this.frameRow < 1) {
        this.frameRow = 1;
      }
      this.navigationRow = this.totalRow - this.frameRow;
      this.invalidateAll();
    }
    this.writeCell(fromNavigationRow, this.navigationCol);
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navigationCellAltEnd() {
    if (this.frameCol + this.navigationCol === this.totalCol) {
      return;
    }
    const fromNavigationCol = this.navigationCol;
    if (this.frameCol + this.visibleCol - 1 >= this.totalCol) {
      this.navigationCol = this.totalCol - this.frameCol;
    } else {
      this.frameCol = this.totalCol - this.visibleCol + 1;
      if (this.frameCol < 1) {
        this.frameCol = 1;
      }
      this.navigationCol = this.totalCol - this.frameCol;
      this.invalidateAll();
    }
    this.writeCell(this.navigationRow, fromNavigationCol);
    this.writeCell(this.navigationRow, this.navigationCol);
  }

  navagationCellClick() {
    // click to navigation cell, accepted only if content is valid
    if (this.workerCellStatus[this.navigationRow][this.navigationCol] === this.STATUS_VALID) {
      // return if no changes
      if (this.selectedRow === this.navigationRow + this.frameRow && this.selectedCol === this.navigationCol + this.frameCol) {
        return;
      }
      // is selectedRow changed?
      if (this.selectedRow !== this.navigationRow + this.frameRow) {
        if (this.frameRow <= this.selectedRow && this.selectedRow < this.frameRow + this.visibleRow) {    // is old selectedRow visible?
          const selectedRowIndex = this.selectedRow - this.frameRow;
          for (let c = 0; c < this.visibleCol; c++) {                               // need update old selectedRow
            this.workerCellStatus[selectedRowIndex][c] = this.STATUS_UPDATED;
          }
        }
        for (let c = 0; c < this.visibleCol; c++) {                                   // need update new selectedRow
          this.workerCellStatus[this.navigationRow][c] = this.STATUS_UPDATED;
        }
        this.updateTable();
      }
      // is selectedCol changed?
      if (this.selectedCol !== this.navigationCol + this.frameCol) {                               // selectedCol changed
        if (this.frameCol <= this.selectedCol && this.selectedCol < this.frameCol + this.visibleCol) {    // is old selectedCol visible?
          if (this.frameRow <= this.selectedRow && this.selectedRow < this.frameRow + this.visibleRow) {// is old selectedRow visible?
            this.workerCellStatus[this.selectedRow - this.frameRow][this.selectedCol - this.frameCol] = this.STATUS_UPDATED;
            this.updateTable();
          }
        }
      }
      this.selectedRow = this.navigationRow + this.frameRow;
      this.selectedCol = this.navigationCol + this.frameCol;
      this.writeCell(this.navigationRow, this.navigationCol);
    }
  }

  isAllValid() {
    for (let r = 0; r < this.visibleRow; r++) {
      for (let c = 0; c < this.visibleCol; c++) {
        if (this.workerCellStatus[r][c] !== this.STATUS_VALID) {
          return false;
        }
      }
    }
    return true;
  }

  invalidateAll() {
    for (let r = 0; r < this.visibleRow; r++) {
      for (let c = 0; c < this.visibleCol; c++) {
        this.workerCellStatus[r][c] = this.STATUS_INVALID;
      }
    }
    this.updateTable();
  }

  updateTable() {
    if (!this.pendingUpdate) {
      this.pendingUpdate = true;

      const timeout = setTimeout(() => {
        this.asyncRefreshMatrix();
        this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
      }, 0);
      this.timeouts.push(timeout);
    }
  }

  asyncRefreshMatrix() {
    let count = 0;
    const now = Date.now();
    do {
      for (let i = 0; i < 10; i++) {
        if (this.workerCellStatus[this.workerRow][this.workerCol] !== this.STATUS_VALID) {
          this.writeCell(this.workerRow, this.workerCol);
          count++;
          this.global++;
        }
        if (++this.workerCol >= this.visibleCol) {
          this.workerCol = 0;
          if (++this.workerRow >= this.visibleRow) {
            this.workerRow = 0;
            if (this.isAllValid()) {
              this.pendingUpdate = false;
              console.log('update done');
              return;
            }
          }
        }
      }
    } while (Date.now() - now < 5);

    //document.getElementById(this.idPrefix + 'log1').innerHTML = this.format05d(count) + ' cell/microtask';
    this.pendingUpdate = true;

    const timeout = setTimeout(() => {
      this.asyncRefreshMatrix();
      this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
    }, 0);
    this.timeouts.push(timeout);
  }

}
