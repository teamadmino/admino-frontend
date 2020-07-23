import { ScreenPopup } from "./../../admino-screen/admino-screen.interfaces";
import { AdminoUniversalEditorComponent } from "./../admino-universal-editor/admino-universal-editor.component";
import { BehaviorSubject } from "rxjs";
import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MODAL_DATA, MODAL_REF, AdminoModalComponent } from "../../admino-modal/admino-modal/admino-modal.component";
import { ScreenElementScreen } from "../../admino-screen/admino-screen.interfaces";
import { slotTransition } from "../../main/main.animation";
import { AdminoScreenComponent } from "../../admino-screen/admino-screen.component";

@Component({
  selector: "admino-admino-universal-editor-popup",
  templateUrl: "./admino-universal-editor-popup.component.html",
  styleUrls: ["./admino-universal-editor-popup.component.scss"],
  animations: [slotTransition],
})
export class AdminoUniversalEditorPopupComponent implements OnInit {
  @ViewChild(AdminoScreenComponent, { static: true })
  screen: AdminoScreenComponent;
  vami = 100;
  universalEditor: AdminoUniversalEditorComponent;
  mainScreenComponent: AdminoScreenComponent;

  constructor(@Inject(MODAL_DATA) public dataSubject: BehaviorSubject<any>, @Inject(MODAL_REF) public modalRef: AdminoModalComponent) {
    // console.log(dataSubject)
  }

  ngOnInit() {
    this.dataSubject.subscribe((data: any) => {
      if (data) {
        console.log(data);
        if (data.universalEditor) {
          this.universalEditor = data.universalEditor;
        }
        if (data.mainScreenComponent) {
          this.mainScreenComponent = data.mainScreenComponent;
        }

        const popup: ScreenPopup = data.popup;

        if (popup.setScreen) {
          this.screen.update(popup.setScreen, true);
        }
        if (popup.updateScreen) {
          this.screen.update(popup.updateScreen);
        }
      }
    });
  }
}
