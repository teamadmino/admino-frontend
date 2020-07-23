import { slotTransition } from "./../../main/main.animation";
import { AdminoActionService } from "./../../../services/action.service";
import { AdminoApiService } from "./../../../services/api.service";
import { ScreenElementScreen, ScreenPopup } from "./../../admino-screen/admino-screen.interfaces";
import { AdminoModalService, AdminoModalRef } from "./../../admino-modal/admino-modal.service";
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { AdminoScreenComponent } from "../../admino-screen/admino-screen.component";
import { AdminoUniversalEditorPopupComponent } from "../admino-universal-editor-popup/admino-universal-editor-popup.component";
import { isObject } from "../../../utils/isobject";
import { map } from "rxjs/operators";

@Component({
  selector: "admino-universal-editor",
  templateUrl: "./admino-universal-editor.component.html",
  styleUrls: ["./admino-universal-editor.component.scss"],
  animations: [slotTransition],
})
export class AdminoUniversalEditorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @ViewChild(AdminoScreenComponent, { static: true }) screen: AdminoScreenComponent;

  screenElement: ScreenElementScreen;

  openPopups: { popup: ScreenPopup; ref: AdminoModalRef }[] = [];
  // // dataSource;
  animTrigger = true;

  // activeScreenId = 0;

  @HostListener("document:click", ["$event"])
  @HostListener("document:keyup", ["$event"])
  @HostListener("document:keydown", ["$event"])
  keydown(e: any) {
    if (this.screen.blockingActionRunning) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  constructor(
    private route: ActivatedRoute,
    public as: AdminoActionService,
    private ms: AdminoModalService,
    private api: AdminoApiService,
    private cd: ChangeDetectorRef
  ) {}

  redrawScreen(screen: ScreenElementScreen, reset = false) {
    if (reset) {
      this.clearPopups();
    }
    this.handlePopups(screen);
    this.screen.update(screen, reset);
    if (reset) {
      this.animTrigger = !this.animTrigger;
    }
    this.cd.detectChanges();
  }

  handlePopups(screen) {
    if (screen.popups) {
      for (const popup of screen.popups) {
        const found = this.openPopups.find((pref) => {
          return pref.popup.id === popup.id;
        });
        if (found) {
          found.ref.modal.setData({
            popup,
            universalEditor: this,
            mainScreenComponent: this.screen,
          });
          if (popup.destroy) {
            found.ref.modal.close();
          }
        } else {
          const ref = this.ms.open(AdminoUniversalEditorPopupComponent, {
            width: popup.width ? popup.width : undefined,
            height: popup.height,
            horizontalPosition: popup.horizontalPosition,
            verticalPosition: popup.verticalPosition,
            data: {
              popup,
              universalEditor: this,
              mainScreenComponent: this.screen,
            },
          });
          const pref = { popup, ref };
          ref.modal.closeEvent.subscribe((ev) => {
            this.openPopups.splice(this.openPopups.indexOf(pref), 1);
          });
          this.openPopups.push(pref);
        }
      }
    }
    this.getOpenScreens();
  }

  getOpenScreens() {
    const screens = [this.screen];
    this.openPopups.forEach((popup) => {
      screens.push(popup.ref.component.instance.screen);
    });
    return screens;
  }

  clearPopups() {
    for (const popup of this.openPopups) {
      popup.ref.modal.close();
    }
    this.openPopups = [];
  }

  ngOnInit() {
    this.as.redrawScreen.subscribe((screen: ScreenElementScreen) => {
      if (screen) {
        this.redrawScreen(screen, true);
      } else {
        this.screenElement = null;
      }
    });

    this.as.updateScreen.subscribe((updatedScreen: ScreenElementScreen) => {
      if (updatedScreen) {
        this.redrawScreen(updatedScreen);
      }
    });

    this.as.setFocus.subscribe((focusedEl: any) => {
      // console.log(focusedEl);
      if (this.screen) {
        this.screen.focusElement(focusedEl);
      }
      // if (updatedScreen) {
      //   this.redrawScreen(updatedScreen);
      // }
    });
    console.log(this.screen);
    this.as.setBlocking.subscribe((val) => {
      this.screen.blockingActionRunning = val;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
