import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AdminoThemeService } from '../../../services/theme.service';
import { AdminoSiteService } from '../../../services/site.service';
import { AdminoUserService } from '../../../services/user.service';

@Component({
  selector: 'admino-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  constructor(public ts: AdminoThemeService,
    public site: AdminoSiteService,
    public user: AdminoUserService,
    private cd: ChangeDetectorRef) {


  }

  ngOnInit() {
  }

}
