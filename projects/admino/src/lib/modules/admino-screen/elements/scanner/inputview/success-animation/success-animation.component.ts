import { AdminoThemeService } from './../../../../../../services/theme.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admino-success-animation',
  templateUrl: './success-animation.component.html',
  styleUrls: ['./success-animation.component.scss']
})
export class SuccessAnimationComponent implements OnInit {

  color = '#ff0000';
  constructor(private ts: AdminoThemeService) {

    this.ts.themeChanged.subscribe(() => {
      this.color = this.ts.accentColor;
    });
  }

  ngOnInit() {
  }

}
