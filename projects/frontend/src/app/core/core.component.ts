import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AdminoThemeService,
  AdminoApiService,
  AdminoSiteService,
} from "admino";
import { Observable } from "rxjs";

@Component({
  selector: "frontend-core",
  templateUrl: "./core.component.html",
  styleUrls: ["./core.component.scss"],
})
export class CoreComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
