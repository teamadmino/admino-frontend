import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[adminoDisableDefaultKeyEvents]",
})
export class DisableDefaultKeyEventsDirective {
  constructor() {}
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): boolean {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
}
