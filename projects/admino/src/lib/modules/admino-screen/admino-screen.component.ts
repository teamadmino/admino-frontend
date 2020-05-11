import { AdminoThemeService } from './../../services/theme.service';
import { FormatService } from './../../services/format.service';
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
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

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
  @Input() parentScreenComponent: AdminoScreenComponent = this;

  pauseValueChange = false;

  public pauseEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public focusEvent: BehaviorSubject<string> = new BehaviorSubject('');

  blockingActionRunning = false;


  @Input() isPopup = false;
  @Input() allOpenScreens: AdminoScreenComponent[] = [];
  @Input() mainScreenComponent: AdminoScreenComponent = this;
  @Input() editMode = false;

  @ViewChild(AdminoGridComponent, { static: false }) adminoGrid: AdminoGridComponent;

  @HostListener('dblclick', ['$event'])
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

  constructor(public fb: FormBuilder, public api: AdminoApiService,
    public as: AdminoActionService,
    private cd: ChangeDetectorRef, public ts: AdminoThemeService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.group.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.valueChange.next(value);
    });
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
  onSubmit(event) {
  }

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
    this.cd.detectChanges();
    this.adminoGrid.refresh();
    this.updateEvent.next();
  }
  focusElement(el) {
    this.focusEvent.next(el);
  }
  getElementsOfType(type: 'main' | 'popup' | 'timer') {
    if (!this.screenElement || !this.screenElement.elements) {
      return [];
    }
    return this.screenElement.elements.filter((el: any) => {

      if (type === 'main') {
        return !el.isPopup && el.type !== 'timer';
      } else if (type === 'popup') {
        return el.type === 'group' && el.isPopup;
      } else if (type === 'timer') {
        return el.type === 'timer';
      }

    }) || [];
  }


  handleAction(actionEvent: ActionEvent) {
    actionEvent.openScreens = this.allOpenScreens;
    actionEvent.screenConfig = this.mainScreenComponent.screenElement;
    return this.as.handleAction(actionEvent);
  }

  mergeConfig(target, source) {
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (key === 'value' || key.split('__')[1] === 'replace') {
            target[key] = source[key];
          } else {
            if (!target[key]) { Object.assign(target, { [key]: {} }); }
            target[key] = this.mergeConfig(target[key], source[key]);
          }
        } else if (Array.isArray(source[key])) {
          if (key.split('__')[1] === 'replace') {
            target[key.split('__')[0]] = source[key];
          } else if ((source[key][0] && source[key][0].id !== undefined) || key === 'elements') {
            // console.log("ARRAY MERGE", key);
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
      arr.push('vertical-' + el.verticalPosition);
    }
    if (el.horizontalPosition) {
      arr.push('horizontal-' + el.horizontalPosition);
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
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
