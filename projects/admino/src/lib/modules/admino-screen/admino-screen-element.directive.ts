import { TextComponent } from './elements/text/text.component';
import { AdminoScreenElement } from './elements/admino-screen-element';

import { AdminoScreenComponent } from './admino-screen.component';
import {
  Directive, Input, ComponentFactoryResolver, ViewContainerRef,
  OnInit, OnDestroy, ComponentRef, DoCheck
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { cloneDeep, isEqual } from 'lodash';
import { ScreenElementValidator, ScreenElement } from './admino-screen.interfaces';

import { InputComponent } from './elements/input/input.component';
import { ButtonComponent } from './elements/button/button.component';
import { GroupComponent } from './elements/group/group.component';
import { TableComponent } from './elements/table/table.component';
import { TimerComponent } from './elements/timer/timer.component';
import { takeUntil, filter } from 'rxjs/operators';
import { deepCompare } from '../../utils/deepcompare';
import { PopupComponent } from './elements/popup/popup.component';


const componentMapper = {
  input: InputComponent,
  button: ButtonComponent,
  table: TableComponent,
  group: GroupComponent,
  timer: TimerComponent,
  text: TextComponent,
  popup: PopupComponent,

};

@Directive({
  selector: '[adminoScreenElement]'
})
export class AdminoScreenElementDirective implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @Input() element: ScreenElement;
  // @Input() fields: FieldConfig[];
  @Input() parentGroup: FormGroup;

  control: FormControl;
  group: FormGroup;
  valueChangeSub: Subscription;


  @Input() screenComponent: AdminoScreenComponent;
  @Input() rootScreenComponent: AdminoScreenComponent;

  @Input() keyAreaId: string;
  @Input() index: number;
  componentRef: ComponentRef<any>;
  elementComponent: AdminoScreenElement;

  activeElementConfig: any = {};



  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {
  }


  ngOnInit() {

    this.activeElementConfig = cloneDeep(this.element);

    this.screenComponent.updateEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.componentRef && this.element) {


        // Type change
        if (this.element.type !== this.activeElementConfig.type) {
          this.destroyComponent();
          this.createComponent();
        }

        // Value change
        const control = this.parentGroup.get(this.element.id);
        if (this.element.value && !isEqual(control.value, this.activeElementConfig.value)) {
          if (control) {
            control.setValue(this.element.value, { emitEvent: false });
          }
        }

        // console.log(this.element);
        const changes = deepCompare(this.activeElementConfig, this.element);
        if (Object.keys(changes).length > 0) {
          this.elementComponent.onChange(changes);
        }

        // Destroy
        if (this.element.destroy) {
          this.destroyComponent();
        }

        this.activeElementConfig = cloneDeep(this.element);
      }
    });
    if (!this.element.type) {
      console.warn('Couldnt update or create element with id ' + this.element.id +
        ': Element id does not exist or new element is missing type');
    } else {
      this.createComponent();
    }
  }

  createComponent() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.element.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.elementComponent = this.componentRef.instance as AdminoScreenElement;
    this.elementComponent.element = this.element;
    this.elementComponent.screenComponent = this.screenComponent;
    this.elementComponent.rootScreenComponent = this.rootScreenComponent;
    this.elementComponent.index = this.index;

    if (this.element.type === 'group') {
      this.createGroup();
      this.elementComponent.group = this.group;
      this.elementComponent.controlPath = this.getControlPath(this.group)

    } else {
      this.createControl();
      this.elementComponent.group = this.parentGroup;
      this.elementComponent.control = this.control;
      this.elementComponent.controlPath = this.getControlPath(this.control)
    }
    console.log(this.elementComponent.controlPath);


  }
  destroyComponent() {
    this.removeControl();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  handleValueChange(changes) {
    // TODO group elements filterValue is not correct
    // console.log(this.activeElementConfig.changeAction)
    // needs to solve group
    if (this.activeElementConfig.changeAction) {
      if (this.activeElementConfig.changeAction.filterValue === undefined) {
        const action = cloneDeep(this.activeElementConfig.changeAction);
        action.filterValue = { [this.element.id]: true }
        // console.log(action.filterValue)
        this.elementComponent.handleAction(action);
      } else {
        this.elementComponent.handleAction(this.activeElementConfig.changeAction);
      }
      // console.log(changes);
    }
  }

  createGroup() {
    const group = this.screenComponent.fb.group(
      {}, {
      validators: this.bindValidations(this.element.validators || []),
      asyncValidators: this.getAsyncValidations(this.element.validators || []),
      updateOn: this.element.updateOn
    }
    );
    this.group = group;
    this.addControlToParentGroup(group);
    this.valueChangeSub = this.group.valueChanges.pipe(filter(_ => !this.rootScreenComponent.pauseValueChange)).subscribe((changes) => {
      // TODO Group value changes handling
      // console.log(this.screenComponent.pauseValueChange);
      console.log('GROUP VALUE CHANGE');
      // console.log(changes);
      // this.handleValueChange(changes);
      // this.elementComponent.valueChanges.next(changes);
    });
  }

  createControl() {
    const control = this.screenComponent.fb.control(
      this.element.value, {
      validators: this.bindValidations(this.element.validators || []),
      asyncValidators: this.getAsyncValidations(this.element.validators || []),
      updateOn: this.element.updateOn
    });
    this.control = control;
    this.addControlToParentGroup(control);
    this.valueChangeSub = this.control.valueChanges.subscribe((changes) => {
      this.handleValueChange(changes);
      this.elementComponent.valueChanges.next(changes);
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
          validList.push(valid.validator);
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
    if (!c.parent) { return null; }
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }

  // getControlPath(c: AbstractControl, path: any = {}): string | null {
  //   path = this.getControlName(c) + path;
  //   if (c.parent && this.getControlName(c.parent)) {
  //     path = '.' + path;
  //     return this.getControlPath(c.parent, path);
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
    this.destroyComponent();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
