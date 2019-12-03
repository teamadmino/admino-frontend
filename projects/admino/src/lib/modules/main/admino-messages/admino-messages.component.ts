import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admino-messages',
  templateUrl: './admino-messages.component.html',
  styleUrls: ['./admino-messages.component.css']
})
export class AdminoMessagesComponent implements OnInit {
  //  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.


  messages: any[] = [
    {
      title: 'Kimutatás elkészült',
      text: 'Az eredményekhez kattintson a megtekintés gombra',
    },
    {
      title: 'Emlékeztető',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      title: 'Riasztás',
      text: 'When an unknown printer took a galley of type and scrambled.',
    },
    {
      title: 'Kimutatás elkészült',
      text: 'Scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.',
    },
    {
      title: 'Lorem ipsum',
      text: 'standard dummy text ever since the 1500s',
    },
    {
      title: 'Dolor sit amet',
      text: 'Az eredményekhez kattintson a megtekintés gombra',
    },
    {
      title: 'Riasztás',
      text: 'Az eredményekhez kattintson a megtekintés gombra',
    },
    {
      title: 'Riasztás',
      text: 'Az eredményekhez kattintson a megtekintés gombra',
    },
    {
      title: 'Emlékeztető',
      text: 'Az eredményekhez kattintson a megtekintés gombra',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
