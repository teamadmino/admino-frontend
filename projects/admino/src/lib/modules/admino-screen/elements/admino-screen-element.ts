import { ScreenElementChange } from './../admino-screen.interfaces';
import { AdminoAction, ActionEvent } from './../../../interfaces';
import { AdminoScreenComponent } from '../admino-screen.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ScreenElement } from '../admino-screen.interfaces';
import { ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

export class AdminoScreenElement {
    @ViewChild('inputRef', { static: true }) focusRef: ElementRef;
    public element: ScreenElement | any;
    // public fields: FieldConfig[];
    public parentGroup: FormGroup;
    public control: FormControl;
    public group: FormGroup;

    public screenComponent: AdminoScreenComponent;

    public index: number;
    // public configChange: Subject<any> = new Subject();
    // public updateEvent: Subject<any> = new Subject();
    public valueChanges: Subject<any> = new Subject();


    handleAction(action: AdminoAction) {
        const actionEvent: ActionEvent = {
            action,
            form: this.screenComponent.group,
            screenConfig: this.screenComponent.screenElement
        };
        this.screenComponent.actionEvent.next(actionEvent);
    }

    focus() {
        if (this.focusRef) {
            this.focusRef.nativeElement.focus();
        }
    }
    blur() {
        if (this.focusRef) {
            this.focusRef.nativeElement.blur();
        }
    }
    focusEvent(el: HTMLInputElement) {
    }
    blurEvent(element: HTMLInputElement) {
    }
    setValue(value) {
        this.control.setValue(value);
    }
    onChange(changes: { [id: string]: ScreenElementChange; }) {
    }


}
