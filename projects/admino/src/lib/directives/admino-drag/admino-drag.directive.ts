import { Directive, Renderer2, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[adminoDrag]'
})
export class AdminoDragDirective {

  dragStartPosX = 0;
  dragStartPosY = 0;
  isDragging = false;
  touchMoveListener;
  touchEndListener;
  dragData = { start: { x: 0, y: 0 }, delta: { x: 0, y: 0 } };

  @Output() adminoDragStart = new EventEmitter<any>();
  @Output() adminoDragMove = new EventEmitter<{ start: { x: number, y: number }, delta: { x: number, y: number } }>();
  @Output() adminoDragEnd = new EventEmitter<any>();


  @HostListener('touchstart', ['$event'])
  // @HostListener('mousedown', ['$event'])
  onStart(evt) {
    // evt.preventDefault();
    this.adminoDragStart.next();
    // evt.preventDefault();
    if (evt.touches && evt.touches[0]) {
      this.dragStartPosX = evt.clientX || evt.touches[0].clientX;
      this.dragStartPosY = evt.clientY || evt.touches[0].clientY;
      this.isDragging = true;
      this.dragData.start.x = this.dragStartPosX;
      this.dragData.start.y = this.dragStartPosY;

      this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => {
        const mY = e.clientY || e.touches[0].clientY;
        const mX = e.clientX || e.touches[0].clientX;

        this.dragData.delta.y = mY - this.dragData.start.y;
        this.dragData.delta.x = mX - this.dragData.start.x;
        this.adminoDragMove.next(Object.assign({}, this.dragData));
      });

      this.touchEndListener = this.renderer.listen('document', 'touchend', e => {
        this.isDragging = false;
        this.adminoDragEnd.next();

        if (this.touchMoveListener) {
          this.touchMoveListener();
        }
        if (this.touchEndListener) {
          this.touchEndListener();
        }
      });
    }
  }

  constructor(private renderer: Renderer2) { }

  touchStart(evt) {

  }
}
