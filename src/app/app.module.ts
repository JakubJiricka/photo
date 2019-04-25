import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { MyApp } from './app.component';
import { PhotoListPage } from '../pages/photo-list/photo-list';

@NgModule({
  declarations: [
    MyApp,
    PhotoListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularCropperjsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PhotoListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
