import {
  Input, ElementRef,
  ViewChild,
  DoCheck,
  Renderer2, ViewRef,
  Directive,
  TemplateRef,
  ViewContainerRef,
  IterableDiffer,
  IterableDiffers,
  SimpleChanges,
  AfterViewInit,
  OnChanges, NgIterable,
  EmbeddedViewRef,
  IterableChangeRecord,
  IterableChanges,
  EventEmitter,
  Output,
  OnDestroy,
  TrackByFunction,
  ChangeDetectorRef
} from '@angular/core';
import { NgForOfContext } from '@angular/common';
// tslint:disable-next-line: no-conflicting-lifecycle
@Directive({
  selector: '[adminoVsFor]',

})
export class AdminoVirtualScrollDirective implements AfterViewInit, OnDestroy, DoCheck {
  // private collection: any;
  // private differ: IterableDiffer<any>;

  @Input() itemSize = 0;
  private realScrollSize = 0;
  private currPage = 0;
  private currPageOffset = 0;
  private prevScrollPos = 0;
  private numPages = 0;
  private pageHeight = 0;
  private jumpCoefficient = 0;
  private virtualSize = 0;
  private viewportSize = 0;
  private cache: Map<any, EmbeddedViewRef<any>> = new Map<any, EmbeddedViewRef<any>>();
  private collectionCache = [];
  maxScrollSize = 0;

  prevTotalsize = 0;
  @Input('adminoVsForTotalsize') totalsize = 0;

  // _totalsize;
  // @Input('adminoVsForTotalsize') set totalsize(val: number) {
  //   if (val !== this._totalsize) {
  //     this._totalsize = val;
  //     if (this.$viewport) {
  //       // this.realScrollSize = this.calcMaxBrowserScrollSize();
  //       // this.refresh();
  //     }
  //   }
  // }
  // get totalsize(): number {
  //   return this._totalsize;
  // }



  private $scroller: HTMLDivElement = document.createElement('div');
  private $viewport: HTMLElement;
  @Output() afterRender = new EventEmitter<any>();
  private scrollListener: () => void;
  private trackByFn: TrackByFunction<any[]> = (index, item) => { return index };

  // @Input() set adminoVsForOf(coll: any) {
  //   // this.collection = coll;
  //   // if (coll && !this.differ) {
  //   //   this.differ = this.differs.find(coll).create(this.trackByFn);
  //   // }
  // }

  // get adminoVsForOf(): any {
  //   return this.collection;
  // }


  constructor(private cd: ChangeDetectorRef, private _element: ElementRef,
    private differs: IterableDiffers, private rdr: Renderer2,
    private template: TemplateRef<any>, private viewContainer: ViewContainerRef) {
  }


  ngDoCheck() {
    // if (this.differ && this.$viewport) {
    //   const changes = this.differ.diff(this.collection);
    //   if (changes) {
    //     this.refresh();
    //   }
    // }
  }

  scrollToItem(index: number) {
    const virtualPos = index * this.itemSize;
    const currPage = /*this.currPage*/  Math.floor(virtualPos / this.pageHeight);
    const currPageOffset = /*this.currPageOffset*/  Math.round(currPage * this.jumpCoefficient);
    // this.$viewport[this.isHorzontal() ? 'scrollLeft' : 'scrollTop'] = this.prevScrollPos = (virtualPos - this.currPageOffset);
    this.$viewport.scrollTop = virtualPos - currPageOffset;
  }

  ngAfterViewInit() {
    this.maxScrollSize = this.calcMaxBrowserScrollSize();
    this.$viewport = this._element.nativeElement.parentElement;
    this.$viewport.style.position = 'relative';
    this.$scroller.style.position = 'absolute';
    this.$scroller.style.left = '0px';
    this.$scroller.style.top = '0px';
    this.$scroller.style.width = '1px';
    this.rdr.appendChild(this.$viewport, this.$scroller);
    this.viewportSize = this.$viewport.getBoundingClientRect().height;
    this.cd.detectChanges();
    this.scrollListener = this.rdr.listen(this.$viewport, 'scroll', this.onScroll.bind(this));
    // this.refresh();
    this.$viewport.scrollTop = 0;
  }

  onScroll($event: any) {
    // console.log('vsRef onScroll');
    const scrollPos = this.$viewport.scrollTop;
    if (Math.abs(scrollPos - this.prevScrollPos) > this.viewportSize) {
      this._onJump();
    } else {
      this._onNearScroll();
    }
    this.renderViewportItems();
  }

  ngOnDestroy() {
  }

  private _onJump() {
    const scrollPos = this.$viewport.scrollTop;
    this.currPage = Math.floor(scrollPos * ((this.virtualSize - this.viewportSize)
      / (this.realScrollSize - this.viewportSize)) * (1 / this.pageHeight));
    this.currPageOffset = Math.round(this.currPage * this.jumpCoefficient);
    this.prevScrollPos = scrollPos;
    this.clear();
  }

  private _onNearScroll() {
    const scrollPos = this.$viewport.scrollTop;

    if (scrollPos + this.currPageOffset > (this.currPage + 1) * this.pageHeight) {
      this.currPage++;
      this.currPageOffset = Math.round(this.currPage * this.jumpCoefficient);
      this.$viewport.scrollTop = this.prevScrollPos = (scrollPos - this.jumpCoefficient);
      this.clear();
    } else if (scrollPos + this.currPageOffset < this.currPage * this.pageHeight) {
      this.currPage--;
      this.currPageOffset = Math.round(this.currPage * this.jumpCoefficient);
      this.$viewport.scrollTop = this.prevScrollPos = (scrollPos + this.jumpCoefficient);
      this.clear();
    } else {
      this.prevScrollPos = scrollPos;
    }
  }
  private clear() {
    this.cache.clear();
    this.viewContainer.clear();
  }

  private renderViewportItems() {
    const y = this.$viewport.scrollTop + this.currPageOffset;
    let start = Math.floor((y - this.viewportSize) / this.itemSize);
    let end = Math.ceil((y + (this.viewportSize * 2)) / this.itemSize);

    start = Math.max(0, start);
    end = Math.min(this.virtualSize / this.itemSize, end);

    this.cache.forEach((v, i) => {
      if (i < start || i > end) {
        v.destroy();
        this.cache.delete(i);
      }
    });
    this.fillSpaces(start, end);
    this.collectionCache.slice(start, end).forEach((item, i) => {
      const existingView = this.cache.get(i + start);
      if (!existingView) {
        const view = this.viewContainer.createEmbeddedView(this.template);
        view.context.__position__ = (i + start) * this.itemSize - this.currPageOffset;
        view.context.$implicit = item;
        view.context.start = start;
        view.context.end = end;
        view.context.itemSize = this.itemSize;
        view.context.index = i + start;
        view.context.content = this.collectionCache[view.context.index];
        view.context.cacheIndex = i;
        this.cache.set(i + start, view);
        view.markForCheck();
      } else {
        existingView.context.cacheIndex = i;
        existingView.markForCheck();
      }
    });
    const visibleStart = Math.floor((y) / this.itemSize);
    const visibleEnd = Math.ceil((y + this.viewportSize) / this.itemSize);
    this.afterRender.emit({ start, end, visibleStart, visibleEnd });
  }

  fillSpaces(start, end) {
    let a = 0;
    for (let i = start; i < end; i++) {
      const el = this.collectionCache[i];
      if (!el) {
        this.collectionCache[i] = {};
      }
      a++;
    }
  }
  clearData() {
    Object.keys(this.collectionCache).forEach((key) => {
      delete this.collectionCache[key];
    });
    this.renderViewportItems();
  }
  patchData(data) {
    Object.keys(data).forEach((key) => {
      if (!this.collectionCache[key]) {
        this.collectionCache[key] = {};
      }
      Object.assign(this.collectionCache[key], data[key]);
      const existingView = this.cache.get(parseInt(key, 10));
      if (existingView) {
        existingView.context.content = this.collectionCache[key];
        existingView.markForCheck();
        // console.warn(key, 'exists')

      } else {
        // console.log(key, 'not exists')
      }
    });
    // console.log(this.cache);

  }

  refresh() {
    // console.log('vsref refresh start');
    this.clear();
    // const view = this.viewContainer.createEmbeddedView(this.template);
    // view.context.__position__ = 0;
    // view.context.$implicit = this.collection[0];
    // view.context.start = 0;
    // view.context.end = 0;
    // view.context.index = 0;
    // view.context.content = {};
    // view.detectChanges();
    // const rect = getComputedStyle(this.$viewport.firstElementChild);
    // this.itemSize = parseFloat(rect.height) + ((parseFloat(rect.marginTop) + parseFloat(rect.marginBottom)));
    // this.itemSize = 51;
    this.viewportSize = this.$viewport.getBoundingClientRect().height;
    this.realScrollSize = this.maxScrollSize;
    this.virtualSize = this.totalsize * this.itemSize;
    this.pageHeight = this.realScrollSize / 100;
    this.numPages = Math.ceil(this.virtualSize / this.pageHeight);
    const coff = (this.virtualSize - this.realScrollSize) / (this.numPages - 1);
    this.jumpCoefficient = coff > 0 ? coff : 1;
    this.realScrollSize = this.realScrollSize > this.virtualSize ? this.virtualSize : this.realScrollSize;
    this.currPage = 1;
    this.currPageOffset = 0;

    this.prevScrollPos = this.prevScrollPos >= 0 ? this.prevScrollPos : 0;

    this.$scroller.style.height = `${this.realScrollSize}px`;
    // console.log("REALSCROLLSIZE " + this.realScrollSize)
    // console.log(this.realScrollSize);
    // // view.destroy();
    // console.log("PREV TOTALSIZE " + (this.prevTotalsize))
    // console.log("TOTALSIZE " + (this.totalsize))
    // console.log("PREV SCROLLTOP " + this.$viewport.scrollTop)

    // this.$viewport.scrollTop = this.$viewport.scrollTop / (this.totalsize / this.prevTotalsize);
    // this.prevScrollPos = this.$viewport.scrollTop;
    // console.log("SCROLLTOP " + this.$viewport.scrollTop)
    // console.log("TOTALSIZE RATIO " + (this.totalsize / this.prevTotalsize))
    // this.prevTotalsize = this.totalsize;


    this.$viewport.dispatchEvent(new Event('scroll'));

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
    return Math.abs(size) / 2;
    // } else {
    //   return this.realScrollSize;
    // }
  }

}
