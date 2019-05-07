import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { LongPressModule } from 'ionic-long-press';
import { HttpClientModule } from '@angular/common/http';
import { CDVPhotoLibraryPipe } from './cdvphotolibrary.pipe';
import { CameraPreview } from '@ionic-native/camera-preview';

import { MyApp } from './app.component';
import { PhotoListPage } from '../pages/photo-list/photo-list';
import { PreviewPhotoPage } from '../pages/preview-photo/preview-photo';
import { EditPhotoPage } from '../pages/edit-photo/edit-photo';
import { ImportPhotosPage } from '../pages/import-photos/import-photos';
import { ImportPreviewPage } from '../pages/import-preview/import-preview';
import { PhotoProvider } from '../providers/photo/photo';
import { Toast } from '@ionic-native/toast';
import { ImagePicker } from '@ionic-native/image-picker';

import {NotificationsComponent} from '../components/notifications/notifications';



@NgModule({
  declarations: [
    MyApp,
    PhotoListPage,
    PreviewPhotoPage,
    EditPhotoPage,
    ImportPhotosPage,
    ImportPreviewPage,
    CDVPhotoLibraryPipe,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularCropperjsModule,
    LongPressModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PhotoListPage,
    PreviewPhotoPage,
    EditPhotoPage,
    ImportPhotosPage,
    ImportPreviewPage,
    NotificationsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    PhotoProvider,
    Camera,
    CameraPreview,
    Toast,
    ImagePicker
  ]
})
export class AppModule {}
