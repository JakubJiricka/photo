import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { PhotoListPage } from '../pages/photo-list/photo-list';
import { PreviewPhotoPage } from '../pages/preview-photo/preview-photo';
import { EditPhotoPage } from '../pages/edit-photo/edit-photo';
import { PhotoProvider } from '../providers/photo/photo';


@NgModule({
  declarations: [
    MyApp,
    PhotoListPage,
    PreviewPhotoPage,
    EditPhotoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularCropperjsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PhotoListPage,
    PreviewPhotoPage,
    EditPhotoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    PhotoProvider
  ]
})
export class AppModule {}
