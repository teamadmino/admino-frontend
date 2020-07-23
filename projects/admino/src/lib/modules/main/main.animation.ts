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
} from "@angular/animations";

const inExpo = " cubic-bezier(0.950, 0.050, 0.795, 0.035)";
const outExpo = " cubic-bezier(0.190, 1.000, 0.220, 1.000)";
// const inOutExpo = ' cubic-bezier(1.000, 0.000, 0.000, 1.000)';
const inEasing = " ease-in";
const outEasing = " ease-out";
const inOutEasing = " ease-in-out";

export const slotTransition = trigger("slotTransition", [
  // transition(':enter', []),

  transition("* <=> *", [
    //
    // query(':enter', style({ display: 'block' }), { optional: true }),

    // query(':leave', sequence([
    //     style({ display: 'none', position: 'absolute' })
    // ]), { optional: true }),
    query(".routeAnimated", style({ opacity: 0, transform: "translateY(0px)" }), { optional: true }),

    group([
      query(
        ":enter",
        sequence([style({ opacity: "0", height: "100%" }), animate("300ms" + outEasing, style({ opacity: 1, height: "100%" }))]),
        { optional: true }
      ),

      query(".routeAnimated", stagger("50ms", [animate("200ms 50ms" + outEasing, style({ opacity: 1, transform: "translateY(0px)" }))]), {
        optional: true,
      }),
    ]),
  ]),
]);
