import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportPhotosPage } from './import-photos';

@NgModule({
  declarations: [
    ImportPhotosPage
  ],
  imports: [
    IonicPageModule.forChild(ImportPhotosPage),
  ],
})
export class ImportPhotosPageModule {}
