import { AdminoAction, ActionEvent } from './../../../interfaces';
import { AdminoApiService } from './../../../services/api.service';
import { AdminoScreenComponent } from '../admino-screen.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ScreenElement } from '../admino-screen.interfaces';
import { ViewChild, ElementRef } from '@angular/core';

export class AdminoScreenElement {
    @ViewChild('inputRef', { static: true }) focusRef: ElementRef;
    public element: ScreenElement;
    // public fields: FieldConfig[];
    public group: FormGroup;
    public control: FormControl;

    public screenComponent: AdminoScreenComponent;

    public index: number;


    handleAction(action: AdminoAction) {
        const actionEvent: ActionEvent = {
            action,
            form: this.screenComponent.form
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
        // if (this.form.useVirtualKeyboard) {
        //     this.hideKeyboard(el);
        // }
    }
    blurEvent(element: HTMLInputElement) {
        element.removeAttribute('readonly');
    }

    hideKeyboard(element: HTMLInputElement) {
        element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
        // const tagName = element.tagName.toLowerCase();
        // if (tagName === 'textarea') {
        //     element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
        // }
        // setTimeout(() => {
        //     element.blur();  // actually close the keyboard
        //     // Remove readonly attribute after keyboard is hidden.
        //     element.removeAttribute('readonly');
        //     element.removeAttribute('disabled');
        // this.form.lastFocusedInput.next(this);

        // }, 100);
    }

}
