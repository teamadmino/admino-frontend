import { cloneDeep, isEqual } from 'lodash';
import { Observable, Subject, BehaviorSubject, of, Subscription } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { AdminoTableBuffer } from './admino-table.buffer';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { isString } from 'util';
export interface AdminoTableDataSourceConfig {
    listFunction: (keys, cursor, shift, count, index, before, after) => Observable<any>;
}
export interface VirtualDataSourceInfoColumn {
    id: string;
    source: string;
    format: string;
    align: string;
    style: any;
    containerStyle: any,

    headerStyle: any;
    headerContainerStyle: any;

    extraCellDefinitions: any;

    length: number;
    description: string;
}
// export interface VirtualDataSourceInfo {
//     view: VirtualDataSourceInfoField[];
//     indexes: { keys: string[], description: string }[];
// }
export interface VirtualDataSourceColumn {
    label: SafeHtml;
    id: string;
    format: string;
    align: string;
    length: number;
    style: any;
    headerStyle: any;

    sortable?: boolean;
    sticky?: boolean;
}
export interface DataSourceState {
    keys: any;
    cursor: number;
    count: number;
    index: number;
    before: number;
    after: number;
    cursorPosPercent: number;
    totalsize: number;
    cursorpos: number;
    selectedColumnIndex: number;
    selectedHeaderColumnIndex: number;
}

export class AdminoTableDataSource {
    private ngUnsubscribe: Subject<null> = new Subject();

    public resultSubject = new BehaviorSubject<any[]>(null);
    public result$ = this.resultSubject.asObservable();

    public loadDataStart = new Subject<any>();

    currentRequests: { subscription: Subscription, shift: number, resolvePromise: () => void, rejectPromise: () => void }[] = [];

    columns: VirtualDataSourceColumn[] = [];
    displayedColumns = [];
    keyIds = [];

    indexes = [];

    // keys: any;
    // cursor = 0;
    // index = 1;
    // count = 10;
    // cursorPos = 0;
    cursorAbsPos = 0;

    data: any = {};
    viewpos = 0;
    rows: any = {};
    totalsize = 1;
    predefinedStyles = [];

    // keyAbsolutePosition;

    state: DataSourceState = {
        keys: { '#position': 'first' },
        cursor: 0,
        count: 1,
        index: 1,
        before: 10,
        after: 10,
        cursorPosPercent: 0,
        totalsize: 0,
        cursorpos: 0,
        selectedColumnIndex: 0,
        selectedHeaderColumnIndex: 0
    };

    buffer = new AdminoTableBuffer();


    refreshTimeout;
    autoRefresh = 0;
    counter = 0;
    keyChangedByFrontend = false;
    constructor(public config: AdminoTableDataSourceConfig, public sanitizer: DomSanitizer) {
    }
    connect(): Observable<any[]> {
        return this.resultSubject.asObservable();
    }

    disconnect(): void {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        this.resultSubject.complete();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    setAutoRefresh() {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        if (this.autoRefresh) {
            this.refreshTimeout = setTimeout(() => {
                this.loadData();
                if (this.autoRefresh) {
                    this.setAutoRefresh();
                }
            }, this.autoRefresh);
        }
    }

    loadData(shift: number = 0) {
        // const calculatedShift = this.calculateShift(shift);
        const calculatedShift = shift;
        const num = this.counter;
        this.counter++;
        return new Promise((resolve, reject) => {

            const requestObj = { subscription: null, shift, resolvePromise: resolve, rejectPromise: reject };
            // const state = {
            //     keys: this.state.keys,
            //     cursor: this.state.cursor,
            //     count: this.state.count,
            //     index: this.state.index,
            //     before: this.state.count,
            //     after: this.count,
            //     cursorPosPercent: this.cursor / (this.count - 1),
            // };
            // this.state.before = this.state.before;
            // this.state.after = this.state.after;
            this.state.cursorPosPercent = this.state.cursor / (this.state.count - 1);
            this.loadDataStart.next(this.state);

            const cursorpos = isNaN(this.state.cursorpos) ? 0 : this.state.cursorpos;

            requestObj.subscription = this.config.listFunction(this.state.keys, cursorpos
                , calculatedShift,
                Math.max(this.state.count, 1), this.state.index, this.state.before, this.state.after).pipe(
                    takeUntil(this.ngUnsubscribe),
                    catchError(() => of([])),
                    // finalize(() => {
                    // })
                ).subscribe((data: any) => {
                    const index = this.currentRequests.indexOf(requestObj);
                    // console.log("INDEX", index);
                    for (let i = 0; i <= index; i++) {
                        const req = this.currentRequests[0];
                        // if (req !== requestObj) {
                        //     req.rejectPromise();
                        // }
                        // console.log(req.rejectPromise)
                        // req.resolvePromise();
                        req.subscription.unsubscribe();
                        req.subscription = null;
                        this.currentRequests.shift();
                    }
                    this.updateData(data);
                    resolve(data);
                }, (err) => {
                    reject();
                });
            this.currentRequests.push(requestObj);
        });
    }

    calculateShift(shift) {
        let calculatedShift = shift;
        for (const req of this.currentRequests) {
            calculatedShift += req.shift;
        }
        return calculatedShift;
    }

    setKeys(rowData) {
        if (rowData) {
            this.state.keys = cloneDeep(rowData);
            if (this.currentRequests.length !== 0) {
                this.clearRequests();
                this.loadData();
            }
        }
        // if (this.currentRequests.length !== 0) {
        // }
    }
    clearRequests() {
        const len = this.currentRequests.length;
        for (let i = 0; i < len; i++) {
            const req = this.currentRequests[0];
            req.subscription.unsubscribe();
            req.subscription = null;
            this.currentRequests.shift();
        }
    }
    updateData(data) {
        if (!data || !data.data) {
            return;
        }

        const totalsize = parseInt(data.totalsize, 10);
        const viewpos = parseInt(data.viewpos, 10);
        const cursorpos = parseInt(data.cursorpos, 10);


        this.data = data;
        this.totalsize = totalsize;
        this.state.totalsize = this.totalsize;
        this.viewpos = viewpos - 1;
        this.predefinedStyles = data.predefinedStyles;

        this.rows = [];
        // this.currentRequests.length === 0 &&


        for (let i = 0; i < this.data.before.length; i++) {
            const d = this.data.before[i];
            const index = this.viewpos - this.data.before.length + i;
            this.rows[index] = d;
            this.setData(index, d);
        }

        for (let i = 0; i < this.data.data.length; i++) {
            const d = this.data.data[i];
            const index = this.viewpos + i;
            this.rows[this.viewpos + i] = d;
            this.setData(index, d);
        }

        for (let i = 0; i < this.data.after.length; i++) {
            const d = this.data.after[i];
            const index = this.viewpos + this.data.data.length + i;
            this.rows[index] = d;
            this.setData(index, d);
        }

        // if (this.currentRequests.length === 0) {
        //     this.keyChangedByFrontend = false;
        // }
        // console.log(this.buffer.container);
        // this.cursorAbsPos = this.viewpos + parseInt(data.cursorpos, 10);
        // if (!keyChangedByFrontend && !this.keyChangedByFrontend || isEqual(data.cursor, this.state.keys)) {
        this.state.keys = data.cursor;
        this.cursorAbsPos = this.viewpos + cursorpos;
        this.state.cursorpos = parseInt(data.cursorpos, 10);
        // }

        this.resultSubject.next(this.rows);
    }

    setData(index, d) {
        const currentBuffer = this.buffer.get(index);
        if (currentBuffer && currentBuffer.data) {
            this.buffer.set(index, this.processData(d, currentBuffer.data));
        } else {
            this.buffer.set(index, this.processData(d, null));
        }
    }

    processData(newData, bufferData: any) {
        if (!bufferData) {
            bufferData = {};
            bufferData.origData = {};
            bufferData.dataVersion = 0;
            bufferData.processedData = cloneDeep(newData);
        }
        for (const key of Object.keys(newData)) {
            if (key.startsWith('$') && isString(newData[key])) {
                if (newData[key] !== bufferData.origData[key]) {
                    bufferData.processedData[key] = this.sanitizer.bypassSecurityTrustHtml(newData[key]);
                }
            } else {
                bufferData.processedData[key] = newData[key];
            }
        }
        bufferData.origData = cloneDeep(newData);
        return bufferData;
    }

    // applyFormat(data) {
    //     for (const colId of Object.keys(data)) {
    //         const col = this.columns.find((_col) => {
    //             return _col.id === colId;
    //         });
    //         if (col && col.format !== undefined) {
    //             data[colId] = this.config.formatFunction(data[colId], col.format);
    //         }
    //     }
    //     return data;
    // }
    findRowByKeys(data): number {
        if (!this.state.keys) {
            return 0;
        }
        let cursorPosition = 0;
        for (let i = data.length - 1; i >= 0; i--) {
            const row = data[i];
            cursorPosition = i;
            let match = true;
            Object.keys(this.state.keys).forEach(key => {
                if (row[key] !== this.state.keys[key]) {
                    match = false;
                }
            });
            if (match) {
                // console.log("BREAK AT " + cursorPosition)
                break;
            }
        }
        return cursorPosition;
    }
}
