import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminoTooltipService {
  currentId = null;
  currentContent = null;
  currentStyle = null;

  tooltipChange: Subject<any> = new Subject();

  constructor() { }


  set(id: string, content: any, style: any) {
    this.currentId = id;
    this.currentContent = content;
    this.currentStyle = style;
    this.tooltipChange.next();
  }

  remove(id: string) {
    if (this.currentId === id) {
      this.currentId = null;
      this.currentContent = null;
      this.currentStyle = null;
      this.tooltipChange.next();
    }
  }

}
