import { MapeditorComponent } from "./elements/mapeditor/mapeditor.component";
import { ConfigService } from "./../../services/config.service";
import { NewmapComponent } from "./elements/newmap/newmap.component";
import { TableselectComponent } from "./elements/tableselect/tableselect.component";
import { SuperTableComponent } from "./elements/super-table/super-table.component";
import { AdminoOldTableComponent } from "./../admino-old-table/admino-table/admino-table.component";
import { IframeComponent } from "./elements/iframe/iframe.component";
import { CodeComponent } from "./elements/code/code.component";
import { ToggleComponent } from "./elements/toggle/toggle.component";
import { SliderComponent } from "./elements/slider/slider.component";
import { ColorpickerComponent } from "./elements/colorpicker/colorpicker.component";
import { ChartjsComponent } from "./elements/chartjs/chartjs.component";
import { ScannerComponent } from "./elements/scanner/scanner.component";
import { DateComponent } from "./elements/date/date.component";
import { TextareaComponent } from "./elements/textarea/textarea.component";
import { NewTableComponent } from "./elements/new-table/new-table.component";
import { MapComponent } from "./elements/map/map.component";
import { AdminoThemeService } from "./../../services/theme.service";
import { ChartComponent } from "./elements/chart/chart.component";
import { RadiobuttonComponent } from "./elements/radiobutton/radiobutton.component";
import { CheckboxComponent } from "./elements/checkbox/checkbox.component";
import { TextComponent } from "./elements/text/text.component";
import { AdminoScreenElement } from "./elements/admino-screen-element";

import { AdminoScreenComponent } from "./admino-screen.component";
import {
  Directive,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  ComponentRef,
  DoCheck,
  ChangeDetectorRef,
  HostBinding,
  ElementRef,
} from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { cloneDeep, isEqual } from "lodash";
import { ScreenElementValidator, ScreenElement } from "./admino-screen.interfaces";

import { InputComponent } from "./elements/input/input.component";
import { ButtonComponent } from "./elements/button/button.component";
import { GroupComponent } from "./elements/group/group.component";
// import { TableComponent, TableComponent } from './elements/table/table.component';
import { TimerComponent } from "./elements/timer/timer.component";
import { takeUntil, filter, skip } from "rxjs/operators";
import { deepCompare } from "../../utils/deepcompare";
import { ThemeService } from "ng2-charts";
import { TabsComponent } from "./elements/tabs/tabs.component";
import { ImageComponent } from "./elements/image/image.component";
import { SelectComponent } from "./elements/select/select.component";
import { DomSanitizer } from "@angular/platform-browser";
import { IconButtonComponent } from "./elements/icon-button/icon-button.component";
import { Overlay } from "@angular/cdk/overlay";
import { DividerComponent } from "./elements/divider/divider.component";
import { TableComponent } from "./elements/table/table.component";
import { MenuComponent } from "./elements/menu/menu.component";
import { MatrixComponent } from "./elements/matrix/matrix.component";
import { HttpClient } from "@angular/common/http";

const componentMapper = {
  input: InputComponent,
  textarea: TextareaComponent,
  button: ButtonComponent,
  iconbutton: IconButtonComponent,
  table: TableComponent,
  group: GroupComponent,
  popup: GroupComponent,
  timer: TimerComponent,
  text: TextComponent,
  checkbox: CheckboxComponent,
  radiobutton: RadiobuttonComponent,
  chart: ChartComponent,
  map: MapComponent,
  newtable: SuperTableComponent,
  date: DateComponent,
  scanner: ScannerComponent,
  chartjs: ChartjsComponent,
  colorpicker: ColorpickerComponent,
  tabs: TabsComponent,
  image: ImageComponent,
  select: SelectComponent,
  slider: SliderComponent,
  toggle: ToggleComponent,
  code: CodeComponent,
  iframe: IframeComponent,
  tableselect: TableselectComponent,
  newmap: NewmapComponent,
  mapeditor: MapeditorComponent,
  divider: DividerComponent,
  menu: MenuComponent,
  matrix: MatrixComponent,
  // supertable: SuperTableComponent,
};

@Directive({
  selector: "[adminoScreenElement]",
  // providers: [ThemeService]
})
export class AdminoScreenElementDirective implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @Input() element: ScreenElement;
  // @Input() fields: FieldConfig[];
  @Input() parentGroup: FormGroup;

  control: FormControl;
  group: FormGroup;
  valueChangeSub: Subscription;
  themeChangeSub: Subscription;

  @Input() screenComponent: AdminoScreenComponent;
  @Input() rootScreenComponent: AdminoScreenComponent;

  @Input() keyAreaId: string;
  @Input() index: number;
  componentRef: ComponentRef<any>;
  elementComponent: AdminoScreenElement;

  activeElementConfig: any = {};

  valueChangeTimeout;
  valueChangeEvent: Subject<any> = new Subject();

  typeChange = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    public cd: ChangeDetectorRef,
    public ts: AdminoThemeService,
    public chartThemeService: ThemeService,
    public el: ElementRef,
    public sanitizer: DomSanitizer,
    public overlay: Overlay,
    public config: ConfigService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.activeElementConfig = this.ts.processColorPaths(cloneDeep(this.element), this.element.colorPaths);

    // this.ts.themeChanged((params) => {
    // })
    this.screenComponent.updateEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      // console.log("UPDATEEVENT", this.element.id)
      // if (this.element.id === 'uszips') {
      //   console.log("value", this.element);
      //   // console.log(this.activeElementConfig.value && cloneDeep(this.activeElementConfig.value));
      // }
      if (this.componentRef && this.element) {
        // Destroy
        if (this.element.destroy) {
          this.destroyComponent();
          return;
        }

        if (this.element.colorPaths) {
          this.ts.processColorPaths(this.element, this.element.colorPaths);
        }

        // Type change
        if (this.element.type !== undefined && this.element.type !== this.activeElementConfig.type) {
          this.destroyComponent();
          this.createComponent();
        }
        // Value change
        const control = this.parentGroup.get(this.element.id);
        if (this.element.value !== undefined && !isEqual(this.element.value, control.value)) {
          if (control) {
            control.setValue(this.element.value, { emitEvent: false });
          }
        }
        if (this.element.disabled !== undefined && !isEqual(this.element.disabled, this.activeElementConfig.disabled)) {
          if (control) {
            if (this.element.disabled) {
              control.disable();
            } else {
              control.enable();
            }
          }
        }

        const changes = cloneDeep(deepCompare(this.activeElementConfig, this.element, ["value"]));

        if (this.themeChangeSub) {
          this.themeChangeSub.unsubscribe();
        }
        this.themeChangeSub = this.ts.themeChanged.subscribe((params) => {
          if (this.element.colorPaths) {
            // this.activeElementConfig = cloneDeep(this.element);
            // this.ts.processColorPaths(this.activeElementConfig, this.element.colorPaths);
            // this.elementComponent.element = this.activeElementConfig;
            // console.log("THEMESU")
            // console.log(this.activeElementConfig)
            // this.cd.detectChanges();
          }
        });

        this.activeElementConfig = cloneDeep(this.element);

        // || this.element.value !== undefined
        if (Object.keys(changes).length > 0 || this.element.type === "group") {
          // if (this.element.id === 'uszips') {
          //   console.log("ONCHANGE")
          // }
          this.elementComponent.onChange(changes);
          this.elementComponent.change(changes);
        }
        this.removeEventsFromConfig(this.element);
        this.removeEventsFromConfig(this.activeElementConfig);
      }
    });

    if (!this.element.type) {
      console.warn(
        "Couldnt update or create element with id " + this.element.id + ": Element id does not exist or new element is missing type"
      );
    } else {
      this.createComponent();
    }

    this.rootScreenComponent.focusEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe((elpath) => {
      if (elpath && this.elementComponent) {
        if (isEqual(elpath, this.elementComponent.controlPath)) {
          this.focus();
        }
      }
    });
  }

  removeEventsFromConfig(config) {
    for (const key of Object.keys(config)) {
      // || key === 'value'
      if (key.startsWith("_") || key === "forceRefresh" || key === "value") {
        delete config[key];
      }
    }
  }

  createComponent() {
    const factory = this.resolver.resolveComponentFactory(componentMapper[this.element.type]);
    this.componentRef = this.container.createComponent(factory);
    this.elementComponent = this.componentRef.instance as AdminoScreenElement;
    this.elementComponent.element = this.element;
    this.elementComponent.screenComponent = this.screenComponent;
    this.elementComponent.rootScreenComponent = this.rootScreenComponent;
    this.elementComponent.index = this.index;
    this.elementComponent.directive = this;

    if (this.element.type === "group") {
      this.createGroup();
      this.elementComponent.group = this.group;
      this.elementComponent.controlPath = this.getControlPath(this.group);
      // this.elementComponent.controlPathString = this.getControlPathString(this.group);
    } else {
      this.createControl();
      this.elementComponent.group = this.parentGroup;
      this.elementComponent.control = this.control;
      this.elementComponent.controlPath = this.getControlPath(this.control);
      // this.elementComponent.controlPathString = this.getControlPathString(this.control);
    }
    this.elementComponent.init();
  }
  destroyComponent() {
    if (this.themeChangeSub) {
      this.themeChangeSub.unsubscribe();
    }
    this.removeControl();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (this.elementComponent) {
      this.elementComponent.destroy();
    }
  }

  handleValueChange(value) {
    // console.log('Handle value change ', this.activeElementConfig.id);
    // this.activeElementConfig.value = value;
    // TODO group elements filterValue is not correct
    // console.log(this.activeElementConfig.changeAction)
    // needs to solve group
    this.valueChangeTimeout = setTimeout(() => {
      this.valueChangeEvent.next(value);
      // this.element.value = cloneDeep(value);
      // this.activeElementConfig.value = cloneDeep(value);
      if (this.activeElementConfig.changeAction) {
        if (this.activeElementConfig.changeAction.filterValue === undefined) {
          const action = cloneDeep(this.activeElementConfig.changeAction);
          action.filterValue = { [this.element.id]: true };
          this.elementComponent.handleAction(action);
        } else {
          this.elementComponent.handleAction(this.activeElementConfig.changeAction);
        }
        // console.log(changes);
      }
    });
  }

  focus() {
    if (this.elementComponent) {
      this.elementComponent.focus();
    }
  }

  createGroup() {
    const group = this.screenComponent.fb.group(
      {},
      {
        validators: this.bindValidations(this.element.validators || []),
        asyncValidators: this.getAsyncValidations(this.element.validators || []),
        // updateOn: this.element.updateOn
      }
    );
    this.group = group;
    this.addControlToParentGroup(group);
    this.valueChangeSub = this.group.valueChanges.pipe(filter((_) => !this.rootScreenComponent.pauseValueChange)).subscribe((changes) => {
      // TODO Group value changes handling
      // console.log(this.screenComponent.pauseValueChange);
      // console.log('GROUP VALUE CHANGE');
      // console.log(changes);
      // this.handleValueChange(changes);
      // this.elementComponent.valueChanges.next(changes);
    });
  }

  createControl() {
    const control = this.screenComponent.fb.control(
      { value: this.element.value, disabled: this.element.disabled },
      {
        validators: this.bindValidations(this.element.validators || []),
        asyncValidators: this.getAsyncValidations(this.element.validators || []),
        // updateOn: this.element.updateOn
      }
    );
    this.control = control;
    this.addControlToParentGroup(control);
    this.valueChangeSub = this.control.valueChanges.subscribe((changes) => {
      this.handleValueChange(changes);
      // this.elementComponent.valueChanges.next(changes);
    });
  }

  addControlToParentGroup(control) {
    this.rootScreenComponent.pauseValueChange = true; // Workaround for not triggering valueChange Event on FormGroup when control is added
    this.parentGroup.addControl(this.element.id, control);
    this.rootScreenComponent.pauseValueChange = false;
  }

  removeControl() {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe();
    }
    this.rootScreenComponent.pauseValueChange = true;
    this.parentGroup.removeControl(this.element.id);
    this.rootScreenComponent.pauseValueChange = false;
  }

  bindValidations(validators: any) {
    if (validators.length > 0) {
      const validList = [];
      validators.forEach((valid: ScreenElementValidator) => {
        if (!valid.isAsync) {
          // console.log(func({ value: "good" }));
          const v = (control: AbstractControl) => {
            let result;
            try {
              const func = new Function("control", "element", valid.validator);
              result = func(control, this.element);
            } catch (error) {
              console.log(error);
              result = "Bad validator " + error;
            }
            return result ? { [valid.name]: result } : "";
          };
          validList.push(v);
        }
      });
      return Validators.compose(validList);
    }
    return null;
  }
  getAsyncValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach((valid: ScreenElementValidator) => {
        if (valid.isAsync) {
          validList.push(valid.validator);
        }
      });
      return validList;
    }
  }

  getControlName(c: AbstractControl): string | null {
    if (!c.parent) {
      return null;
    }
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find((name) => c === formGroup[name]) || null;
  }

  // getControlPathString(c: AbstractControl, path: any = ''): string | null {
  //   path = this.getControlName(c) + path;
  //   if (c.parent && this.getControlName(c.parent)) {
  //     path = '.' + path;
  //     return this.getControlPathString(c.parent, path);
  //   } else {
  //     return path;
  //   }
  // }

  getControlPath(c: AbstractControl, path: any = true): string | null {
    path = { [this.getControlName(c)]: path };
    if (c.parent && this.getControlName(c.parent)) {
      return this.getControlPath(c.parent, path);
    } else {
      return path;
    }
  }

  ngOnDestroy() {
    if (this.elementComponent) {
      this.elementComponent.clearSubscriptions();
    }
    if (this.valueChangeTimeout) {
      clearTimeout(this.valueChangeTimeout);
    }
    this.destroyComponent();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
