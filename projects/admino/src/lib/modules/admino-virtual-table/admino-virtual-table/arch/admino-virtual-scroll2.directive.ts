import {
  Input,
  ElementRef,
  ViewChild,
  DoCheck,
  Renderer2,
  ViewRef,
  Directive,
  TemplateRef,
  ViewContainerRef,
  IterableDiffer,
  IterableDiffers,
  SimpleChanges,
  AfterViewInit,
  OnChanges,
  NgIterable,
  EmbeddedViewRef,
  IterableChangeRecord,
  IterableChanges,
  EventEmitter,
  Output,
  OnDestroy,
  TrackByFunction,
} from "@angular/core";
import { NgForOfContext } from "@angular/common";
// tslint:disable-next-line: no-conflicting-lifecycle
@Directive({
  selector: "[vsFor][vsForOf]",
})
export class AdminoVirtualScrollDirective
  implements AfterViewInit, OnChanges, OnDestroy, DoCheck {
  private itemSize = 0;
  private realScrollSize = 0;
  private currPage = 0;
  private currPageOffset = 0;
  private prevScrollPos = 0;
  private numPages = 0;
  private pageHeight = 0;
  private jumpCoefficient = 0;
  private virtualSize = 0;
  private viewportSize = 0;
  private cache = new Map<number, ViewRef>();
  private $scroller: HTMLDivElement = document.createElement("div");
  private $viewport: HTMLElement;
  private scrollListener: () => void;
  private _differ: IterableDiffer<any[]> | null = null;
  private _trackByFn: TrackByFunction<any[]>;
  private expectedTime = 0;

  @Input() vsForOf: any[];
  @Input() vsForHorizontal = false;
  @Output() afterRender = new EventEmitter<any>();

  constructor(
    private _element: ElementRef,
    private _viewContainer: ViewContainerRef,
    private rdr: Renderer2,
    private _template: TemplateRef<any>,
    private _differs: IterableDiffers
  ) {}

  @Input()
  set vsForTemplate(value: TemplateRef<NgForOfContext<any[]>>) {
    if (value) {
      this._template = value;
    }
  }

  @Input()
  set vsForTrackBy(fn: TrackByFunction<any[]>) {
    this._trackByFn = fn;
  }

  get vsForTrackBy(): TrackByFunction<any[]> {
    return this._trackByFn;
  }

  onScroll($event: any) {
    const scrollPos = this.$viewport[
      this.isHorzontal() ? "scrollLeft" : "scrollTop"
    ];
    if (Math.abs(scrollPos - this.prevScrollPos) > this.viewportSize) {
      this._onJump();
    } else {
      this._onNearScroll();
    }

    this._renderViewportItems();
  }

  ngAfterViewInit() {
    this.realScrollSize = this.calcMaxBrowserScrollSize();
    this.$viewport = this._element.nativeElement.parentElement;
    this.$viewport.style.position = "relative";
    this.$scroller.style.position = "absolute";
    this.$scroller.style.left = "0px";
    this.$scroller.style.top = "0px";
    this.$scroller.style[this.isHorzontal() ? "height" : "width"] = "1px";
    this.rdr.appendChild(this.$viewport, this.$scroller);
    this.viewportSize = this.$viewport.getBoundingClientRect()[
      this.isHorzontal() ? "width" : "height"
    ];
    this.scrollListener = this.rdr.listen(
      this.$viewport,
      "scroll",
      this.onScroll.bind(this)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("vsForOf" in changes) {
      // React on vsForOf changes only once all inputs have been initialized
      const value = changes["vsForOf"].currentValue;
      if (!this._differ && value) {
        try {
          this._differ = this._differs.find(value).create(this.vsForTrackBy);
        } catch (e) {
          throw new Error(
            `Cannot find a differ supporting object '${value}' of type '${JSON.stringify(
              value
            )}'. NgFor only supports binding to Iterables such as Arrays.`
          );
        }
      }
    }
  }

  ngDoCheck(): void {
    if (this.$viewport && this._differ) {
      const changes = this._differ.diff(this.vsForOf);
      if (changes) {
        this._refresh(changes);
      }
    }
  }

  private _onNearScroll() {
    const scrollPos = this.$viewport[
      this.isHorzontal() ? "scrollLeft" : "scrollTop"
    ];

    if (
      scrollPos + this.currPageOffset >
      (this.currPage + 1) * this.pageHeight
    ) {
      this.currPage++;
      this.currPageOffset = Math.round(this.currPage * this.jumpCoefficient);
      this.$viewport[
        this.isHorzontal() ? "scrollLeft" : "scrollTop"
      ] = this.prevScrollPos = scrollPos - this.jumpCoefficient;
      this.clear();
    } else if (
      scrollPos + this.currPageOffset <
      this.currPage * this.pageHeight
    ) {
      this.currPage--;
      this.currPageOffset = Math.round(this.currPage * this.jumpCoefficient);
      this.$viewport[
        this.isHorzontal() ? "scrollLeft" : "scrollTop"
      ] = this.prevScrollPos = scrollPos + this.jumpCoefficient;
      this.clear();
    } else {
      this.prevScrollPos = scrollPos;
    }
  }

  private _onJump() {
    const scrollPos = this.$viewport[
      this.isHorzontal() ? "scrollLeft" : "scrollTop"
    ];
    this.currPage = Math.floor(
      scrollPos *
        ((this.virtualSize - this.viewportSize) /
          (this.realScrollSize - this.viewportSize)) *
        (1 / this.pageHeight)
    );
    this.currPageOffset = Math.round(this.currPage * this.jumpCoefficient);
    this.prevScrollPos = scrollPos;
    this.clear();
  }

  private isHorzontal(): boolean {
    return this.vsForHorizontal;
  }

  private _refresh(changes: IterableChanges<any[]>) {
    this.clear();

    const view = this._viewContainer.createEmbeddedView(this._template);
    view.context.__position__ = 0;
    view.context.$implicit = this.vsForOf[0];
    view.context.start = 0;
    view.context.end = 0;
    view.context.index = 0;
    view.detectChanges();
    const rect = getComputedStyle(this.$viewport.firstElementChild);
    this.itemSize =
      parseFloat(this.isHorzontal() ? rect.width : rect.height) +
      (this.isHorzontal()
        ? parseFloat(rect.marginLeft) + parseFloat(rect.marginRight)
        : parseFloat(rect.marginTop) + parseFloat(rect.marginBottom));

    this.virtualSize = this.vsForOf.length * this.itemSize;
    this.pageHeight = this.realScrollSize / 100;
    this.numPages = Math.ceil(this.virtualSize / this.pageHeight);
    const coff = (this.virtualSize - this.realScrollSize) / (this.numPages - 1);
    this.jumpCoefficient = coff > 0 ? coff : 1;
    this.realScrollSize =
      this.realScrollSize > this.virtualSize
        ? this.virtualSize
        : this.realScrollSize;
    this.currPage = 1;
    this.currPageOffset = 0;
    this.prevScrollPos = this.prevScrollPos >= 0 ? this.prevScrollPos : 0;

    this.$scroller.style[
      this.isHorzontal() ? "width" : "height"
    ] = `${this.realScrollSize}px`;
    view.destroy();
    this.$viewport.dispatchEvent(new Event("scroll"));
  }

  private clear() {
    this.cache.clear();
    this._viewContainer.clear();
  }

  private _renderViewportItems() {
    const y =
      this.$viewport[this.isHorzontal() ? "scrollLeft" : "scrollTop"] +
      this.currPageOffset;

    let start = Math.floor((y - this.viewportSize) / this.itemSize);
    let end = Math.ceil((y + this.viewportSize * 2) / this.itemSize);

    start = Math.max(0, start);
    end = Math.min(this.virtualSize / this.itemSize, end);

    this.cache.forEach((v, i) => {
      if (i < start || i > end) {
        v.destroy();
        this.cache.delete(i);
      }
    });

    this.vsForOf.slice(start, end).forEach((item, i) => {
      if (!this.cache.get(i + start)) {
        const view = this._viewContainer.createEmbeddedView(this._template);
        view.context.__position__ =
          (i + start) * this.itemSize - this.currPageOffset;
        view.context.$implicit = item;
        view.context.start = start;
        view.context.end = end;
        view.context.index = i + start;
        this.cache.set(i + start, view);
        view.markForCheck();
      }
    });

    this.afterRender.emit({ items: this.vsForOf.slice(start, end) });
  }

  private calcMaxBrowserScrollSize(): number {
    if (!this.realScrollSize) {
      const div = document.createElement("div");
      const style = div.style;
      style.position = "absolute";
      style.left = "99999999999999px";
      style.top = "9999999999999999px";
      document.body.appendChild(div);

      const size = div.getBoundingClientRect()[
        this.isHorzontal() ? "left" : "top"
      ];
      document.body.removeChild(div);
      return Math.abs(size);
    } else {
      return this.realScrollSize;
    }
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
