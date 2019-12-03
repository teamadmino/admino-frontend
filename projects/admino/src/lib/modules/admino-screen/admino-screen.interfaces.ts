import { AdminoAction } from '../../interfaces';

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
    | 'date' | 'button' | 'divider' | 'textarea' | 'tableselect' | 'text' | 'table';
    id: string;
    label?: string;
    defaultValue?: any;
    updateOn?: 'change' | 'blur' | 'submit';

    // use only in elementUpdate
    value?: any;
    destroy?: boolean;
    // create element at specific index
    createAt?: { sectionIndex: number, elementIndex: number };


    config?: any | InputConfig | CheckboxConfig | RadiobuttonConfig | SelectConfig | MultiConfig;
    validators?: ScreenElementValidator[];
    classes?: string[];
    conditions?: Condition[];
    actions?: ScreenAction[];
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
}
export interface ScreenElementValidator {
    name: string;
    validator: any;
    message: string;
    isAsync?: boolean;
};




