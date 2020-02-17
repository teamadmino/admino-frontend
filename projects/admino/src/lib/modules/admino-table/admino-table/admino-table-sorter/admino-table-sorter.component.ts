import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'admino-admino-table-sorter',
  templateUrl: './admino-table-sorter.component.html',
  styleUrls: ['./admino-table-sorter.component.scss']
})
export class AdminoTableSorterComponent implements OnInit {
  @Input() direction = -1;
  @Input() active = false;
  @Input() enabled = true;
  constructor() { }

  ngOnInit() {
  }

}
