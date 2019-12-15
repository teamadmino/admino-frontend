import { Subject, BehaviorSubject } from 'rxjs';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, Injector, InjectionToken, ComponentFactoryResolver, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { CdkPortalOutlet, PortalInjector, ComponentPortal } from '@angular/cdk/portal';
export const MODAL_DATA = new InjectionToken<{}>('MODAL_DATA');
export const MODAL_REF = new InjectionToken<{}>('MODAL_REF');

export interface AdminoModalConfig {
  width?: string;
  height?: string;
  verticalPosition?: string;
  horizontalPosition?: string;
  nopadding?: boolean;

  data?: any;
  resolver?: any;
  injector?: any;
}

@Component({
  selector: 'admino-modal',
  templateUrl: './admino-modal.component.html',
  styleUrls: ['./admino-modal.component.scss']
})
export class AdminoModalComponent implements OnInit {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutletRef: CdkPortalOutlet;

  component: any;
  componentResolver: any;
  data: any;
  injector: Injector;
  componentInstance;
  config: AdminoModalConfig = {
    width: 600 + 'px',
    // height: 100 + '%',
    nopadding: true,
  };

  @Output() closeEvent: EventEmitter<any> = new EventEmitter();

  dataChange: BehaviorSubject<any> = new BehaviorSubject(null);

  @HostListener('keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      this.close();
    }
  }


  constructor(private cd: ChangeDetectorRef) {
  }
  createInjector(): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(MODAL_DATA, this.dataChange);
    injectorTokens.set(MODAL_REF, this);
    return new PortalInjector(this.injector, injectorTokens);
  }
  create() {
    this.dataChange.next(this.data);
    const componentPortal = new ComponentPortal(this.component, null, this.createInjector(), this.componentResolver);
    this.componentInstance = componentPortal.attach(this.portalOutletRef);
    this.cd.markForCheck();
  }
  close() {
    this.closeEvent.next();
  }
  setData(newdata) {
    this.dataChange.next(newdata);
  }
  ngOnInit() {

    // // } else {
    // //   this.componentPortal = new ComponentPortal(this.content.component, null,
    // //     this.createInjector(this.cont));
    // // }
  }
  getClasses() {
    const arr = [];
    if (this.config.nopadding) {
      arr.push('nopadding');
    }
    if (this.config.verticalPosition) {
      arr.push('vertical-' + this.config.verticalPosition);
    }
    if (this.config.horizontalPosition) {
      arr.push('horizontal-' + this.config.horizontalPosition);
    }
    return arr;
  }

}
