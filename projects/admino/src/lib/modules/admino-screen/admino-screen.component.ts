import { AdminoApiService } from './../../services/api.service';
import { ScreenConfig } from './admino-screen.interfaces';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminoAction, ActionEvent } from '../../interfaces';

@Component({
  selector: 'admino-screen',
  templateUrl: './admino-screen.component.html',
  styleUrls: ['./admino-screen.component.scss']
})
export class AdminoScreenComponent implements OnInit {

  _config: ScreenConfig;

  @Input() public set config(config: ScreenConfig) {
    this._config = config;
    this.form = this.fb.group({});
  }

  public get config(): ScreenConfig {
    return this._config;
  }

  @Output() actionEvent: EventEmitter<ActionEvent> = new EventEmitter();

  form: FormGroup;

  constructor(public fb: FormBuilder, public api: AdminoApiService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // setTimeout((params) => {
    //   this.config.sections[0].elements.push(
    //     { type: 'button', id: 'btn2', label: 'something' }
    //   );
    //   this.config.sections.pop();
    //   this.cd.detectChanges();
    // }, 1500);
  }

  onSubmit(event) {
    console.log(this.form.value);
  }


  // createControls(group, fields) {
  //   fields.forEach(field => {
  //     if (field.type === 'button' || field.type === 'divider') {
  //       return;
  //     }
  //     this.addControl(group, field);
  //   });
  //   return group;
  // }

  // addControl(group, field: ScreenElement) {
  //   let control;
  //   if (field.type === 'multi') {
  //     // control = this.createArrayControl(group, field);
  //   } else {
  //     control = this.createControl(group, field);
  //   }
  //   group.addControl(field.id, control);
  // }

  // createControl(group, field: ScreenElement) {
  //   const control = this.fb.control(
  //     field.value, {
  //     validators: this.bindValidations(field.validators || []),
  //     asyncValidators: this.getAsyncValidations(field.validators || []),
  //     updateOn: field.updateOn
  //   }
  //   );
  //   return control;
  // }




  // bindValidations(validators: any) {
  //   if (validators.length > 0) {
  //     const validList = [];
  //     validators.forEach((valid: ScreenElementValidator) => {
  //       if (!valid.isAsync) {
  //         validList.push(valid.validator);
  //       }
  //     });
  //     return Validators.compose(validList);
  //   }
  //   return null;
  // }
  // getAsyncValidations(validations: any) {
  //   if (validations.length > 0) {
  //     const validList = [];
  //     validations.forEach((valid: ScreenElementValidator) => {
  //       if (valid.isAsync) {
  //         validList.push(valid.validator);
  //       }
  //     });
  //     return validList;
  //   }
  // }

  prepareClasses(element, i) {
    return element.classes ? element.classes : ['col-12'];
  }
}
