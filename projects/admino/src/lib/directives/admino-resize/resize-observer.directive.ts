import { Directive, ElementRef, EventEmitter, Output, Input, OnDestroy, HostBinding, Renderer2, OnInit, ChangeDetectorRef } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill'; //not needed really since > Chrome 64
import { Subject, Observable, from } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
        if (entriesMap.has(entry.target)) {
            const comp = entriesMap.get(entry.target);
            comp._resizeCallback(entry);
        }
    }
});

@Directive({ selector: '[adminoResizeObserver]' })
export class AdminoResizeObserverDirective implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<null> = new Subject();
    @Output() adminoResize = new EventEmitter();
    @Input() debounceAdminoResize = 0;
    callResize: Subject<any> = new Subject();
    callResizeObs: Observable<any> = this.callResize.asObservable();
    breakpoints = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
    constructor(private el: ElementRef, private renderer: Renderer2, private cd: ChangeDetectorRef) {
        const target = this.el.nativeElement;
        entriesMap.set(target, this);
        ro.observe(target);
    }
    ngOnInit() {
        this.callResizeObs.pipe(takeUntil(this.ngUnsubscribe), debounceTime(this.debounceAdminoResize)).subscribe(() => {
            this.adminoResize.emit();
            this.cd.detectChanges();
        });
    }
    _resizeCallback(entry) {
        const width = entry.contentRect.width;
        Object.keys(this.breakpoints).forEach((key) => {
            this.renderer.removeClass(this.el.nativeElement, 'app-' + key);
        });
        if (width >= this.breakpoints.xl) {
            this.renderer.addClass(this.el.nativeElement, 'app-xl');
        } else if (width >= this.breakpoints.lg) {
            this.renderer.addClass(this.el.nativeElement, 'app-lg');
        } else if (width >= this.breakpoints.md) {
            this.renderer.addClass(this.el.nativeElement, 'app-md');
        } else if (width >= this.breakpoints.sm) {
            this.renderer.addClass(this.el.nativeElement, 'app-sm');
        } else {
            this.renderer.addClass(this.el.nativeElement, 'app-xs');
        }
        this.callResize.next();
    }


    ngOnDestroy() {
        const target = this.el.nativeElement;
        ro.unobserve(target);
        entriesMap.delete(target);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
