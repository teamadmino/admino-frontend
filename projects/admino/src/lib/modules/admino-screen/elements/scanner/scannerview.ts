import { AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ScannerService } from './scanner.service';
import { ChangeDetectorRef, Component, Input, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
    template: ''
})
export class ScannerView implements OnDestroy {
    ngUnsubscribe: Subject<any> = new Subject();
    @Input() pageNum: number;

    activeControl: AbstractControl;

    @HostListener('document:keydown', ['$event'])
    onKeyInput(e) {

        if (e.key === 'Enter') {
            if (this.isActive()) {
                this.onNext();
            }
        } else if (e.key === 'Escape') {
            if (this.isActive()) {
                this.onPrev();
            }
        } else if (this.scannerService.keyboardMode) {
            const length = this.activeControl.value === null ? 0 : this.activeControl.value.length;
            const currentVal = this.activeControl.value === null ? '' : this.activeControl.value;
            if (e.key === 'Backspace') {
                this.activeControl.setValue(currentVal.substring(0, length - 1));

            } else {
                if ((this.isNumber(e.key)) && length <= 8) {
                    this.activeControl.setValue(currentVal + e.key.toString());
                }
            }
            this.keyInput(e);
        }
    }
    keyInput(e) {

    }

    isActive() {
        return this.scannerService.page.value === this.pageNum;
    }

    isNumber(num) {
        return isFinite(num);
    }
    constructor(public cd: ChangeDetectorRef, public scannerService: ScannerService) {
        this.scannerService.next.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            if (this.isActive()) {
                this.onNext();
            }
        });
        this.scannerService.prev.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            if (this.isActive()) {
                this.onPrev();
            }
        });
    }

    onNext() { }
    onPrev() {
        if (this.scannerService.page.value > 0) {
            this.scannerService.page.next(this.scannerService.page.value - 1);
        }
    }
    ngOnDestroy() {
        console.log("ONDESTROY")
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
