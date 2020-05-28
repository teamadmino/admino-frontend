import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminoKeyboardComponent } from './admino-keyboard/admino-keyboard.component';
import { KeybuttonComponent } from './admino-keyboard/keybutton/keybutton.component';



@NgModule({
  declarations: [AdminoKeyboardComponent, KeybuttonComponent],
  imports: [
    CommonModule
  ],
  exports: [AdminoKeyboardComponent]
})
export class AdminoKeyboardModule { }
