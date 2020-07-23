import { trigger, sequence, state, animate, transition, style, animateChild, query, group, stagger } from "@angular/animations";

const inEasing = " ease-in";
const outEasing = " ease-out";
const inOutEasing = " cubic-bezier(.75,-0.5,0,1.75)";
const elastic = " cubic-bezier(.42,1.4,.58,1.01)";

export const adminoVirtualTableAnimation = trigger("adminoTableRowAnimation", [
  transition("* => true", [query(".cell-content", [style({ opacity: 0 }), animate("0.4s", style({ opacity: 1 }))])]),
  // , transform: 'translateX(0px)'
  // transition(':leave', [
  //     animate('0.2s', style({ opacity: 0 }))
  // ])
]);
