import { Directive, Renderer2, HostListener, Output, EventEmitter, OnDestroy } from "@angular/core";

@Directive({
  selector: "[adminoDrag]",
})
export class AdminoDragDirective implements OnDestroy {
  dragStartPosX = 0;
  dragStartPosY = 0;
  isDragging = false;
  dragMoveListener;
  dragEndListener;
  dragData = { start: { x: 0, y: 0 }, delta: { x: 0, y: 0 } };

  @Output() adminoDragStart = new EventEmitter<any>();
  @Output() adminoDragMove = new EventEmitter<{
    start: { x: number; y: number };
    delta: { x: number; y: number };
  }>();
  @Output() adminoDragEnd = new EventEmitter<any>();

  // @HostListener('touchstart', ['$event'])
  @HostListener("mousedown", ["$event"])
  onStart(evt) {
    this.dragStartPosX = evt.clientX;
    this.dragStartPosY = evt.clientY;
    this.isDragging = true;
    this.dragData.start.x = this.dragStartPosX;
    this.dragData.start.y = this.dragStartPosY;

    this.adminoDragStart.next(Object.assign({}, this.dragData));

    this.dragMoveListener = this.renderer.listen("document", "mousemove", (e) => {
      const mY = e.clientY;
      const mX = e.clientX;

      this.dragData.delta.y = mY - this.dragData.start.y;
      this.dragData.delta.x = mX - this.dragData.start.x;
      this.adminoDragMove.next(Object.assign({}, this.dragData));
    });

    this.dragEndListener = this.renderer.listen("document", "mouseup", (e) => {
      this.endDrag();
    });
  }

  endDrag() {
    this.isDragging = false;
    this.adminoDragEnd.next();

    if (this.dragMoveListener) {
      this.dragMoveListener();
    }
    if (this.dragEndListener) {
      this.dragEndListener();
    }
  }

  constructor(private renderer: Renderer2) {}

  ngOnDestroy() {
    if (this.dragMoveListener) {
      this.dragMoveListener();
    }
    if (this.dragEndListener) {
      this.dragEndListener();
    }
  }
}
