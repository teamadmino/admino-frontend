import { FixedSizeVirtualScrollStrategy, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
const ROW_HEIGHT = 48;

/**
 * Virtual Scroll Strategy
 */
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(ROW_HEIGHT, 1000, 2000);
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.onDataLengthChanged();
  }
}
