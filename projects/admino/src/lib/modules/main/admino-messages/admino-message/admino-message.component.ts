import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'admino-message',
  templateUrl: './admino-message.component.html',
  styleUrls: ['./admino-message.component.css']
})
export class AdminoMessageComponent implements OnInit {

  @Input() message: any;
  constructor() { }

  ngOnInit() {
  }

}
