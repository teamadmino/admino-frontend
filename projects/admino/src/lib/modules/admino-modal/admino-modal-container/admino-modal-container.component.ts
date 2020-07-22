import { AdminoModalService } from "./../admino-modal.service";
import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
} from "@angular/core";

@Component({
  selector: "admino-modal-container",
  templateUrl: "./admino-modal-container.component.html",
  styleUrls: ["./admino-modal-container.component.scss"],
})
export class AdminoModalContainerComponent implements OnInit {
  @ViewChild("modalContainerRef", { static: true, read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;

  constructor(
    private ms: AdminoModalService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.ms.setViewContainer(this.viewContainerRef);
    this.ms.setComponentResolverFactory(this.resolver);
    this.ms.setInjector(this.injector);
  }
}
