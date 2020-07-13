import { style } from '@angular/animations';
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
    | 'date' | 'button' | 'divider' | 'textarea' | 'tableselect' | 'image' | 'text' | 'group' | 'table' | 'timer' | 'chart' | 'map' | 'dashboard'
    | 'chartjs';
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
    actions?: AdminoAction[];


    disabled?: boolean;
    hidden?: boolean;
    align?: string;
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
    borderStyle?: string;
    padding?: string;

    innerStyle?: any;
    style?: any;
    containerStyle?: any;

    isLoading?: boolean;

    tabIndex?: number;

    col?: any;
    row?: any;
    colSpan?: any;
    rowSpan?: any;
    // grid_auto_rows?: any;

    __hover?: boolean;
    __dragging?: boolean;

    // width?: string;
    // height?: string;
    colorPaths?: string[];
}

export interface ScreenElementScreen extends ScreenElement {
    label?: string;
    elements?: ScreenElement[];
    popups?: ScreenPopup[];

    showBorder?: boolean;
    inline?: boolean;
    allowEdit?: boolean;
    editMode?: boolean;

    allowTabOut?: boolean;

    isFluidContainer?: boolean;
    colNum?: number;
    // popup settings
    isPopup?: boolean;
    verticalPosition?: string;
    horizontalPosition?: string;
    nopadding?: boolean;
    allowClose?: boolean;
    gridTemplateRows?: any;
    popup?: any;
}

export interface ScreenElementTimer extends ScreenElement {
    action: AdminoAction;
    frequency: number;
    _forceRefresh: number;
}
export interface ScreenElementInput extends ScreenElement {
    label?: string;
    prefix: string;
    suffix: string;
    placeholder: string;
    readonly: boolean;
    inputType: string;
    maxLength: boolean;
    appearance: string; // legacy, standard, fill

}
export interface ScreenElementSelect extends ScreenElement {
    label?: string;
    options: { label: string, value: string };
    disableOptionCentering: boolean;
    multiple: boolean;
}
export interface ScreenElementSlider extends ScreenElement {
    label?: string;
    options: { label: string, value: string };
    disableOptionCentering: boolean;
    multiple: boolean;
}
export interface ScreenElementTextarea extends ScreenElement {
    label?: string;
    maxLength: boolean;
    readonly: boolean;
    rows: number;
}
export interface ScreenElementText extends ScreenElement {
    align: string;
    size: number;
    color: string;
    weight: string;
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
    src?: string;
    // width: number;
    // height: number;
}
export interface ScreenElementTable extends ScreenElement {
    label?: string;
    viewName?: string;
    columns?: any[];
    indexes?: any[];
    refreshFrequency?: number;

    hideHeader?: boolean;

    tableButtons?: AdminoButton[];
    rowButtons?: AdminoButton[];

    tableHeight?: number;
    tableRowHeight?: number;
    hideSideBorder?: boolean;
    hideBottomBorder?: boolean;
    keyChangeAction?: AdminoAction;

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




