import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { ScannerService } from "../scanner.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "admino-erroroverlay",
  templateUrl: "./erroroverlay.component.html",
  styleUrls: ["./erroroverlay.component.scss"],
})
export class ErroroverlayComponent implements OnInit, OnDestroy {
  public ngUnsubscribe: Subject<null> = new Subject();

  showError = false;
  error: any = {};

  constructor(private cd: ChangeDetectorRef, private scannerService: ScannerService) {
    this.scannerService.newErrorEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe((err) => {
      this.error = err;
      this.playError();
    });
  }

  playError() {
    this.showError = false;
    this.cd.detectChanges();
    this.showError = true;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
