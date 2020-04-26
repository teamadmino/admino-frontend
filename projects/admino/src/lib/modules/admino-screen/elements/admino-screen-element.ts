import { ScreenElementChange } from './../admino-screen.interfaces';
import { AdminoAction, ActionEvent, ActionSubscription } from './../../../interfaces';
import { AdminoScreenComponent } from '../admino-screen.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ScreenElement } from '../admino-screen.interfaces';
import { ViewChild, ElementRef, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminoScreenElementDirective } from '../admino-screen-element.directive';
import { isArray } from 'util';
import { isEqual } from 'lodash';

export class AdminoScreenElement {
    // @ViewChild('focusRef', { static: true }) focusRef: any;
    @ViewChild('focusRef', { static: true, read: ElementRef }) focusElRef: ElementRef;
    public element: ScreenElement | any;
    // public fields: FieldConfig[];
    public parentGroup: FormGroup;
    public control: FormControl;
    public group: FormGroup;

    public screenComponent: AdminoScreenComponent;
    public rootScreenComponent: AdminoScreenComponent;

    public index: number;
    public controlPath: any;
    // public configChange: Subject<any> = new Subject();
    // public updateEvent: Subject<any> = new Subject();
    // public valueChanges: Subject<any> = new Subject();

    public activeActionSubscriptions: ActionSubscription[] = [];

    isFocused = false;
    boundFocusFunction;
    boundBlurFunction;
    public ngUnsubscribe: Subject<null> = new Subject();
    public directive: AdminoScreenElementDirective;
    @HostBinding('style.height') height = '';

    supportedKeyTriggers = ['keydown', 'keyup'];

    keyTriggers: { trigger: string, boundFunc: any }[] = [];

    shortcutTriggers: { trigger: string, boundFunc: any }[] = [];
    currentShortcutKeys = [];
    init() {
        console.log("init", this.element)
        if (this.focusElRef) {

            this.boundFocusFunction = this.focusEvent.bind(this);
            this.focusElRef.nativeElement.addEventListener('focus', this.boundFocusFunction, true);

            this.boundBlurFunction = this.blurEvent.bind(this);
            this.focusElRef.nativeElement.addEventListener('blur', this.boundBlurFunction, true);
        }
        this.change(null);
    }

    createKeyTiggers() {

        console.log("createtriggers", this.element)
        this.clearKeyTriggers();
        this.supportedKeyTriggers.forEach((trigger) => {
            const filteredActions: AdminoAction[] = this.filterActions(this.element.actions, { trigger });
            if (filteredActions.length > 0) {
                const keyTrigger = {
                    trigger,
                    boundFunc: (e) => {
                        filteredActions.forEach((action: AdminoAction) => {
                            if (action.key === 'any') {
                                this.handleAction(action, e.key);
                                if (action.overrideDefault) {
                                    e.preventDefault();
                                }
                            } else if (e.key !== undefined && action.key.toLowerCase() === e.key.toLowerCase()) {
                                this.handleAction(action);
                                if (action.overrideDefault) {
                                    e.preventDefault();
                                }
                            }
                        });
                    }
                };
                this.keyTriggers.push(keyTrigger);
                document.addEventListener(trigger, keyTrigger.boundFunc);
            }
        });
    }
    clearKeyTriggers() {
        this.keyTriggers.forEach((keyTrigger: { trigger: string, boundFunc: any }) => {
            document.removeEventListener(keyTrigger.trigger, keyTrigger.boundFunc);
        });
    }

    createShortcutTriggers() {

        const filteredActions: AdminoAction[] = this.filterActions(this.element.actions, { trigger: 'shortcut' });
        if (filteredActions.length > 0) {
            const shortcutKeydownTrigger = {
                trigger: 'keydown',
                boundFunc: (e) => {
                    if (e.key === undefined) {
                        return;
                    }
                    const key = e.key.toLowerCase();
                    if (this.currentShortcutKeys.indexOf(key) > -1) {
                        this.currentShortcutKeys.splice(this.currentShortcutKeys.indexOf(key), 1);
                    }
                    this.currentShortcutKeys.push(key);

                    filteredActions.forEach((action: AdminoAction) => {
                        const lowerCaseShortcut = action.shortcut.map((_key) => {
                            return _key.toLowerCase();
                        });
                        if (isEqual(lowerCaseShortcut, this.currentShortcutKeys)) {
                            this.handleAction(action, action.shortcut);
                            if (action.overrideDefault) {
                                e.preventDefault();
                            }
                        }
                    });
                }
            };
            const shortcutKeyupTrigger = {
                trigger: 'keyup',
                boundFunc: (e) => {
                    if (e.key === undefined) {
                        return;
                    }
                    const key = e.key.toLowerCase();
                    if (this.currentShortcutKeys.indexOf(key) > -1) {
                        this.currentShortcutKeys.splice(this.currentShortcutKeys.indexOf(key), 1);
                        // this.currentShortcutKeys.splice(0, this.currentShortcutKeys.indexOf(key) + 1);
                    }
                }
            };
            const shortcutClickTrigger = {
                trigger: 'click',
                boundFunc: (e) => {
                    const key = 'click';
                    if (this.currentShortcutKeys.indexOf(key) > -1) {
                        this.currentShortcutKeys.splice(this.currentShortcutKeys.indexOf(key), 1);
                    }
                    this.currentShortcutKeys.push(key);
                    filteredActions.forEach((action: AdminoAction) => {
                        if (isEqual(action.shortcut, this.currentShortcutKeys)) {
                            this.handleAction(action, action.shortcut);
                            if (action.overrideDefault) {
                                e.preventDefault();
                            }
                        }
                    });
                    this.currentShortcutKeys = [];
                }
            };
            this.shortcutTriggers.push(shortcutKeydownTrigger);
            this.shortcutTriggers.push(shortcutKeyupTrigger);
            this.shortcutTriggers.push(shortcutClickTrigger);
            document.addEventListener('keydown', shortcutKeydownTrigger.boundFunc);
            document.addEventListener('keyup', shortcutKeyupTrigger.boundFunc);
            document.addEventListener('click', shortcutClickTrigger.boundFunc);
        }

    }
    // handleKeyCombinations(action, e) {
    //     console.log("combi", e);
    //     this.handleAction(action);
    //     if (action.overrideDefault) {
    //         e.preventDefault();
    //     }
    // }
    clearShortcutTriggers() {
        this.shortcutTriggers.forEach((shortcutTrigger: { trigger: string, boundFunc: any }) => {
            document.removeEventListener(shortcutTrigger.trigger, shortcutTrigger.boundFunc);
        });
        this.currentShortcutKeys = [];
    }


    getOverrideList() {
        const filtered = this.filterActions(this.element.actions, { overrideDefault: true });
        const mapped = filtered.map((action) => {
            return { trigger: action.trigger, key: action.key }
        });
        return mapped;
    }
    filterActions(actions: AdminoAction[], filters: { trigger?: string, key?: string, overrideDefault?: boolean }) {
        if (actions) {
            const filtered = actions.filter((action: AdminoAction) => {
                let match = true;
                for (const key of Object.keys(filters)) {
                    if (filters[key] !== action[key]) {
                        match = false;
                    }
                }
                return match;
                // if (key !== null) {
                //     return action.trigger === trigger && action.key === key;
                // } else {
                //     return action.trigger === trigger;
                // }
            });
            return filtered;
        }
        return [];
    }
    getAction(trigger: string) {
        if (this.element.actions) {
            const found = this.element.actions.find((action) => {
                return action.trigger === trigger;
            });
            if (found) {
                return found;
            } else {
                return null;
            }
        }
        return null;
    }

    handleAction(action: AdminoAction, overrideKey: any = null) {
        return new Promise((resolve, reject) => {
            const actionSub: ActionSubscription = {};
            this.activeActionSubscriptions.push(actionSub);
            actionSub.actionEvent = {
                action,
                // form: this.screenComponent.group,
                // screenConfig: this.rootScreenComponent.screenElement,
                initiatedBy: this.controlPath,
                trigger: action.trigger,
                key: overrideKey ? overrideKey : action.key
            };
            if (action.isBlocking) {
                this.rootScreenComponent.blockingActionRunning = true;
            }
            actionSub.subscription = this.rootScreenComponent.handleAction(actionSub.actionEvent).subscribe((result) => {
                this.activeActionSubscriptions.slice(this.activeActionSubscriptions.indexOf(actionSub), 1);
                if (action.isBlocking) {
                    this.rootScreenComponent.blockingActionRunning = false;
                }
                resolve(result);
            }, (error) => {
                this.activeActionSubscriptions.slice(this.activeActionSubscriptions.indexOf(actionSub), 1);
                if (action.isBlocking) {
                    this.rootScreenComponent.blockingActionRunning = false;
                }
                reject(error);
            }, () => {
                if (action.isBlocking) {
                    this.rootScreenComponent.blockingActionRunning = false;
                }
            });
        });
    }

    clearSubscriptions() {
        for (const actionSub of this.activeActionSubscriptions) {
            if (actionSub.subscription) {
                if (actionSub.actionEvent.action.isBlocking) {
                    this.rootScreenComponent.blockingActionRunning = false;
                }
                actionSub.subscription.unsubscribe();
            }
        }
        this.activeActionSubscriptions = [];
    }


    focus() {
        if (this.focusElRef) {
            if (this.focusElRef.nativeElement) {
                this.focusElRef.nativeElement.focus();
            }
        }
        this.focusEvent();
    }

    blur() {
        if (this.focusElRef) {
            if (this.focusElRef.nativeElement) {
                this.focusElRef.nativeElement.blur();
            }
        }
        this.blurEvent();
    }

    focusEvent() {
        this.createKeyTiggers();
        this.createShortcutTriggers();
        this.isFocused = true;
        this.directive.cd.markForCheck();

    }
    blurEvent() {

        this.clearKeyTriggers();
        this.clearShortcutTriggers();
        this.isFocused = false;
        this.directive.cd.markForCheck();
    }
    setValue(value) {
        this.control.setValue(value);
    }
    onChange(changes: { [id: string]: ScreenElementChange; }) {
    }
    change(changes: { [id: string]: ScreenElementChange; }) {
        this.height = this.element.height;
        if (changes && changes.actions) {
            this.createKeyTiggers();
        }
    }

    onDestroy() {
    }
    destroy() {
        this.clearKeyTriggers();
        this.onDestroy();
        this.clearSubscriptions();
        if (this.focusElRef) {
            this.focusElRef.nativeElement.removeEventListener('focus', this.boundFocusFunction);
            this.focusElRef.nativeElement.removeEventListener('blur', this.boundBlurFunction);
        }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
