import { Component, OnInit, Input, InjectionToken, Injector, ViewChild, OnDestroy } from '@angular/core';
import { ComponentPortal, PortalInjector, CdkPortalOutlet } from '@angular/cdk/portal';
import { Subject, Observable } from 'rxjs';
export const CONTAINER_DATA = new InjectionToken<{}>('CONTAINER_DATA');

@Component({
  selector: 'admino-card',
  templateUrl: './admino-card.component.html',
  styleUrls: ['./admino-card.component.scss']
})
export class AdminoCardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @Input() component: any;
  @Input() nopadding = true;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showBorder = false;
  @Input() data: any = {};
  @Input() fillHeight = false;
  @Input() printingEnabled = true;
  @Input() opaque = false;


  componentInstance;
  loading$;

  constructor(private inj: Injector) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
