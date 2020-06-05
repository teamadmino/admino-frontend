import { Component, OnInit } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'admino-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends AdminoScreenElement implements OnInit {
  filteredOptions: Observable<any[]>;

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges
      .pipe(
        startWith(''),
        map(value => {

          return this._filter(value);
        })
      );
  }

  displayFn(option): string {
    return option && option.label;
  }
  private _filter(value: number): any[] {
    if (value === null || value === undefined) {
      return this.element.options;
    }
    const filterValue = value;
    return this.element.options.filter(option => option.label.toString().toLowerCase().includes(filterValue.toString().toLowerCase()));
  }
}
