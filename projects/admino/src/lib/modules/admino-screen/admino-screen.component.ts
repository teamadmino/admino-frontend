import { AdminoGridComponent } from './../admino-grid/admino-grid/admino-grid.component';
import { cloneDeep } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { AdminoActionService } from './../../services/action.service';
import { AdminoApiService } from './../../services/api.service';
import { ScreenElementScreen, ScreenElement } from './admino-screen.interfaces';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy, HostBinding, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminoAction, ActionEvent } from '../../interfaces';
import { Subject, BehaviorSubject } from 'rxjs';
import { isObject } from '../../utils/isobject';

@Component({
  selector: 'admino-screen',
  templateUrl: './admino-screen.component.html',
  styleUrls: ['./admino-screen.component.scss']
})
export class AdminoScreenComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();
  _screenElement: ScreenElementScreen = {};
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

  pauseValueChange = false;

  public pauseEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public focusEvent: BehaviorSubject<string> = new BehaviorSubject('');


  @Input() isPopup = false;
  @Input() editMode = false;

  @ViewChild(AdminoGridComponent, { static: false }) adminoGrid: AdminoGridComponent;

  @HostListener('dblclick', ['$event'])
  dblclck(e: MouseEvent) {
    // if (this._screenElement.allowEdit) {
    this.editMode = !this.editMode;
    // }
  }

  constructor(public fb: FormBuilder, public api: AdminoApiService, public as: AdminoActionService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // setTimeout((params) => {
    //   this.config.sections[0].elements.push(
    //     { type: 'button', id: 'btn2', label: 'something' }
    //   );
    //   this.config.sections.pop();
    //   this.cd.detectChanges();
    // }, 1500);
    this.group.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.valueChange.next(value);
    });
  }

  onSubmit(event) {
  }

  update(element: ScreenElementScreen, replace: boolean = false) {
    // console.log(config);
    // deepMerge(this.config, config);
    if (replace) {
      this.focusEvent.next(null);
      this.screenElement = element;
    } else {
      this.screenElement = this.mergeConfig(this.screenElement, element);
    }
    // const values = this.extractValue(this.screenElement.elements);
    // this.updateValue(values);
    // const origValues = this.group.value;
    // const merged = deepMerge(origValues, values);
    // this.group.patchValue(merged);
    this.cd.detectChanges();
    this.adminoGrid.refresh();
    this.updateEvent.next();
  }
  focusElement(el) {
    this.focusEvent.next(el);
  }
  // extractValue(elements: any[], val = {}) {
  //   for (const element of elements) {
  //     if (element && element.elements) {
  //       val[element.id] = this.extractValue(element.elements);
  //     } else if (element.value) {
  //       val[element.id] = element.value;
  //     }
  //   }
  //   return val;
  // }

  // updateValue(values: any, group = this.group) {
  //   for (const key of Object.keys(values)) {
  //     const controlOrGroup = group.get(key);
  //     const value = values[key];
  //     if (controlOrGroup) {
  //       if ((controlOrGroup as any).controls) {
  //         // if FormGroup
  //         this.updateValue(value, controlOrGroup as FormGroup);
  //       } else {
  //         let mergedValue = controlOrGroup.value;
  //         if (isObject(value)) {
  //           mergedValue = Object.assign(mergedValue ? mergedValue : {}, value);
  //           mergedValue.__update__ = true;
  //         } else {
  //           mergedValue = value;
  //         }
  //         controlOrGroup.patchValue(mergedValue);
  //       }
  //     }
  //   }
  // }

  handleAction(actionEvent) {
    return this.as.handleAction(actionEvent);
  }

  mergeConfig(target, source) {
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) { Object.assign(target, { [key]: {} }); }
          this.mergeConfig(target[key], source[key]);
        } else if (Array.isArray(source[key])) {
          if (key.split('__')[1] === 'replace') {
            target[key.split('__')[0]] = source[key];
          } else if (!source[key][0].id) {
            target[key] = source[key];
          } else {
            target[key] = this.mergeArrays(target[key], source[key]);
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



  prepareClasses(element: ScreenElement, isRoot: boolean = false) {
    if (element.hidden || element.type === 'timer') {
      return 'd-none';
    }
    const arr = element.classes ? element.classes : isRoot ? [] : ['col-12'];
    if (element.fillHeight) {
      arr.push('fill-height-flex');
    }
    return arr;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
