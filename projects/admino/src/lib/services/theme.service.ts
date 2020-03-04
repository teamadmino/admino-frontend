import { Injectable, Inject, Renderer2 } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ThemeConfig } from '../interfaces';
// declare var pSBC: any;
// import { pSBC } from './utils/color-manipulator';
// import { pSBC } from '../modules/admino-theming/utils/color-manipulator';
import * as pSBC from '../modules/admino-theming/utils/color-manipulator';

import { isArray } from 'lodash';
import { isObject } from 'util';
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



  colorList: any = {
    aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff', aquamarine: '#7fffd4', azure: '#f0ffff',
    beige: '#f5f5dc', bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd', blue: '#0000ff', blueviolet: '#8a2be2', brown: '#a52a2a', burlywood: '#deb887',
    cadetblue: '#5f9ea0', chartreuse: '#7fff00', chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed', cornsilk: '#fff8dc', crimson: '#dc143c', cyan: '#00ffff',
    darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b', darkgray: '#a9a9a9', darkgreen: '#006400', darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f',
    darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000', darksalmon: '#e9967a', darkseagreen: '#8fbc8f', darkslateblue: '#483d8b', darkslategray: '#2f4f4f', darkturquoise: '#00ced1',
    darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff', dimgray: '#696969', dodgerblue: '#1e90ff',
    firebrick: '#b22222', floralwhite: '#fffaf0', forestgreen: '#228b22', fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff', gold: '#ffd700', goldenrod: '#daa520', gray: '#808080', green: '#008000', greenyellow: '#adff2f',
    honeydew: '#f0fff0', hotpink: '#ff69b4',
    'indianred ': '#cd5c5c', indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
    lavender: '#e6e6fa', lavenderblush: '#fff0f5', lawngreen: '#7cfc00', lemonchiffon: '#fffacd', lightblue: '#add8e6', lightcoral: '#f08080', lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2',
    lightgrey: '#d3d3d3', lightgreen: '#90ee90', lightpink: '#ffb6c1', lightsalmon: '#ffa07a', lightseagreen: '#20b2aa', lightskyblue: '#87cefa', lightslategray: '#778899', lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0', lime: '#00ff00', limegreen: '#32cd32', linen: '#faf0e6',
    magenta: '#ff00ff', maroon: '#800000', mediumaquamarine: '#66cdaa', mediumblue: '#0000cd', mediumorchid: '#ba55d3', mediumpurple: '#9370d8', mediumseagreen: '#3cb371', mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc', mediumvioletred: '#c71585', midnightblue: '#191970', mintcream: '#f5fffa', mistyrose: '#ffe4e1', moccasin: '#ffe4b5',
    navajowhite: '#ffdead', navy: '#000080',
    oldlace: '#fdf5e6', olive: '#808000', olivedrab: '#6b8e23', orange: '#ffa500', orangered: '#ff4500', orchid: '#da70d6',
    palegoldenrod: '#eee8aa', palegreen: '#98fb98', paleturquoise: '#afeeee', palevioletred: '#d87093', papayawhip: '#ffefd5', peachpuff: '#ffdab9', peru: '#cd853f', pink: '#ffc0cb', plum: '#dda0dd', powderblue: '#b0e0e6', purple: '#800080',
    rebeccapurple: '#663399', red: '#ff0000', rosybrown: '#bc8f8f', royalblue: '#4169e1',
    saddlebrown: '#8b4513', salmon: '#fa8072', sandybrown: '#f4a460', seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d', silver: '#c0c0c0', skyblue: '#87ceeb', slateblue: '#6a5acd', slategray: '#708090', snow: '#fffafa', springgreen: '#00ff7f', steelblue: '#4682b4',
    tan: '#d2b48c', teal: '#008080', thistle: '#d8bfd8', tomato: '#ff6347', turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3', white: '#ffffff', whitesmoke: '#f5f5f5',
    yellow: '#ffff00', yellowgreen: '#9acd32'
  };



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

  psbc(p, c0, c1 = null, l = null) {
    return pSBC.pSBC(p, c0, c1, l);
  }

  getColor(id: string | string[]) {

    if (isArray(id)) {
      const arr = [];
      id.forEach((colorId) => {
        if (isArray(colorId)) {
          arr.push(this.getColor(colorId));
        } else {
          arr.push(this.getColorFromList(colorId));
        }


      });
      return arr;
    } else {
      return this.getColorFromList(id);
    }

  }
  getColorFromList(id: string) {
    if (id === undefined || id.startsWith('rgb') || id.startsWith('#')) {
      return id;
    }
    const split = id.split(':');
    // let color: string = this.colorList[split[0] !== undefined ? split[0] : 'red'];
    let color: string = split[0];
    const opacity = parseFloat(split[1] !== undefined ? split[1] : '1');
    const shade = parseFloat(split[2] !== undefined ? split[2] : '0');
    const mix = parseFloat(split[3] !== undefined ? split[3] : '0');

    const colorsplit = color.split('>');
    if (colorsplit.length > 1) {
      const c1 = this.colorList[colorsplit[0]] !== undefined ? this.colorList[colorsplit[0]] : 'red';
      const c2 = this.colorList[colorsplit[1]] !== undefined ? this.colorList[colorsplit[1]] : 'red';
      color = this.psbc(mix, c1, c2);
    } else {
      color = this.colorList[color] !== undefined ? this.colorList[color] : 'red';
    }


    let themeDarknessMultiplier = this.isDarkTheme ? 0.1 : -0.1;
    if (['primary', 'accent', 'warn', 'foreground', 'background'].indexOf(color) !== -1) {
      themeDarknessMultiplier = 0;
    }
    const needsConversion = color.startsWith('rgb') ? null : 'c';
    let col = this.psbc(shade * 0.8 + themeDarknessMultiplier, color, needsConversion);
    if (opacity !== 1) {
      col = this.rgba(col, opacity);
    }
    return col;
  }






  processColorPaths(element, paths) {
    for (const path of paths) {
      this.traverseByPaths(element, path.split('.'));
    }
  }

  traverseByPaths(obj, paths) {
    paths = paths.slice(0);
    const currentPath = paths.shift();
    const p = obj[currentPath];
    const lastPath = paths.length === 0;
    if (p === undefined) {
      return;
    }
    if (isArray(p)) {
      for (let i = 0; i < p.length; i++) {
        const e = p[i];
        if (lastPath) {
          p[i] = this.getColor(p);
        } else {
          this.traverseByPaths(e, paths);
        }
      }
    } else if (isObject(p)) {
      if (lastPath) {
        obj[currentPath] = this.getColor(p);
      } else {
        this.traverseByPaths(p, paths);
      }
    } else {
      obj[currentPath] = this.getColor(p);
    }

  }


}
