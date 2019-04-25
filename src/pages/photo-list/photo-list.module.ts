import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoListPage } from './photo-list';

@NgModule({
  declarations: [
    PhotoListPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoListPage),
  ],
})
export class ListPageModule {}
