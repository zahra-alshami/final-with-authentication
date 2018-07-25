import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PresentationRoomPage } from './presentation-room';

@NgModule({
  declarations: [
    PresentationRoomPage,
  ],
  imports: [
    IonicPageModule.forChild(PresentationRoomPage),
  ],
})
export class PresentationRoomPageModule {}
