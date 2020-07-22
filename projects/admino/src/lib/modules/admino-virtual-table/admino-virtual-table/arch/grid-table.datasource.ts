import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
/**
 * Data source
 */
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";

const ROW_HEIGHT = 48;

export class GridTableDataSource extends DataSource<any> {
  private _data: any[];
  count = 50;
  totalsize = 50000;
  offsetSub = new BehaviorSubject(0);

  get allData(): any[] {
    return this._data.slice();
  }

  set allData(data: any[]) {
    this._data = data;
    this.viewport.scrollToOffset(0);
    this.viewport.setTotalContentSize(this.itemSize * data.length);
    this.visibleData.next(this._data.slice(0, this.count));
  }

  constructor(
    initialData: any[],
    private viewport: CdkVirtualScrollViewport,
    private itemSize: number
  ) {
    super();
    this._data = initialData;
    this.viewport.elementScrolled().subscribe((ev: any) => {
      const start = Math.floor(ev.currentTarget.scrollTop / ROW_HEIGHT);
      const prevExtraData = start > 5 ? 5 : 0;
      // const prevExtraData = 0;
      const slicedData = this._data.slice(
        start - prevExtraData,
        start + (this.count - prevExtraData)
      );
      const offset = ROW_HEIGHT * (start - prevExtraData);
      this.viewport.setRenderedContentOffset(offset);
      this.offsetSub.next(offset);
      this.visibleData.next(slicedData);
    });
  }

  private readonly visibleData: BehaviorSubject<any[]> = new BehaviorSubject(
    []
  );

  connect(
    collectionViewer: import("@angular/cdk/collections").CollectionViewer
  ): Observable<any[] | ReadonlyArray<any>> {
    return this.visibleData;
  }

  disconnect(
    collectionViewer: import("@angular/cdk/collections").CollectionViewer
  ): void {}
}
