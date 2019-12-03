import {
    trigger,
    state,
    style,
    animate,
    transition,
    query,
    stagger,
    animateChild,
    group,
    sequence,
    // ...
} from '@angular/animations';

const inExpo = ' cubic-bezier(0.950, 0.050, 0.795, 0.035)';
const outExpo = ' cubic-bezier(0.190, 1.000, 0.220, 1.000)';
// const inOutExpo = ' cubic-bezier(1.000, 0.000, 0.000, 1.000)';
const inEasing = ' ease-in';
const outEasing = ' ease-out';
const inOutEasing = ' ease-in-out';

export const slotTransition = trigger('slotTransition', [

    // transition(':enter', []),

    transition('* <=> *', [
        //
        query(':enter', style({ display: 'block', overflow: 'hidden' }), { optional: true }),


        // query(':leave', sequence([
        //     style({ display: 'none', position: 'absolute' })
        // ]), { optional: true }),
        query(':enter .routeAnimated', style({ opacity: 0, transform: 'translateY(10px)' }),
            { optional: true }),

        group([
            query(':enter', sequence([
                style({ opacity: '0', height: '100%' }),
                animate('300ms' + outEasing, style({ opacity: 1, height: '100%' }))
            ]), { optional: true }),

            query(':enter .routeAnimated',
                stagger('50ms', [
                    animate('200ms 50ms' + outEasing, style({ opacity: 1, transform: 'translateY(0px)' }))
                ]), { optional: true }),
        ])


    ])

]);

export const slotWrapperAnimation = trigger('slotWrapperTransition', [

    transition(':enter', [

    ]),

]);
export const slotBoxAnimation = trigger('slotBoxTransition', [
    // transition(':leave', [
    //     sequence([
    //         // style({ transform: 'scale(0)', opacity: 0 }),
    //         animate('100ms' + inEasing, style({ opacity: 0, transform: 'scale(0.2)' }))
    //     ])
    // ]),
    transition(':enter', [
        sequence([
            style({ opacity: '0', transform: 'scale(0.2)' }),
            animate('300ms' + outExpo, style({ opacity: 1, transform: 'scale(1)' }))
        ])
    ]),

]);
