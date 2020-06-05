import { layout2 } from './../admino-keyboard.layouts';
import { KeyboardLayout } from './../admino-keyboard.interface';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'admino-keyboard',
  templateUrl: './admino-keyboard.component.html',
  styleUrls: ['./admino-keyboard.component.scss']
})
export class AdminoKeyboardComponent implements OnInit {

  _activeFormControl: FormControl;

  @Input() layout: KeyboardLayout = layout2;
  // @Input() set activeFormControl(value) {
  //   this._activeFormControl = value;
  // }
  // get activeFormControl() {
  //   return this._activeFormControl;
  // }
  @Input() availableCharacters: any[];
  // availableCharacters: any[] = [];
  processedLayout: KeyboardLayout;
  opened = true;
  @Output() keyEvent: EventEmitter<any> = new EventEmitter();


  constructor() {

  }

  ngOnInit() {
    this.processedLayout = cloneDeep(this.layout);
    this.updateAvailable();
  }

  keyClicked(event) {
    this.keyEvent.next(event);
  }

  updateAvailable() {
    for (const column of this.processedLayout.columns) {
      for (const row of column.rows) {
        for (const key of row.keys) {

          if (this.availableCharacters) {
            if (this.availableCharacters.indexOf(key.character) > -1) {
              key.disabled = false;
            } else {
              key.disabled = true;
            }
          }

        }
      }
    }
  }

}
