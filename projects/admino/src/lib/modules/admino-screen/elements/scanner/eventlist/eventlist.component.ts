import { ScannerService, BeolvasasEvent } from "./../scanner.service";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "admino-eventlist",
  templateUrl: "./eventlist.component.html",
  styleUrls: ["./eventlist.component.scss"],
})
export class EventlistComponent implements OnInit, OnDestroy {
  @ViewChild("virtualScrollRef", { static: true, read: ElementRef })
  virtualScrollRef: ElementRef;
  public ngUnsubscribe: Subject<null> = new Subject();

  showConfirmationId = -1;
  selectedId = -1;

  currentYear = new Date().getFullYear();
  hiderOpacity = 1;
  animTimeout;

  timeouts = [];
  animated = [];
  constructor(
    private cd: ChangeDetectorRef,
    private scannerService: ScannerService
  ) {
    this.scannerService.newBeolvasasEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((beolv: BeolvasasEvent) => {
        this.showConfirmationId = -1;
        this.selectedId = -1;

        this.newCode(beolv.id);
      });
  }
  scrollEvt() {
    const scrollPos =
      this.virtualScrollRef.nativeElement.scrollTop +
      this.virtualScrollRef.nativeElement.offsetHeight;
    const max = this.virtualScrollRef.nativeElement.scrollHeight;
    if (scrollPos > max - 300) {
      this.hiderOpacity = (max - scrollPos) / 300;
    } else {
      this.hiderOpacity = 1;
    }
  }
  ngOnInit() {}
  getDateFormat(date) {
    if (this.currentYear !== new Date(date).getFullYear()) {
      return "yy/MM/dd H:mm:ss";
    } else {
      return "MM/dd H:mm:ss";
    }
  }
  click(id) {
    this.showConfirmationId = id;
  }
  newCode(id: number) {
    this.virtualScrollRef.nativeElement.scrollTop = 0;
    this.scrollEvt();

    this.animated.push(id);
    const timeout = setTimeout((params) => {
      this.animated.splice(this.animated.indexOf(id), 1);
      this.timeouts.splice(this.timeouts.indexOf(id), 1);
    }, 1000);
    this.timeouts.push(timeout);
  }
  stornoCode(originalReading: BeolvasasEvent) {
    const reading: BeolvasasEvent = {
      bala: originalReading.bala,
      type: "sztorno",
      eredetiBeolvasas: originalReading,
    };
    this.scannerService.addBeolvasas(reading);
  }
  codeClicked(id) {
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.showConfirmationId = -1;
    }
  }
  getCodes() {
    const val = this.scannerService.getAllBeolvasas();
    return val.slice().reverse();
  }
  trackByFn(index, item) {
    return item.id;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.timeouts = [];
  }
}
