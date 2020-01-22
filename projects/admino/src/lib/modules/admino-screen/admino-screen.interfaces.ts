import { AdminoAction, AdminoButton } from '../../interfaces';

export interface ScreenElementChange {
    new: any;
    old: any;
}
export interface ScreenPopup {
    id: string;
    setScreen?: ScreenElementScreen;
    updateScreen?: ScreenElementScreen;
    destroy?: boolean;
    width?: string;
    height?: string;
    verticalPosition?: string;
    horizontalPosition?: string;
    nopadding?: boolean;
}

export interface ScreenElement {
    type?: 'input' | 'checkbox' | 'radiobutton' | 'select' | 'multi'
    | 'date' | 'button' | 'divider' | 'textarea' | 'tableselect' | 'image' | 'text' | 'group' | 'table' | 'timer' | 'chart' | 'map' | 'dashboard';
    id?: string;

    // updateOn?: 'change' | 'blur' | 'submit';

    changeAction?: AdminoAction;
    blurAction?: AdminoAction;

    // use only in elementUpdate
    value?: any;
    destroy?: boolean;
    // create element at specific index
    createAt?: number;

    classes?: string[];
    // col?: string[];
    innerClasses?: string[];
    validators?: ScreenElementValidator[];
    conditions?: Condition[];
    actions?: ScreenAction[];


    disabled?: boolean;
    hidden?: boolean;

    col?: any;
    row?: any;
    colSpan?: any;
    rowSpan?: any;
    grid_auto_rows?: any;
    stretch?: boolean;

    __hover?: boolean;
    __dragging?: boolean;

}

export interface ScreenElementScreen extends ScreenElement {
    label?: string;
    elements?: ScreenElement[];
    popups?: ScreenPopup[];

    showBorder?: boolean;
    allowEdit?: boolean;

    isFluidContainer?: boolean;

    colNum?: number;

    // popup settings
    is_popup?: boolean;
    width?: string;
    height?: string;
    verticalPosition?: string;
    horizontalPosition?: string;
    nopadding?: boolean;
}

export interface ScreenElementTimer extends ScreenElement {
    action: AdminoAction;
    frequency: number;
    disabled: boolean;
    _forceRefresh: number;
}
export interface ScreenElementInput extends ScreenElement {
    label?: string;
    prefix: string;
    suffix: string;
    readonly: boolean;
}
export interface ScreenElementRadiobutton extends ScreenElement {
    label?: string;
    inlineLabel?: boolean;
    options?: { value: any, label: any }[];
}
export interface ScreenElementCheckbox extends ScreenElement {
    label?: string;
}
export interface ScreenElementButton extends ScreenElement {
    label?: string;
    icon?: string;
    color?: string;
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
    tableButtons?: AdminoButton[];
    rowButtons?: AdminoButton[];

    tableHeight?: number;
    tableRowHeight?: number;
    hideSideBorder?: boolean;
    hideBottomBorder?: boolean;

    _forceRefresh?: boolean;
}



export interface TableValue {
    keys?: any;
    index?: any;
    cursorpos?: number;
    viewpos?: number;
    shift?: number;
    // Visible cursor position in percent 0-1;
    cursorPosPercent?: number;
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




