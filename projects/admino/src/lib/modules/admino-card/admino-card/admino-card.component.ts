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

  // @ViewChild('PortalOutletRef') portalOutletRef;
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutletRef: CdkPortalOutlet;

  @Input() component: any;
  @Input() nopadding = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() hideBg = false;
  @Input() data: any = {};
  @Input() fillHeight = false;
  @Input() printingEnabled = true;
  @Input() opaque = false;



  componentPortal: ComponentPortal<any>;

  componentInstance;
  loading$;

  // public outputs: { [id: string]: Observable<any>; } = {};

  constructor(private inj: Injector) {
  }

  ngOnInit() {
    // console.log(this.component);
    // this.componentPortal = new ComponentPortal(this.component);
    // if (!this.data) {
    //   this.data = {};
    // }
    // if (this.component) {
    //   // this.data.title = this.title;
    //   const injectedData: any = {};
    //   injectedData.card = this;
    //   injectedData.data = this.data;

    //   this.componentPortal = new ComponentPortal(this.component, null, this.createInjector(injectedData));
    //   // overlay.attach(containerPortal);
    //   this.componentInstance = this.componentPortal.attach(this.portalOutletRef);
    //   if (this.componentInstance.instance.outputs) {
    //     this.outputs = this.componentInstance.instance.outputs;
    //     this.loading$ = this.componentInstance.instance.outputs.loading;
    //     // this.componentInstance.instance.loading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {

    //     // });
    //   }
    // }
    // console.log(this.portalOutletRef)
  }
  // createInjector(dataToPass): PortalInjector {
  //   const injectorTokens = new WeakMap();
  //   injectorTokens.set(CONTAINER_DATA, dataToPass);
  //   return new PortalInjector(this.inj, injectorTokens);
  // }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
