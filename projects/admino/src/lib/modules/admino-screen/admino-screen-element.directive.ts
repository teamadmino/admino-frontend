import { TextComponent } from './elements/text/text.component';
import { AdminoScreenElement } from './elements/admino-screen-element';

import { AdminoScreenComponent } from './admino-screen.component';
import {
  Directive, Input, ComponentFactoryResolver, ViewContainerRef,
  OnInit, OnDestroy, ComponentRef, DoCheck
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ScreenElementValidator, ScreenElement } from './admino-screen.interfaces';

import { InputComponent } from './elements/input/input.component';
import { ButtonComponent } from './elements/button/button.component';
import { GroupComponent } from './elements/group/group.component';
import { TableComponent } from './elements/table/table.component';
import { TimerComponent } from './elements/timer/timer.component';


const componentMapper = {
  input: InputComponent,
  button: ButtonComponent,
  table: TableComponent,
  group: GroupComponent,
  timer: TimerComponent,
  text: TextComponent,

};

@Directive({
  selector: '[adminoScreenElement]'
})
export class AdminoScreenElementDirective implements OnInit, OnDestroy, DoCheck {
  private ngUnsubscribe: Subject<null> = new Subject();

  @Input() element: ScreenElement;
  // @Input() fields: FieldConfig[];
  @Input() parentGroup: FormGroup;
  control: FormControl;
  group: FormGroup;
  @Input() screenComponent: AdminoScreenComponent;
  @Input() keyAreaId: string;
  @Input() index: number;
  componentRef: ComponentRef<any>;
  elementComponent;

  activeElementConfig: any = {};



  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {

  }
  ngDoCheck() {
    if (this.componentRef && this.element) {
      // Type change
      if (this.element.type !== this.activeElementConfig.type) {
        this.destroyComponent();
        this.createComponent();
      }
      // Value change
      if (this.element.value !== this.activeElementConfig.value) {
        const control = this.parentGroup.get(this.element.id);
        if (control) {
          control.setValue(this.element.value);
        }
      }
      // // Destroy
      // if (this.element.destroy) {
      //     for (const element of _config.elements) {
      //       if (element.id === this.element.id) {
      //         _config.elements.splice(_config.elements.indexOf(element), 1);
      //       }
      //     }

      // }

      this.activeElementConfig = cloneDeep(this.element);
    }
  }


  ngOnInit() {
    this.createComponent();

    // if (this.index === 0) {
    //   screenElement.focus();
    // }

    // if (!this.element.config) {
    //   this.element.config = {};
    // }
    // const control = this.group.get(this.field.name);
    // if (control) {
    //   const subscription = control.valueChanges.pipe(startWith(this.field.value), takeUntil(this.ngUnsubscribe)).subscribe(val => {

    //     // console.log(val)

    //     this.field.value = val;
    //     if (this.field.conditionController) {
    //       this.removeAllConditionalFields();
    //       this.addMatchingConditionalFields(val);
    //       // console.log(this.fields);
    //     }
    //   });
    // }

    if (this.element.type === 'group') {

      this.createGroup();
      this.elementComponent.group = this.group;

    } else {
      this.createControl();
      this.elementComponent.control = this.control;
    }

  }


  createComponent() {
    this.activeElementConfig = cloneDeep(this.element);
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.element.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.elementComponent = this.componentRef.instance as AdminoScreenElement;
    this.elementComponent.element = this.element;
    this.elementComponent.group = this.parentGroup;
    this.elementComponent.screenComponent = this.screenComponent;
    this.elementComponent.index = this.index;
  }
  destroyComponent() {
    this.componentRef.destroy();
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
    this.parentGroup.addControl(this.element.id, group);
  }

  createControl() {
    const control = this.screenComponent.fb.control(
      this.element.value, {
      validators: this.bindValidations(this.element.validators || []),
      asyncValidators: this.getAsyncValidations(this.element.validators || []),
      updateOn: this.element.updateOn
    }
    );
    this.control = control;

    this.parentGroup.addControl(this.element.id, control);
  }
  removeControl() {
    this.parentGroup.removeControl(this.element.id);
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

  removeAllConditionalFields() {

    // this.field._conditionalfields.forEach((cfield) => {
    //   this.form.removeControl(this.group, cfield.name);
    //   const index = this.fields.indexOf(cfield);
    //   if (index > -1) {
    //     this.fields.splice(index, 1);
    //   }
    // });

  }

  addMatchingConditionalFields(val) {
    // if (!this.field._conditionalfields) { return };

    // for (let i = 0; i < this.field._conditionalfields.length; i++) {
    //   const cfield = this.field._conditionalfields[i];
    //   const allConditionsMet = this.form.checkIfAllConditionsMatch(cfield, this.fields);
    //   if (allConditionsMet) {
    //     this.form.addControl(this.group, cfield);
    //     this.fields.push(cfield);
    //   }

    // }
    // this.form.sortFields(this.fields);
  }

  ngOnDestroy() {
    this.removeControl();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
