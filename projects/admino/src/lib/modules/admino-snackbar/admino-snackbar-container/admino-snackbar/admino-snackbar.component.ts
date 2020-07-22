import { AdminoScreenComponent } from "./../../../admino-screen/admino-screen.component";
import { AdminoSnackbarContainerComponent } from "./../admino-snackbar-container.component";
import { AdminoSnackbar } from "./../../../../interfaces";
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { AdminoThemeService } from "../../../../services/theme.service";

@Component({
  selector: "admino-snackbar",
  templateUrl: "./admino-snackbar.component.html",
  styleUrls: ["./admino-snackbar.component.scss"],
  animations: [
    [
      trigger("openClose", [
        // ...
        state(
          "open",
          style({
            height: "*",
            opacity: 1,
          })
        ),
        state(
          "closed",
          style({
            height: "0px",
            opacity: 0,
            marginBottom: 0,
          })
        ),
        transition("open <=> closed", [animate("0.5s ease-in")]),
      ]),
    ],
  ],
})
export class AdminoSnackbarComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("screenRef", { static: true }) screenRef: AdminoScreenComponent;

  @Input() snackbarContainer: AdminoSnackbarContainerComponent;
  @Input() snackbarData: AdminoSnackbar;
  timeout;
  timeout2;
  isOpen = false;
  transition = false;
  constructor(private cd: ChangeDetectorRef, public ts: AdminoThemeService) {}

  ngOnInit() {
    // [screenElement]="snackbarData.screen"
    this.screenRef.update(this.snackbarData.screen, true);
    if (this.snackbarData.timeout) {
      this.timeout = setTimeout((params) => {
        this.close();
      }, this.snackbarData.timeout);
    }
  }
  close() {
    this.isOpen = false;
    this.cd.detectChanges();
    this.timeout2 = setTimeout((params) => {
      this.snackbarContainer.remove(this.snackbarData);
    }, 500);
  }

  ngAfterViewInit() {
    this.isOpen = true;
    this.transition = true;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.timeout2) {
      clearTimeout(this.timeout2);
    }
  }
}
