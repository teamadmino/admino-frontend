import { DataSource } from '@angular/cdk/table';
import { Observable, Subject, BehaviorSubject, of, Subscription } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
export interface AdminoVirtualTableDataSourceConfig {
    listFunction: (keys, cursor, shift, count, index, before, after) => Observable<any>;
}
export interface VirtualDataSourceInfoField {
    id: string;
    format: string;
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
    sortable?: boolean;
    sticky?: boolean;
}

export class AdminoVirtualTableDataSource {
    private ngUnsubscribe: Subject<null> = new Subject();

    public resultSubject = new BehaviorSubject<any[]>(null);
    public result$ = this.resultSubject.asObservable();

    public loadDataEvent = new Subject<any>();

    currentRequests: { subscription: Subscription, shift: number, resolvePromise: () => void, rejectPromise: () => void }[] = [];

    columns: VirtualDataSourceColumn[] = [];
    displayedColumns = [];
    keyIds = [];

    indexes = [];
    index = 1;

    keys: any;
    count = 10;
    cursor = 0;
    cursorAbsPos = 0;
    cursorPos = 0;
    data: any = {};
    totalsize = 1;
    viewpos = 0;
    rows: any = {};

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

            const state = {
                keys: this.keys ? Object.assign({}, this.keys) : { '#position': 'first' },
                cursor: this.cursor,
                shift: calculatedShift,
                count: this.count,
                index: this.index,
                before: this.count,
                after: this.count,
                cursorPosPercent: this.cursor / (this.count - 1),
            };
            delete state.keys.__index__;
            delete state.keys.__loaded__;
            this.loadDataEvent.next(state);

            requestObj.subscription = this.config.listFunction(state.keys,
                state.cursor, state.shift, state.count, state.index, state.before, state.after).pipe(
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
        this.keys = row;
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
        this.viewpos = viewpos - 1;
        this.keys = data.cursor;

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
        this.cursorPos = parseInt(data.cursorpos, 10);
        this.resultSubject.next(this.rows);
    }

    findRowByKeys(data): number {
        if (!this.keys) {
            return 0;
        }
        let cursorPosition = 0;
        for (let i = data.length - 1; i >= 0; i--) {
            const row = data[i];
            cursorPosition = i;
            let match = true;
            Object.keys(this.keys).forEach(key => {
                if (row[key] !== this.keys[key]) {
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
