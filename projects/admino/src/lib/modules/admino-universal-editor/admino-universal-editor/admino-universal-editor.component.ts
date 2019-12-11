import { slotTransition } from './../../main/main.animation';
import { AdminoActionService } from './../../../services/action.service';
import { AdminoNavService } from './../../../services/nav.service';
import { AdminoApiService } from './../../../services/api.service';
import { takeUntil } from 'rxjs/operators';
import { ScreenElementScreen } from './../../admino-screen/admino-screen.interfaces';
import { AdminoAction, ActionEvent } from './../../../interfaces';
import { AdminoModalService } from './../../admino-modal/admino-modal.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { deepMerge } from '../../../utils/deepmerge';
import { AdminoScreenComponent } from '../../admino-screen/admino-screen.component';

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

  // dataSource;

  constructor(private route: ActivatedRoute, public as: AdminoActionService,
    private nav: AdminoNavService, private ms: AdminoModalService, private api: AdminoApiService, private cd: ChangeDetectorRef) {

  }

  redrawScreen(screen: ScreenElementScreen) {
    this.screenElement = screen;
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.as.redrawScreen.subscribe((screen: ScreenElementScreen) => {
      if (screen) {
        this.redrawScreen(screen);
      } else {
        this.screenElement = null;
      }
    });

    this.as.updateScreen.subscribe((updatedElement: ScreenElementScreen) => {
      if (updatedElement) {
        this.screen.update(updatedElement);

      }
      // if (screenUpdate) {
      //   for (const key of Object.keys(screenUpdate)) {
      //     const elementUpdate = screenUpdate[key];

      //     let exists = false;
      //     for (const element of this.screenConfig.elements) {
      //       if (element.id === key) {
      //         exists = true;
      //         Object.assign(element, deepMerge(elementUpdate));
      //       }
      //     }


      //     // if (elementUpdate.createAt && !exists) {
      //     //   elementUpdate.id = key;
      //     //   this.screenConfig.sections[elementUpdate.createAt.sectionIndex]
      //     //     .elements.splice(elementUpdate.createAt.elementIndex, 0, elementUpdate);
      //     //   delete elementUpdate.createAt;
      //     // }
      //   }
      //   this.cd.detectChanges();
      // }
    });
    // const ref = this.ms.open(EditModalComponent, {
    //   width: '100%',
    //   data: { form: balaForm }
    // });

    // console.log(this.route)
    // console.log(this.route.snapshot.data)
    // this.route.data.subscribe((data) => {
    //   // this.dataSource = data.dataSource;
    // });
  }


  actionEvent(actionEvent: ActionEvent) {
    this.as.handleAction(actionEvent).subscribe();
  }

  ngOnDestroy() {

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
}
