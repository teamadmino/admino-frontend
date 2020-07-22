import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class KeyService {
  modifierKeysList = ["Control", "Shift", "Alt", "Meta"];
  activeModifierKeys = [];
  constructor() {
    window.addEventListener("keydown", (event) => {
      if (
        this.modifierKeysList.indexOf(event.key) > -1 &&
        this.activeModifierKeys.indexOf(event.code) === -1
      ) {
        this.activeModifierKeys.push(event.code);
      }
    });
    window.addEventListener("keyup", (event) => {
      if (
        this.modifierKeysList.indexOf(event.key) > -1 &&
        this.activeModifierKeys.indexOf(event.code) > -1
      ) {
        this.activeModifierKeys.splice(
          this.activeModifierKeys.indexOf(event.code),
          1
        );
      }
    });
    window.addEventListener("focus", (event) => {
      this.activeModifierKeys.splice(0, this.activeModifierKeys.length);
    });
  }
}
