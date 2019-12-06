import { AdminoAction, AdminoButton } from '../../interfaces';

export interface ScreenConfig {
    label?: string;
    sections: ScreenSection[];
    isPopup?: boolean;
}
export interface ScreenSection {
    elements: ScreenElement[];
    label?: string;
    collapsible?: boolean;
    classes?: string[];
    conditions?: Condition[];
}

export interface ScreenElement {
    type: 'input' | 'checkbox' | 'radiobutton' | 'select' | 'multi'
    | 'date' | 'button' | 'divider' | 'textarea' | 'tableselect' | 'text' | 'table' | 'timer';
    id: string;
    label?: string;
    defaultValue?: any;
    updateOn?: 'change' | 'blur' | 'submit';

    // use only in elementUpdate
    value?: any;
    destroy?: boolean;
    // create element at specific index
    createAt?: { sectionIndex: number, elementIndex: number };

    config?: any | InputConfig | CheckboxConfig | RadiobuttonConfig | SelectConfig | MultiConfig | TimerConfig;
    validators?: ScreenElementValidator[];
    classes?: string[];
    conditions?: Condition[];
    actions?: ScreenAction[];
}
export interface TimerConfig {
    action: AdminoAction;
    frequency: number;
    disabled: boolean;
    forceRefresh: number;
}
export interface InputConfig {
    prefix: string;
    suffix: string;
}
export interface ButtonConfig {
    action: AdminoAction;
}
export interface TableConfig {
    viewName: string;
    tableButtons: AdminoButton[];
    rowButtons: AdminoButton[];
}

export interface CheckboxConfig { }
export interface RadiobuttonConfig { }
export interface SelectConfig { }
export interface MultiConfig { }



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




