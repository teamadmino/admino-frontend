import { trigger, sequence, state, animate, transition, style, animateChild, query, group, stagger } from "@angular/animations";

const inEasing = " ease-in";
const outEasing = " ease-out";
const inOutEasing = " cubic-bezier(.75,-0.5,0,1.75)";
const elastic = " cubic-bezier(.42,1.4,.58,1.01)";

export const menuItemAnimation = trigger("menuItemAnimation", [
  // ...
  state(
    "1",
    style({
      height: "*",
      opacity: 1,
    })
  ),
  state(
    "0",
    style({
      height: "0",
      opacity: 0.5,
    })
  ),
  transition("1 => 0", [animate("0.15s ease-in-out")]),
  transition("0 => 1", [animate("0.15s ease-in-out")]),
]);
