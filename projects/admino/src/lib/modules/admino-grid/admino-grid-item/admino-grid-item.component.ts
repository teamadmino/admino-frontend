import { AdminoDragDirective } from './../../../directives/admino-drag/admino-drag.directive';
import { AdminoGridComponent } from './../admino-grid/admino-grid.component';
import { Component, OnInit, Input, HostBinding, EventEmitter, Output, ElementRef, HostListener, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'admino-grid-item',
  templateUrl: './admino-grid-item.component.html',
  styleUrls: ['./admino-grid-item.component.scss']
})
export class AdminoGridItemComponent implements OnInit, AfterContentInit {

  @Input() colSpan: any = 1;
  @Input() rowSpan: any = 1;
  @Input() row: any = 1;
  @Input() col: any = 1;
  @Input() align = 'left';
  @Input() height = null;
  @Input() style = {};


  @Input() gridComponent: AdminoGridComponent;
  @HostBinding('class.edit-mode') @Input() editMode = false;
  @HostBinding('class.border-color-primary') bcolor = true;
  @HostBinding('attr.draggable') dragging = false;

  @ViewChild('dragRef', { static: false, read: AdminoDragDirective }) dragRef: AdminoDragDirective;
  @ViewChild('resizeRef', { static: false, read: ElementRef }) resizeRef: ElementRef;
  @ViewChild('dragRef', { static: false, read: ElementRef }) dragElRef: ElementRef;

  @Input() colnum = 12;
  @HostBinding('class.hidden') @Input() hidden = false;

  prevOffsetLeft;
  prevOffsetTop;

  prevColSpan;
  prevRowSpan;

  dragStartX = 0;
  dragStartY = 0;
  prevDragFunc;


  isMouseOver = false;
  resizing = false;
  inited = false;

  isActive = false;
  isOtherActive = false;



  @HostBinding('style')
  get myStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.getStyle());
  }
  @HostListener('mouseenter', ['$event']) mouseEnter(e) {
    if (!this.editMode) {
      return;
    }
    this.isMouseOver = true;
    this.setActive();

  }
  @HostListener('mouseleave', ['$event']) mouseLeave(e) {
    if (!this.editMode) {
      return;
    }
    this.isMouseOver = false;
    this.removeActive();
  }

  constructor(private sanitizer: DomSanitizer, private elRef: ElementRef) {


  }

  init() {
    if (this.inited === false) {

      this.inited = true;
      this.gridComponent.activeItem.subscribe((activeItem) => {
        if (this.gridComponent.activeItem.value === this) {
          this.isActive = true;
          this.isOtherActive = false;
        } else if (this.gridComponent.activeItem.value !== null) {
          this.isActive = false;
          this.isOtherActive = true;
        } else {
          this.isActive = false;
          this.isOtherActive = false;
        }
      });
    }

  }
  ngOnInit() {

  }
  ngAfterContentInit() {

  }
  // getStyle() {
  //   let s = '';
  //   const ratio = 100 / (this.colnum / this.col);
  //   s += `flex: 0 0 ${ratio}%;`;
  //   s += `max-width: ${ratio}%`;

  //   if (!this.stretch) {
  //     s += 'align-self: false';
  //   }

  //   return s;
  // }
  getStyle() {
    let s = '';
    s += 'text-align:' + this.align + ';';

    // const ratio = 100 / (this.colnum / this.col);
    if (this.colSpan) {
      if (this.colSpan === 'auto') {
        s += `grid-column: ${(this.col)} / auto; `;
      } else {
        s += `grid-column:  ${(this.col)} / span ${(this.colSpan)}; `;
      }
    }
    if (this.row) {
      s += `grid-row: ${(this.row)} / span ${(this.rowSpan)}; `;
    }
    if (this.row === 1 || this.editMode) {
      s += 'margin-top: 0em;';
    } else {
      s += 'margin-top: 1em;';
    }
    // s += `grid-row: span ${(1)};`;

    if (this.rowSpan > 1) {
      s += 'align-self: stretch;';
      // s += 'grid-row: fr1;';
    }
    return s;
  }




  // dragStart(dragEvent) {
  //   this.dragging = true;
  //   this.prevOffsetLeft = this.elRef.nativeElement.offsetLeft;
  //   this.prevOffsetTop = this.elRef.nativeElement.offsetTop;
  // }
  // dragMove(dragEvent) {
  //   const rect = this.elRef.nativeElement.getBoundingClientRect();


  //   const posX = this.elRef.nativeElement.offsetLeft + dragEvent.delta.x - (this.elRef.nativeElement.offsetLeft - this.prevOffsetLeft);
  //   const posY = this.elRef.nativeElement.offsetTop + dragEvent.delta.y - (this.elRef.nativeElement.offsetTop - this.prevOffsetTop);

  //   const coord = this.gridComponent.calcCoordinates(posX, posY);

  //   const newCol = coord.col;
  //   this.col = newCol < 1 ? 1 : newCol > this.colnum - this.colSpan + 1 ? this.colnum - this.colSpan + 1 : newCol;

  //   const newRow = coord.row;
  //   this.row = newRow < 1 ? 1 : newRow;
  //   this.gridComponent.refresh();
  // }


  setActive() {
    this.gridComponent.activeItem.next(this);
  }
  removeActive() {
    if (this.gridComponent.activeItem.value === this && !this.dragging && !this.resizing && !this.isMouseOver) {
      this.gridComponent.activeItem.next(null);
    }

  }

  dragStart(e) {
    this.dragging = true;
    this.setActive();

    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.prevOffsetLeft = this.elRef.nativeElement.offsetLeft;
    this.prevOffsetTop = this.elRef.nativeElement.offsetTop;
    this.prevDragFunc = null;

  }
  @HostListener('dragstart', ['$event']) dragStartEvent(e) {
    // e.dataTransfer.setData('text', this.elRef.nativeElement);

  }

  @HostListener('drag', ['$event']) dragMoveEvent(e) {

    e.stopPropagation();
    if (this.prevDragFunc) {
      this.prevDragFunc();
    }
    this.prevDragFunc = () => {
      const rect = this.elRef.nativeElement.getBoundingClientRect();
      const deltaY = e.clientY - this.dragStartY;
      const deltaX = e.clientX - this.dragStartX;

      const posX = this.elRef.nativeElement.offsetLeft + deltaX - (this.elRef.nativeElement.offsetLeft - this.prevOffsetLeft);
      const posY = this.elRef.nativeElement.offsetTop + deltaY - (this.elRef.nativeElement.offsetTop - this.prevOffsetTop);

      const coord = this.gridComponent.calcCoordinates(posX + this.dragElRef.nativeElement.offsetLeft, posY);

      const newCol = coord.col;
      this.col = newCol < 1 ? 1 : newCol > this.colnum - this.colSpan + 1 ? this.colnum - this.colSpan + 1 : newCol;

      const newRow = coord.row;
      this.row = newRow < 1 ? 1 : newRow;
      this.gridComponent.refresh();



    };

  }
  // dragEnd(dragEvent) {
  // }
  @HostListener('dragend', ['$event']) dragEndEvent(e) {

    this.dragging = false;
    // this.dragRef.endDrag();
    this.removeActive();
  }




  resizeStart(dragEvent) {

    this.setActive();
    this.resizing = true;
    this.prevColSpan = this.colSpan;
    this.prevRowSpan = this.rowSpan;

    const rect = this.elRef.nativeElement.getBoundingClientRect();
    // const gridRect = this.gridComponent.gridRef.nativeElement.getBoundingClientRect();
    const el = this.elRef.nativeElement;

    const pX = dragEvent.start.x - rect.left + el.offsetLeft;
    const pY = dragEvent.start.y - rect.top + el.offsetTop;

    this.prevOffsetLeft = pX;
    this.prevOffsetTop = pY;
  }
  resizeEl(dragEvent) {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    const el = this.elRef.nativeElement;

    // const rect = el.getBoundingClientRect();
    // console.log(rect.left);
    // console.log(el.offsetParent.offsetLeft);

    const pX = dragEvent.start.x - rect.left + el.offsetLeft;
    const pY = dragEvent.start.y - rect.top + el.offsetTop;
    const posX = pX + dragEvent.delta.x - (pX - this.prevOffsetLeft);
    const posY = pY + dragEvent.delta.y - (pY - this.prevOffsetTop);
    console.log('posY', Math.round(posY));
    // const deltaX = dragEvent.delta.x;
    // const deltaY = dragEvent.delta.y;
    // const posX = this.elRef.nativeElement.offsetLeft + deltaX - (this.elRef.nativeElement.offsetLeft - this.prevOffsetLeft);
    // const posY = this.elRef.nativeElement.offsetTop + deltaY - (this.elRef.nativeElement.offsetTop - this.prevOffsetTop);

    const coord = this.gridComponent.calcCoordinates(posX, posY);
    const newColSize = coord.col - this.col + 1;


    this.colSpan = newColSize < 1 ? 1 :
      newColSize > this.gridComponent.colnum - this.col + 1 ? this.gridComponent.colnum - this.col + 1 : newColSize;

    // const yd = dragEvent.delta.y;
    // const rowsize = this.gridComponent.rowSizePx;
    // const coldif = Math.round(xd / colsize);
    const newRowSize = coord.row - this.row + 1;
    this.rowSpan = newRowSize < 1 ? 1 : newRowSize;
    // element.col++;
    this.gridComponent.refresh();
  }
  resizeEnd(dragEvent) {
    this.resizing = false;
    this.removeActive();

  }
}
