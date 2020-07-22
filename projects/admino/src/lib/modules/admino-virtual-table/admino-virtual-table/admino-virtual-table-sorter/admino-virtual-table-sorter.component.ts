import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "admino-admino-virtual-table-sorter",
  templateUrl: "./admino-virtual-table-sorter.component.html",
  styleUrls: ["./admino-virtual-table-sorter.component.scss"],
})
export class AdminoVirtualTableSorterComponent implements OnInit {
  @Input() direction = -1;
  @Input() active = false;
  @Input() enabled = true;
  constructor() {}

  ngOnInit() {}
}
