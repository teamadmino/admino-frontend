import { KeyboardKey } from "./../../admino-keyboard.interface";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";

@Component({
  selector: "admino-keybutton",
  templateUrl: "./keybutton.component.html",
  styleUrls: ["./keybutton.component.scss"],
})
export class KeybuttonComponent implements OnInit, OnDestroy {
  @Input() config: KeyboardKey;
  @Output() clickEvent: EventEmitter<KeyboardKey> = new EventEmitter();

  _manualClick = false;

  @HostBinding("style.font-size") private fontSize = "1rem";

  timeoutHelper;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fontSize = this.config.labelSize
      ? this.config.labelSize + "rem"
      : "1rem";
  }

  manualClick() {
    this._manualClick = true;
    this.cd.markForCheck();
    this.timeoutHelper = setTimeout((params) => {
      this._manualClick = false;
      this.cd.detectChanges();
    }, 10);
  }

  clicked() {
    this.clickEvent.emit(this.config);
  }

  ngOnDestroy() {
    if (this.timeoutHelper) {
      clearTimeout(this.timeoutHelper);
    }
  }
}
