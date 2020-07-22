import { HttpClient } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
// import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from "ngx-device-detector";

@Injectable({
  providedIn: "root",
})
export class AdminoSiteService {
  private aspectBaseW = 320;
  private aspectBaseH = 240;
  screenSizeChange: Subject<{
    w: number;
    h: number;
    aspect: number;
    orientation: string;
  }> = new Subject();
  zoomInArea: Subject<any> = new Subject();
  navigationEvent: Subject<any> = new Subject();
  screenOrientationChange: Subject<string> = new Subject();
  screen: { w: number; h: number; aspect: number; orientation: string } = {
    w: 0,
    h: 0,
    aspect: 1,
    orientation: "landscape",
  };
  isElectron = false;
  isMaximized = false;

  scrollEvent: Subject<number> = new Subject();
  isScrollAtTop = true;
  isScrolling = false;
  scrollPosition = 0;

  documentElement;

  deviceInfo = null;
  isMobile = false;
  isTablet = false;
  isDesktop = true;

  isSideNavOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isMessagesOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);

  logoComponent;

  breakpoints: any = {
    xxs: 320,
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
  };

  // private es: ElectronService,@Inject(DOCUMENT) private document: any, private deviceService: DeviceDetectorService
  // private es: ElectronService,
  constructor(
    private deviceService: DeviceDetectorService,
    private http: HttpClient
  ) {
    window.addEventListener("resize", () => {
      this.refreshScreenSize();
    });
    // if (this.es.isElectronApp) {
    //   this.isElectron = true;
    //   this.isMaximized = this.es.remote.getCurrentWindow().isMaximized();
    // }
    this.getDeviceInfo();
    setTimeout((params) => {
      this.refreshScreenSize();
    });
  }

  toggleSideNav() {
    if (this.isSideNavOpen.value) {
      this.closeSideNav();
    } else {
      this.openSideNav();
    }
  }
  openSideNav() {
    if (this.screen.w < this.breakpoints.sm) {
      this.closeMessages();
    }
    this.isSideNavOpen.next(true);
  }
  closeSideNav() {
    this.isSideNavOpen.next(false);
  }

  toggleMessages() {
    if (this.isMessagesOpen.value) {
      this.closeMessages();
    } else {
      this.openMessages();
    }
  }
  openMessages() {
    if (this.screen.w < this.breakpoints.sm) {
      this.closeSideNav();
    }
    this.isMessagesOpen.next(true);
  }
  closeMessages() {
    this.isMessagesOpen.next(false);
  }

  registerScrollListener(nativeEl) {
    nativeEl.addEventListener("scroll", (e) => {
      this.refreshScroll(e);
    });
  }
  refreshScroll(e) {
    this.scrollPosition = e.target.scrollTop;
    if (this.scrollPosition > 10) {
      this.isScrollAtTop = false;
      this.isScrolling = true;
    } else {
      this.isScrollAtTop = true;
      this.isScrolling = false;
    }
    this.scrollEvent.next(this.scrollPosition);
  }
  refreshScreenSize() {
    this.screen.w = window.innerWidth;
    this.screen.h = window.innerHeight;
    this.screen.aspect = this.screen.h / this.screen.w;
    let temp_orientation;
    if (this.screen.w * (this.aspectBaseH / this.aspectBaseW) > this.screen.h) {
      temp_orientation = "landscape";
    } else {
      temp_orientation = "portrait";
    }
    if (temp_orientation !== this.screen.orientation) {
      this.screen.orientation = temp_orientation;
      this.screenOrientationChange.next(this.screen.orientation);
    }
    this.screenSizeChange.next(this.screen);
  }

  maximize() {
    // if (this.es.isElectronApp) {
    //   this.es.ipcRenderer.send('maximize');
    //   this.isMaximized = !this.isMaximized;
    // } else {
    if (this.isMaximized) {
      this.closeFullscreen();
    } else {
      this.openFullscreen();
    }
    this.isMaximized = !this.isMaximized;
    // }
  }
  // close() {
  //   if (this.es.isElectronApp) {
  //     this.es.ipcRenderer.send('close');
  //   }
  // }
  // minimize() {
  //   if (this.es.isElectronApp) {
  //     this.es.ipcRenderer.send('minimize');
  //   }
  // }

  openFullscreen() {
    if (this.documentElement.requestFullscreen) {
      this.documentElement.requestFullscreen();
    } else if (this.documentElement.mozRequestFullScreen) {
      /* Firefox */
      this.documentElement.mozRequestFullScreen();
    } else if (this.documentElement.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.documentElement.webkitRequestFullscreen();
    } else if (this.documentElement.msRequestFullscreen) {
      /* IE/Edge */
      this.documentElement.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
  }
}
