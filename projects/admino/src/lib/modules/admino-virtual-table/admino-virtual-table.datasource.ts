import { cloneDeep } from 'lodash';
import { DataSource } from '@angular/cdk/table';
import { Observable, Subject, BehaviorSubject, of, Subscription } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
export interface AdminoVirtualTableDataSourceConfig {
    listFunction: (keys, cursor, shift, count, index, before, after) => Observable<any>;
}
export interface VirtualDataSourceInfoColumn {
    id: string;
    format: string;
    align: string;
    length: number;
    description: string;
}
// export interface VirtualDataSourceInfo {
//     view: VirtualDataSourceInfoField[];
//     indexes: { keys: string[], description: string }[];
// }
export interface VirtualDataSourceColumn {
    label: string;
    id: string;
    format: string;
    align: string;
    length: number;

    sortable?: boolean;
    sticky?: boolean;
}
export interface VirtualDataSourceState {
    keys: any;
    cursor: number;
    count: number;
    index: number;
    before: number;
    after: number;
    cursorPosPercent: number;
    totalsize: number;
    cursorpos: number;
    shift: number;

}

export class AdminoVirtualTableDataSource {
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

    state: VirtualDataSourceState = {
        keys: { '#position': 'first' },
        cursor: 0,
        count: 10,
        index: 1,
        before: 10,
        after: 10,
        cursorPosPercent: 0,
        totalsize: 0,
        cursorpos: 0,
        shift: 0
    };


    constructor(public config: AdminoVirtualTableDataSourceConfig) {
    }
    connect(): Observable<any[]> {
        return this.resultSubject.asObservable();
    }

    disconnect(): void {
        this.resultSubject.complete();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    loadData(shift: number = 0) {

        // const calculatedShift = this.calculateShift(shift);
        const calculatedShift = shift;

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
            this.state.before = this.state.count;
            this.state.after = this.state.after;
            this.state.cursorPosPercent = this.state.cursor / (this.state.count - 1);
            this.loadDataStart.next(this.state);

            requestObj.subscription = this.config.listFunction(this.state.keys,
                this.state.cursorpos, calculatedShift, this.state.count, this.state.index, this.state.before, this.state.after).pipe(
                    takeUntil(this.ngUnsubscribe),
                    catchError(() => of([])),
                    // finalize(() => {
                    // })
                ).subscribe((data: any) => {
                    const index = this.currentRequests.indexOf(requestObj);
                    for (let i = 0; i <= index; i++) {
                        const req = this.currentRequests[0];
                        req.resolvePromise();
                        req.subscription.unsubscribe();
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

    setKeys(row) {
        this.state.keys = cloneDeep(row);
        delete this.state.keys.__index__;
        delete this.state.keys.__loaded__;
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
        this.state.keys = data.cursor;

        this.rows = [];

        if (this.currentRequests.length === 0) {
            this.cursorAbsPos = this.viewpos + cursorpos;
        }

        for (let i = 0; i < this.data.before.length; i++) {
            const d = this.data.before[i];
            d.__index__ = this.viewpos - this.data.before.length + i;
            d.__loaded__ = true;
            this.rows[d.__index__] = d;
        }

        for (let i = 0; i < this.data.data.length; i++) {
            const d = this.data.data[i];
            d.__index__ = this.viewpos + i;
            d.__loaded__ = true;
            this.rows[this.viewpos + i] = d;
        }

        for (let i = 0; i < this.data.after.length; i++) {
            const d = this.data.after[i];
            d.__index__ = this.viewpos + this.data.data.length + i;
            d.__loaded__ = true;
            this.rows[d.__index__] = d;
        }

        // this.cursorAbsPos = this.viewpos + parseInt(data.cursorpos, 10);
        this.state.cursorpos = parseInt(data.cursorpos, 10);
        this.resultSubject.next(this.rows);
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
