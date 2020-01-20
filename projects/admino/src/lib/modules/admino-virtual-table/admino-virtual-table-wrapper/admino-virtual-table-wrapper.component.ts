import { Component, OnInit, Input } from '@angular/core';
import { AdminoVirtualTableDataSource } from '../admino-virtual-table.datasource';

@Component({
  selector: 'admino-virtual-table-wrapper',
  templateUrl: './admino-virtual-table-wrapper.component.html',
  styleUrls: ['./admino-virtual-table-wrapper.component.scss']
})
export class AdminoVirtualTableWrapperComponent implements OnInit {
  @Input() dataSource: AdminoVirtualTableDataSource;

  constructor() { }

  ngOnInit() {
  }

}
