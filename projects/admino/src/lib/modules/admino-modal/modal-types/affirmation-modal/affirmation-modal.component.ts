import { Component, OnInit, Inject } from "@angular/core";
import {
  MODAL_DATA,
  MODAL_REF,
  AdminoModalComponent,
} from "../../admino-modal/admino-modal.component";

@Component({
  selector: "admino-affirmation-modal",
  templateUrl: "./affirmation-modal.component.html",
  styleUrls: ["./affirmation-modal.component.scss"],
})
export class AffirmationModalComponent implements OnInit {
  data = {
    cancelButtonLabel: "Mégse",
    deleteButtonLabel: "Törlés",
    message: "Biztos?",
  };
  constructor(
    @Inject(MODAL_DATA) public _data: any,
    @Inject(MODAL_REF) public modalRef: AdminoModalComponent
  ) {
    Object.assign(this.data, _data);
  }

  ngOnInit() {}
}
