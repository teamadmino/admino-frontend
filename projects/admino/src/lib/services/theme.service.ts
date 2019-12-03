import { Injectable, Inject, Renderer2 } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ThemeConfig } from '../interfaces';
// declare var pSBC: any;
// import { pSBC } from './utils/color-manipulator';
import { pSBC } from '../modules/admino-theming/utils/color-manipulator';
// const pSBC = require('../modules/admino-theming/utils/color-manipulator');

@Injectable({
  providedIn: 'root'
})
export class AdminoThemeService {
  colors: string[] = [];
  primaryColor: string;
  accentColor: string;
  warnColor: string;
  bgColor: string;
  fgColor: string;
  primaryContrast: string;
  accentContrast: string;
  warnContrast: string;

  themeChanged: BehaviorSubject<any> = new BehaviorSubject(null);
  updateColors: Subject<any> = new Subject();
  themeUpdated: Subject<any> = new Subject();
  isThemeChanging = false;

  currentTheme = '';
  previousTheme = '';
  selectedTheme = 'blue';
  themes: string[] = ['purple', 'gold', 'blue'];
  isDarkTheme = false;
  constructor() {
    // this.setTheme('purple');
  }
  init(themeConfig: ThemeConfig) {
    // setTimeout(() => {
    this.setTheme(themeConfig.themeColor, themeConfig.isDark);
    // });
  }
  setTheme(theme: string, isDark: boolean = null) {
    this.isThemeChanging = true;

    this.selectedTheme = theme;
    this.isDarkTheme = isDark !== null ? isDark : this.isDarkTheme;

    this.previousTheme = this.currentTheme;
    this.currentTheme = this.selectedTheme + '-' + (this.isDarkTheme ? 'dark' : 'light') + '-theme';
    this.themeChanged.next(null);
    setTimeout(() => {
      this.isThemeChanging = false;
      this.updateColors.next();
    }, 1);
  }
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.setTheme(this.selectedTheme, this.isDarkTheme);

  }

  rgba(color: string, alpha) {
    let ret = color.slice(0, color.length - 1);

    ret = ret + ', ' + alpha.toString() + ')';
    return ret;
  }

  color(p, c0, c1 = null, l = null) {
    return pSBC.pSBC(p, c0, c1, l);
  }


}
