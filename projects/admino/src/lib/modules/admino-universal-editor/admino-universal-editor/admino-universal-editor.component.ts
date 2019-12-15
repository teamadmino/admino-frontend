import { slotTransition } from './../../main/main.animation';
import { AdminoActionService } from './../../../services/action.service';
import { AdminoNavService } from './../../../services/nav.service';
import { AdminoApiService } from './../../../services/api.service';
import { ScreenElementScreen, ScreenPopup } from './../../admino-screen/admino-screen.interfaces';
import { ActionEvent } from './../../../interfaces';
import { AdminoModalService, AdminoModalRef } from './../../admino-modal/admino-modal.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminoScreenComponent } from '../../admino-screen/admino-screen.component';
import { AdminoUniversalEditorPopupComponent } from '../admino-universal-editor-popup/admino-universal-editor-popup.component';
import { isObject } from '../../../utils/isobject';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admino-universal-editor',
  templateUrl: './admino-universal-editor.component.html',
  styleUrls: ['./admino-universal-editor.component.scss'],
  animations: [slotTransition]
})
export class AdminoUniversalEditorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();
  @ViewChild(AdminoScreenComponent, { static: false }) screen: AdminoScreenComponent;
  screenElement: ScreenElementScreen;

  openPopups: { popup: ScreenPopup, ref: AdminoModalRef }[] = [];
  // // dataSource;
  animTrigger = true;

  // activeScreenId = 0;

  constructor(private route: ActivatedRoute, public as: AdminoActionService,
    private nav: AdminoNavService, private ms: AdminoModalService, private api: AdminoApiService, private cd: ChangeDetectorRef) {

  }

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
            universalEditor: this
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
              universalEditor: this
            }
          });
          const pref = { popup, ref };
          ref.modal.closeEvent.subscribe((ev) => {
            this.openPopups.splice(this.openPopups.indexOf(pref), 1);
          });
          this.openPopups.push(pref);
        }
      }
    }
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

  }


  // actionEvent(actionEvent: ActionEvent) {
  //   this.as.handleAction(actionEvent).subscribe();
  // }

  prepareClasses() {
    const baseClasses = ['col-12', 'mh-100', 'routeAnimated'];
    if (this.screenElement && this.screenElement.classes) {
      baseClasses.concat(this.screenElement.classes);
    }
    return baseClasses;
  }

  ngOnDestroy() {

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
}
