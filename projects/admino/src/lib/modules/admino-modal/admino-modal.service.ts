import { AdminoModalComponent, AdminoModalConfig } from "./admino-modal/admino-modal.component";
import { Injectable, Injector, ViewContainerRef, ComponentFactoryResolver, ViewRef, ComponentRef, ChangeDetectorRef } from "@angular/core";
import { Portal, CdkPortalOutlet, ComponentPortal, PortalInjector, ComponentType } from "@angular/cdk/portal";
import { Component } from "@angular/compiler/src/core";

export interface AdminoModalRef {
  modal: AdminoModalComponent;
  component: any;
}

// {  providedIn: 'root'}
@Injectable({ providedIn: "root" })
export class AdminoModalService {
  id = 0;
  modalStack = [];
  portalOutlet = null;
  injector: PortalInjector = null;
  componentResolverFactory: ComponentFactoryResolver = null;
  viewContainerRef: ViewContainerRef = null;

  openModals: { viewRef: ViewRef }[] = [];

  constructor() {
    this.id = Math.random();
  }
  open(componentType: any, config: AdminoModalConfig = {}): AdminoModalRef {
    // console.log(this.componentResolverFactory);
    // console.log(this.viewContainerRef);
    // console.log(componentType);

    const factory = this.componentResolverFactory.resolveComponentFactory(AdminoModalComponent);
    const component: ComponentRef<AdminoModalComponent> = factory.create(this.injector);
    const viewRef = this.viewContainerRef.insert(component.hostView);
    component.instance.component = componentType;
    component.instance.componentResolver = config.resolver ? config.resolver : this.componentResolverFactory;
    component.instance.injector = config.injector ? config.injector : this.injector;
    component.instance.data = config.data;
    component.instance.config = Object.assign(component.instance.config, config);
    component.instance.create();

    const modalData = { viewRef };
    component.instance.closeEvent.subscribe(() => {
      viewRef.detach();
      viewRef.destroy();
      // this.viewContainerRef.remove();
      this.openModals.splice(this.openModals.indexOf(modalData), 1);
    });
    this.openModals.push(modalData);
    // this.cd.detectChanges();

    // console.log(this.viewContainerRef);

    return {
      modal: component.instance,
      component: component.instance.componentInstance,
    };
    // injectorTokens.set(MODULE_DATA, dataToPass);
    // const componentPortal = new ComponentPortal(component, null, this.injector, this.componentResolverFactory);
    // // } else {
    // //   this.componentPortal = new ComponentPortal(this.content.component, null,
    // //     this.createInjector(this.cont));
    // // }
    // const componentInstance = componentPortal.attach(this.portalOutlet);
  }
  clearAll() {
    this.openModals.forEach((modal) => {
      modal.viewRef.detach();
      modal.viewRef.destroy();
    });
  }
  // setPortalOutlet(portalOutlet: CdkPortalOutlet) {
  //   this.portalOutlet = portalOutlet;
  // }
  setInjector(injector: any) {
    this.injector = injector;
  }
  setComponentResolverFactory(componentResolverFactory) {
    this.componentResolverFactory = componentResolverFactory;
  }
  setViewContainer(viewContainer: ViewContainerRef) {
    this.viewContainerRef = viewContainer;
  }
}
