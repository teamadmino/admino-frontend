import { AdminoThemeService } from "./../../services/theme.service";
import { FormatService } from "./../../services/format.service";
import { AdminoGridComponent } from "./../admino-grid/admino-grid/admino-grid.component";
import { cloneDeep } from "lodash";
import { takeUntil } from "rxjs/operators";
import { AdminoActionService } from "./../../services/action.service";
import { AdminoApiService } from "./../../services/api.service";
import { ScreenElementScreen, ScreenElement } from "./admino-screen.interfaces";
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
  HostBinding,
  ViewChild,
  HostListener,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AdminoAction, ActionEvent } from "../../interfaces";
import { Subject, BehaviorSubject } from "rxjs";
import { isObject } from "../../utils/isobject";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";

@Component({
  selector: "admino-screen",
  templateUrl: "./admino-screen.component.html",
  styleUrls: ["./admino-screen.component.scss"],
})
export class AdminoScreenComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe: Subject<null> = new Subject();
  _screenElement: ScreenElementScreen = {};

  @ViewChildren("screenElementRef") screenElementRefs: QueryList<any>;

  @Input() public set screenElement(element: ScreenElementScreen) {
    this._screenElement = element;
  }
  public get screenElement(): ScreenElementScreen {
    return this._screenElement;
  }
  // @Output() actionEvent: EventEmitter<ActionEvent> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  public updateEvent: Subject<any> = new Subject();
  @Input() group: FormGroup = this.fb.group({});

  @Input() rootScreenComponent: AdminoScreenComponent = this;
  @Input() parentScreenComponent: AdminoScreenComponent = this;

  id = "";
  pauseValueChange = false;

  public pauseEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public focusEvent: BehaviorSubject<string> = new BehaviorSubject("");

  _blockingActionRunning = 0;
  @Input() public set blockingActionRunning(val: number) {
    this._blockingActionRunning = val;
    console.log("setBlocking", val);
    this.cd.detectChanges();
  }
  public get blockingActionRunning(): number {
    return this._blockingActionRunning;
  }

  @Input() isPopup = false;
  @Input() allOpenScreens: AdminoScreenComponent[] = [];
  @Input() mainScreenComponent: AdminoScreenComponent = this;
  @Input() editMode = false;

  popups = [];

  @ViewChild(AdminoGridComponent, { static: false })
  adminoGrid: AdminoGridComponent;

  @HostListener("dblclick", ["$event"])
  dblclck(e: MouseEvent) {
    if (this.screenElement.allowEdit) {
      this.editMode = !this.editMode;
      // if (this.screenElement.editMode) {
      //   this.screenElement.editMode = false;
      // } else {
      //   this.screenElement.editMode = true;
      // }
    }
  }

  // @HostBinding('style')
  // get myStyle(): SafeStyle {
  //   return this.sanitizer.bypassSecurityTrustStyle(this.getStyle());
  // }

  constructor(
    public fb: FormBuilder,
    public api: AdminoApiService,
    public as: AdminoActionService,
    private cd: ChangeDetectorRef,
    public ts: AdminoThemeService,
    private sanitizer: DomSanitizer,
    private overlay: Overlay
  ) {}

  ngOnInit() {
    this.group.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.valueChange.next(value);
    });
  }

  ngAfterViewInit() {
    this.id = this.parentScreenComponent !== this ? this.parentScreenComponent.id : "";
    if (this.screenElement.id) {
      this.id += "." + this.screenElement.id.toString();
    }
  }
  // getStyle() {
  //   if (this.screenElement && this.screenElement.style) {
  //     let s = '';
  //     for (const prop of Object.keys(this.screenElement.style)) {
  //       s += prop + ':' + this.screenElement.style[prop] + '; ';
  //     }
  //     console.log(s)
  //     return s;
  //   }
  //   return '';
  // }
  onSubmit(event) {}

  update(element: ScreenElementScreen, replace: boolean = false) {
    // console.log(config);
    // deepMerge(this.config, config);
    if (replace) {
      this.focusEvent.next(null);
      this.screenElement = this.mergeConfig({}, element);
    } else {
      this.screenElement = this.mergeConfig(this.screenElement, element);
      // console.log('mergeconfig', element, this.screenElement);
    }
    // this.editMode = this.screenElement.editMode;
    // const values = this.extractValue(this.screenElement.elements);
    // this.updateValue(values);
    // const origValues = this.group.value;
    // const merged = deepMerge(origValues, values);
    // this.group.patchValue(merged);

    // this.updatePopups();

    this.cd.detectChanges();
    this.adminoGrid.refresh();
    this.updateEvent.next();
  }
  focusElement(el) {
    this.focusEvent.next(el);
  }
  getElementsOfType(type: "main" | "popup" | "popup2" | "timer") {
    if (!this.screenElement || !this.screenElement.elements) {
      return [];
    }
    return (
      this.screenElement.elements.filter((el: any) => {
        if (type === "main") {
          return !el.isPopup && el.type !== "timer" && !el.popup;
        } else if (type === "popup") {
          return el.type === "group" && el.isPopup;
        } else if (type === "popup2") {
          return el.type === "group" && el.popup;
        } else if (type === "timer") {
          return el.type === "timer";
        }
      }) || []
    );
  }

  handleAction(actionEvent: ActionEvent) {
    actionEvent.openScreens = this.allOpenScreens;
    actionEvent.screenConfig = this.mainScreenComponent.screenElement;
    if (actionEvent.action && actionEvent.action.includeSchema) {
      console.log(actionEvent.action.includeScreenshot);
      console.log(this.screenElementRefs);
    }
    return this.as.handleAction(actionEvent);
  }

  mergeConfig(target, source) {
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (key === "value" || key.split("__")[1] === "replace") {
            target[key] = source[key];
          } else {
            if (!target[key]) {
              Object.assign(target, { [key]: {} });
            }
            target[key] = this.mergeConfig(target[key], source[key]);
          }
        } else if (Array.isArray(source[key])) {
          if (key.split("__")[1] === "replace") {
            target[key.split("__")[0]] = source[key];
          } else if ((source[key][0] && source[key][0].id !== undefined) || key === "elements") {
            target[key] = this.mergeArrays(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    } else {
      target = source;
    }
    return target;
  }

  mergeArrays(target: any[], source) {
    if (!target) {
      target = [];
    }
    for (const item of source) {
      if (item.id) {
        const foundTargetItem = target.find((titem) => {
          return titem.id === item.id;
        });
        if (foundTargetItem) {
          this.mergeConfig(foundTargetItem, item);
        } else {
          if (item.createAt !== undefined) {
            target.splice(item.createAt, 0, item);
          } else {
            target.push(item);
          }
        }
        if (item.destroy) {
          target.splice(target.indexOf(foundTargetItem), 1);
        }
      }
    }
    return target;
  }

  getPopupClasses(el) {
    const arr = [];
    if (el.verticalPosition) {
      arr.push("vertical-" + el.verticalPosition);
    }
    if (el.horizontalPosition) {
      arr.push("horizontal-" + el.horizontalPosition);
    }
    return arr;
  }
  closePopup(e: ScreenElementScreen) {
    if (e.allowClose) {
      this.screenElement.elements.splice(this.screenElement.elements.indexOf(e), 1);
      this.update(this.screenElement);
    }
  }
  isFluidContainer() {
    if (this.screenElement.isFluidContainer !== undefined) {
      return this.screenElement.isFluidContainer;
    } else {
      if (this.parentScreenComponent.screenElement.isFluidContainer !== undefined) {
        return this.parentScreenComponent.screenElement.isFluidContainer;
      }
      return false;
    }
  }
  trapFocus() {
    if (this.screenElement.allowTabOut !== undefined && this.screenElement.allowTabOut === false) {
      return true;
    }
    if (this.screenElement.allowTabOut) {
      return false;
    }

    if (this.isPopup) {
      return true;
    }
    if (this.rootScreenComponent !== this) {
      return false;
    }
  }

  updatePopups() {
    const popups = this.getElementsOfType("popup2");
    popups.forEach((popupDef: ScreenElementScreen) => {
      const existing = this.popups.find((popup) => {
        return popup.popupDef.id === popupDef.id;
      });
      if (existing) {
      } else {
        const popupRef = this.createPopupRef(popupDef.popup);
        this.popups.push({ popupDef, popupRef });
      }
    });
  }

  createPopupRef(popupOptions: any) {
    const positionStrategy = this.overlay.position();
    const connectedTo = null;
    // const connectedTo = this.getConnectedToElementRef(popupOptions);
    // if (connectedTo) {
    //   positionStrategy.flexibleConnectedTo(connectedTo);
    // } else {
    // }

    const overlayRef = this.overlay.create({
      width: "200px",
      height: "300px",
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(connectedTo)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
          },
          {
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
          },
        ])
        .withPush(popupOptions.enablePush),
      hasBackdrop: true,
    });
    overlayRef.backdropClick().subscribe((params) => {
      overlayRef.detach();
      overlayRef.dispose();
    });
    const userProfilePortal = new ComponentPortal(null);
    return overlayRef.attach(userProfilePortal);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
