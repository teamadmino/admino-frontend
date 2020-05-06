import { ScannerService } from './../scanner.service';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'admino-infopanel',
  templateUrl: './infopanel.component.html',
  styleUrls: ['./infopanel.component.scss']
})
export class InfopanelComponent implements OnInit, OnDestroy {
  public ngUnsubscribe: Subject<null> = new Subject();

  constructor(public scannerService: ScannerService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.scannerService.page.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.cd.markForCheck();
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
