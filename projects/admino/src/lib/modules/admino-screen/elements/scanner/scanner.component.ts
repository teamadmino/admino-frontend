import { takeUntil } from 'rxjs/operators';
import { ScannerService } from './scanner.service';
import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { codeAnimation } from './inputview/scanner.animation';
import { ScreenElementChange } from '../../admino-screen.interfaces';

@Component({
  selector: 'admino-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  providers: [ScannerService]

})
export class ScannerComponent extends AdminoScreenElement implements OnInit {


  retryTimer;
  retryTime = 1000;
  maxRetryTime = 5000;
  // @HostListener('window:offline', ['$event']) offline(e) {
  //   this.scannerService.online = false;
  // }

  // @HostListener('window:online', ['$event']) online(e) {
  //   this.scannerService.online = true;
  // }

  constructor(public scannerService: ScannerService) {
    super();
    this.scannerService.online = window.navigator.onLine;
    this.scannerService.newBeolvasasEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.control.setValue(this.scannerService.getUnsyncedBeolvasasok());
      this.tryUpload();
    });

    this.scannerService.loadConfig();
    // console.log(Object.entries(localStorage))
  }
  ngOnInit() {
    // this.directive.ts.setTheme('gold', false);
    if (this.element.database !== undefined) {
      this.scannerService.updateConfig(this.element.database.version, this.element.database.utcak, this.element.database.dolgozok);
    }
    this.scannerService.scanner = this.element.scanner;

    if (this.scannerService.getUnsyncedBeolvasasok().data.length > 0) {
      this.control.setValue(this.scannerService.getUnsyncedBeolvasasok());
      this.tryUpload();
    }
    this.scannerService.page.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.directive.cd.detectChanges();
    });
    this.scannerService.dataLoaded = true;
  }
  tryUpload() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    const uploadAction = this.getAction('uploadAction');
    if (uploadAction) {
      this.handleAction(uploadAction).then((params) => {
        console.log("Successful upload")
        this.retryTime = 1000;
        this.scannerService.online = true;
        this.directive.cd.markForCheck();
      }).catch((params) => {
        console.log("Couldnt upload")
        this.retryTimer = setTimeout(() => {
          this.tryUpload();
        }, this.retryTime);
        if (this.retryTime < this.maxRetryTime) {
          this.retryTime += 1000;
        }
        this.scannerService.online = false;
        this.directive.cd.markForCheck();
      });
    }
  }

  logout() {
    this.scannerService.page.next(0);
    this.scannerService.reset();
  }

  onChange(changes: { [id: string]: ScreenElementChange; }) {
    if (changes.syncedTill) {
      this.scannerService.setSyncedTill(this.element.syncedTill);
    }
    if (changes.database) {
      if (this.element.database !== undefined) {
        this.scannerService.updateConfig(this.element.database.version.new, this.element.database.utcak.new, this.element.database.dolgozok.new);
      }
    }
    if (changes.scanner) {
      this.scannerService.scanner = this.element.scanner;

    }
  }



}
