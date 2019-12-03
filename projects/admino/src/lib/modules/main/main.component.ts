import { AdminoActionService } from './../../services/action.service';
import { ConfigService } from './../../services/config.service';
import { AdminoUserService } from './../../services/user.service';
import { AdminoMenuItem, AdminoButton } from './../../interfaces';
import {
  Component, OnInit, ViewChild, Renderer2, ChangeDetectorRef,
  ChangeDetectionStrategy, Inject, Input, OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { AdminoThemeService } from '../../services/theme.service';
import { AdminoSiteService } from '../../services/site.service';
import { AdminoNavService } from '../../services/nav.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminoMenuEvent } from '../../interfaces';
import { slotTransition } from './main.animation';
import { AdminoApiService } from '../../services/api.service';

@Component({
  selector: 'admino-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slotTransition]
})
export class MainComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  opened: boolean;
  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  @ViewChild('scrollAreaRef', { static: false }) scrollAreaRef;

  @Input() configPath: string;

  rendererListenerFn;


  constructor(public ts: AdminoThemeService, public site: AdminoSiteService, public renderer: Renderer2,
    public user: AdminoUserService,
    public nav: AdminoNavService, private api: AdminoApiService,
    private media: MediaMatcher, private route: ActivatedRoute, public as: AdminoActionService, public cs: ConfigService, private cd: ChangeDetectorRef, @Inject(DOCUMENT) document
  ) {

  }

  ngOnInit() {

    this.cs.loadConfig(this.configPath);
    this.cs.configLoaded.subscribe((config) => {
      if (config) {
        this.ts.init(config.theme);
        this.api.init(config.server);
        this.nav.init();
        this.init();
        this.as.init();
        this.user.init();
        // this.api.login().subscribe();
      }
    });

  }
  prepareSidebarState() {
    const state = this.site.isSideNavOpen.value ? 'opened' : 'closed';
    return state;
  }

  init() {
    this.cd.detectChanges();

    // this.nav.onRouteChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
    //   this.updateMenus();
    // });

    this.ts.themeChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.ts.previousTheme) {
        this.renderer.removeClass(document.body, this.ts.previousTheme);
      }
      this.renderer.addClass(document.body, this.ts.currentTheme);
    });

    this.site.screenSizeChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.site.screen.w < this.site.breakpoints.sm) {
        this.site.closeSideNav();
        this.site.closeMessages();
      }
      this.cd.detectChanges();
    });
    this.site.documentElement = document.documentElement;
    this.rendererListenerFn = this.renderer.listen(this.scrollAreaRef.nativeElement, 'scroll', (evt) => {
      this.site.refreshScroll(evt);
      this.cd.markForCheck();
    });
  }
  // getState(outlet: RouterOutlet) {
  //   // const ret = outlet.activatedRoute.component
  //   const ret = (outlet.activatedRoute.url as any).value;
  //   // console.log(this.route.url.value);
  //   return ret;
  // }


  closeSidenav() {
    this.site.closeSideNav();
    this.site.closeMessages();
  }

  menuClicked(menuEvent: AdminoMenuEvent) {
    // console.log(menuEvent.menuItem.action);
    // this.nav.navigate(menuEvent.menuItem.action);
    this.as.handleAction({ action: { type: 'screen', id: menuEvent.menuItem.action } });
  }
  bottomMenuClicked(button: AdminoButton) {
    this.as.handleAction({ action: button.action });
  }


  updateMenus() {
    this.traverseMenus(this.user.menu);
  }
  traverseMenus(menus: AdminoMenuItem[], level = 0, activeRoute = true) {
    // menus.forEach((menu) => {
    //   let isActive = false;
    //   if (activeRoute && this.nav.activeRoute[level] !== undefined && this.nav.activeRoute[level] === menu.action) {
    //     isActive = true;
    //   }
    //   menu._isActive = isActive;
    //   if (menu.children) {
    //     this.traverseMenus(menu.children, level + 1, isActive);
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.rendererListenerFn) {
      this.rendererListenerFn();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
}
