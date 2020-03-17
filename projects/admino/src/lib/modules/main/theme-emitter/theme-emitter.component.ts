import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminoThemeService } from '../../../services/theme.service';

@Component({
  selector: 'admino-theme-emitter',
  templateUrl: './theme-emitter.component.html',
  styleUrls: ['./theme-emitter.component.scss']
})
export class ThemeEmitterComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<null> = new Subject();

  @ViewChild('multi', { static: true }) multiElement: ElementRef;
  @ViewChild('primary', { static: true }) primaryElement: ElementRef;
  @ViewChild('accent', { static: true }) accentElement: ElementRef;
  @ViewChild('warn', { static: true }) warnElement: ElementRef;
  @ViewChild('bg', { static: true }) bgElement: ElementRef;
  @ViewChild('fg', { static: true }) fgElement: ElementRef;
  @ViewChild('primaryContrast', { static: true }) primaryContrastElement: ElementRef;
  @ViewChild('accentContrast', { static: true }) accentContrastElement: ElementRef;
  @ViewChild('warnContrast', { static: true }) warnContrastElement: ElementRef;



  constructor(public ts: AdminoThemeService, private cd: ChangeDetectorRef) {

  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.ts.updateColors.pipe(takeUntil(this.ngUnsubscribe)).subscribe((route: string[]) => {
      this.updateColors();
    });
  }

  updateColors() {
    this.ts.colors = getComputedStyle(this.multiElement.nativeElement, ':after').content.replace(/"/g, '').split(';');
    this.ts.colors = this.ts.colors.map((col) => {
      const found = colors[col.toLowerCase()];
      if (found) {
        return this.hexToRgb(found);
      } else {
        return this.hexToRgb(col);
      }
    });
    this.ts.primaryColor = getComputedStyle(this.primaryElement.nativeElement).color;
    this.ts.accentColor = getComputedStyle(this.accentElement.nativeElement).color;
    this.ts.warnColor = getComputedStyle(this.warnElement.nativeElement).color;
    this.ts.bgColor = getComputedStyle(this.bgElement.nativeElement).color;
    this.ts.fgColor = getComputedStyle(this.fgElement.nativeElement).color;
    this.ts.primaryContrast = getComputedStyle(this.primaryContrastElement.nativeElement).color;
    this.ts.accentContrast = getComputedStyle(this.accentContrastElement.nativeElement).color;
    this.ts.warnContrast = getComputedStyle(this.warnContrastElement.nativeElement).color;


    this.ts.colorList.primary = this.ts.primaryColor;
    this.ts.colorList.accent = this.ts.accentColor;
    this.ts.colorList.warn = this.ts.warnColor;
    this.ts.colorList.background = this.ts.bgColor;
    this.ts.colorList.foreground = this.ts.fgColor;
    this.ts.colorList.primaryContrast = this.ts.primaryContrast;
    this.ts.colorList.accentContrast = this.ts.accentContrast;
    this.ts.colorList.warnContrast = this.ts.warnContrast;


    this.ts.themeUpdated.next();

  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')' : null;
  }
}

const colors = {
  aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff', aquamarine: '#7fffd4', azure: '#f0ffff',
  beige: '#f5f5dc', bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd', blue: '#0000ff', blueviolet: '#8a2be2', brown: '#a52a2a', burlywood: '#deb887',
  cadetblue: '#5f9ea0', chartreuse: '#7fff00', chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed', cornsilk: '#fff8dc', crimson: '#dc143c', cyan: '#00ffff',
  darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b', darkgray: '#a9a9a9', darkgreen: '#006400', darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f',
  darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000', darksalmon: '#e9967a', darkseagreen: '#8fbc8f', darkslateblue: '#483d8b', darkslategray: '#2f4f4f', darkturquoise: '#00ced1',
  darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff', dimgray: '#696969', dodgerblue: '#1e90ff',
  firebrick: '#b22222', floralwhite: '#fffaf0', forestgreen: '#228b22', fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff', gold: '#ffd700', goldenrod: '#daa520', gray: '#808080', green: '#008000', greenyellow: '#adff2f',
  honeydew: '#f0fff0', hotpink: '#ff69b4',
  indianred: '#cd5c5c', indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
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