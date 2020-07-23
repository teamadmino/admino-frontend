import { AbstractControl } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { ScannerService } from "./scanner.service";
import { ChangeDetectorRef, Component, Input, OnDestroy, HostListener } from "@angular/core";
import { Subject } from "rxjs";
@Component({
  template: "",
})
export class ScannerView implements OnDestroy {
  ngUnsubscribe: Subject<any> = new Subject();
  @Input() pageNum: number;

  activeControl: AbstractControl;

  @HostListener("document:keydown", ["$event"])
  onKeyInput(e) {
    this.scannerService.logActivity();
    if (e.key === "Enter") {
      if (this.isActive()) {
        this.onNext();
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      if (this.isActive()) {
        this.onPrev();
      }
      e.preventDefault();
    }
    this.keyInput(e);
  }
  keyInput(e) {}

  isActive() {
    return this.scannerService.page.value === this.pageNum;
  }

  isNumber(num) {
    return isFinite(num);
  }
  constructor(public cd: ChangeDetectorRef, public scannerService: ScannerService) {
    this.scannerService.next.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.isActive()) {
        this.onNext();
      }
    });
    this.scannerService.prev.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.isActive()) {
        this.onPrev();
      }
    });
  }

  onNext() {}
  onPrev() {
    if (this.scannerService.page.value > 0) {
      this.scannerService.page.next(this.pageNum - 1);
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
