import { AdminoAction, AdminoButton } from '../../interfaces';

export interface ScreenElementChange {
    new: any;
    old: any;
}

export interface ScreenElement {
    type: 'input' | 'checkbox' | 'radiobutton' | 'select' | 'multi'
    | 'date' | 'button' | 'divider' | 'textarea' | 'tableselect' | 'image' | 'text' | 'group' | 'table' | 'timer';
    id: string;
    updateOn?: 'change' | 'blur' | 'submit';
    // use only in elementUpdate
    value?: any;
    destroy?: boolean;
    // create element at specific index
    createAt?: number;

    classes?: string[];
    innerClasses?: string[];
    validators?: ScreenElementValidator[];
    conditions?: Condition[];
    actions?: ScreenAction[];

    breakBefore: boolean;
    fillHeight: boolean;
}

export interface ScreenElementScreen extends ScreenElement {
    label?: string;
    elements: ScreenElement[];
    isPopup?: boolean;
    showBorder?: boolean;
}

export interface ScreenElementTimer extends ScreenElement {
    action: AdminoAction;
    frequency: number;
    disabled: boolean;
    forceRefresh: number;
}
export interface ScreenElementInput extends ScreenElement {
    label?: string;
    prefix: string;
    suffix: string;
}
export interface ScreenElementButton extends ScreenElement {
    label?: string;
    action: AdminoAction;
}
export interface ScreenElementImage extends ScreenElement {
    label?: string;
    src?: string; // "http://localhost/valami.jpg";
    width: number;
    height: number;
}
export interface ScreenElementTable extends ScreenElement {
    label?: string;
    viewName?: string;
    columns?: any[];
    indexes?: any[];
    refreshFrequency?: number;
    forceRefresh?: boolean;
    tableButtons?: AdminoButton[];
    rowButtons?: AdminoButton[];
}



export interface TableValue {
    keys: any;
    // Visible cursor position in percent 0-1;
    cursorPosPercent: number;
}



export interface Condition {
    fieldName: string;
    hasValue?: any;
    hasAnyValue?: boolean;
    hasValues?: any[];
}
export interface ScreenAction {
    color: 'primary' | 'accent' | 'warn';
    icon: 'string';
    action: AdminoAction;
}
export interface ScreenElementValidator {
    name: string;
    validator: any;
    message: string;
    isAsync?: boolean;
};




