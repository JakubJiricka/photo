import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPhotoPage } from './edit-photo';

@NgModule({
  declarations: [
    EditPhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPhotoPage),
  ],
})
export class EditPhotoPageModule {}
