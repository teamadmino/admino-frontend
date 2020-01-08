import { BehaviorSubject } from 'rxjs';
import { AdminoGridItemComponent } from './../admino-grid-item/admino-grid-item.component';
import { Component, OnInit, Input, ContentChildren, QueryList, AfterContentInit, ViewChildren, AfterViewInit, ViewChild, ElementRef, OnChanges, HostBinding, HostListener, enableProdMode } from '@angular/core';

@Component({
  selector: 'admino-grid',
  templateUrl: './admino-grid.component.html',
  styleUrls: ['./admino-grid.component.scss']
})
export class AdminoGridComponent implements OnInit, AfterContentInit, AfterViewInit, OnChanges {

  colnum = 12;
  rownum = 0;
  @Input() displayGrid = true;
  gridAutoRows = '';
  @HostBinding('class.edit-mode') @Input() editMode = false;
  @ContentChildren(AdminoGridItemComponent, { descendants: false }) gridItems: QueryList<AdminoGridItemComponent>;
  @ViewChild('gridRef', { static: true }) gridRef: ElementRef;
  @ViewChildren('rowsRef') rowsRef: QueryList<ElementRef>;
  colSizePx = 10;
  rowSizePx = 50;

  activeItem: BehaviorSubject<any> = new BehaviorSubject(null);



  @HostListener('mousemove', ['$event'])
  onMouseup(e: MouseEvent) {
    // const rect = this.gridRef.nativeElement.getBoundingClientRect();
    // console.log('mouseX', e.clientY - rect.top)
    // console.log('row', this.calculateRow(e.clientY - rect.top))
  }

  @HostListener('window:resize', ['$event'])
  resize(e: MouseEvent) {
    this.refresh();
  }


  calcCoordinates(posX, posY) {
    // const posX = e.clientX - rect.left;
    // const posY = e.clientY - rect.top;
    return {
      col: Math.floor(posX / this.colSizePx) + 1,
      row: this.calculateRow(posY)
    };
  }

  constructor() {

  }
  ngOnChanges() {
    this.refresh();
  }
  ngOnInit() {
  }
  ngAfterContentInit() {
    this.refresh();
  }
  ngAfterViewInit() {
    this.refresh();

  }

  calculateRow(posY: number) {
    const rows = this.rowsRef.toArray();
    let row = -1;
    for (let i = 0; i < rows.length; i++) {
      const rowEl = rows[i];
      // console.log(rowEl.nativeElement.offsetTop + rowEl.nativeElement.clientHeight)
      // console.log(posY)
      if (rowEl.nativeElement.offsetTop + rowEl.nativeElement.clientHeight > posY) {
        row = i + 1;
        break;
      }
      if (i === rows.length - 1 && rowEl.nativeElement.offsetTop + rowEl.nativeElement.clientHeight < posY) {
        row = i + 2;
        break;
      }
    }
    return row;
  }


  drop(e) {
    console.log('dropped');
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    console.log(data);
  }
  allowDrop(e) {
    e.preventDefault();
  }
  refresh() {
    const gr = this.gridRef.nativeElement;
    this.colSizePx = gr.clientWidth / this.colnum;

    if (this.gridItems) {
      const arr = this.gridItems.toArray();
      this.rownum = 0;

      const itemsPerRows = [];

      for (const gridItem of arr) {
        gridItem.colnum = this.colnum;
        gridItem.gridComponent = this;
        gridItem.editMode = this.editMode;

        const rowMax = gridItem.row + gridItem.rowSpan - 1;

        if (rowMax > this.rownum) {
          this.rownum = rowMax;
        }

        const rowId = gridItem.row ? gridItem.row : 1;
        if (!itemsPerRows[rowId]) {
          itemsPerRows[rowId] = [];
        }
        itemsPerRows[rowId].push(gridItem);
        for (let a = 1; a < gridItem.rowSpan; a++) {
          if (!itemsPerRows[rowId + a]) {
            itemsPerRows[rowId + a] = [];
          }
          itemsPerRows[rowId + a].push(gridItem);
        }

        gridItem.init();
      }


      let rowDefs = '';
      for (let i = 1; i < itemsPerRows.length; i++) {
        const items = itemsPerRows[i];
        let rowSpanDef = 'minmax(1fr, auto)';
        if (items) {
          for (const item of items) {
            if (item.autoRow === true) {
              rowSpanDef = 'auto';
            }
          }
        }
        rowDefs += rowSpanDef + ' ';
      }
      // console.log(rowDefs);
      this.gridAutoRows = rowDefs;
      // this.rowSizePx = gr.clientHeight / this.rownum;
    }
  }

  getRowHelpers() {
    return new Array(this.rownum);
  }
  getColumnHelpers() {
    return new Array(this.colnum - 1);
  }


  getStyle() {
    return {
      // 'grid-template-columns': `repeat(${this.colnum},minmax(auto,1fr))`,
      'grid-template-columns': `repeat(${this.colnum},1fr)`,
      'grid-template-rows': this.gridAutoRows,
    };
  }

}
