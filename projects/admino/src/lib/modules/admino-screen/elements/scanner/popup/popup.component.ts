import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, HostListener } from "@angular/core";
import { ScannerService } from "../scanner.service";

@Component({
  selector: "admino-popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.scss"],
})
export class PopupComponent implements OnInit, AfterViewInit {
  @Input() popupData: any;

  @ViewChild("btnRef", { static: true, read: ElementRef }) btnRef: ElementRef;
  @HostListener("keydown", ["$event"]) keyDown(e) {
    if (e.key === "Enter") {
      this.close();
      e.preventDefault();
    } else if (e.key === "Escape") {
      this.close();
      e.preventDefault();
    }
  }
  constructor(private scannerService: ScannerService) {}

  ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.btnRef.nativeElement.focus();
    });
  }
  handleClick() {
    this.close();
  }
  close() {
    this.scannerService.popups.splice(this.scannerService.popups.indexOf(this.popupData), 1);
    this.scannerService.popupClosedEvent.next();
  }
}
