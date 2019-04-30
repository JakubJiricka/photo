import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreviewPhotoPage } from '../preview-photo/preview-photo';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoProvider } from '../../providers/photo/photo';

@IonicPage()
@Component({
  selector: 'page-photo-list',
  templateUrl: 'photo-list.html',
})
export class PhotoListPage {
  Arr = Array;
  num: number = 60;
  picture = '';
  storedImages = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public photoService: PhotoProvider
  ) {
    this.storedImages = this.photoService.images;
  }

  ionViewDidEnter() {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoListPage'); 
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //this.croppedImage = 'data:image/jpeg;base64,' + imageData;
      this.goPreviewPage();
    }, (err) => {
      // Handle error
    });
  }

  goPreviewPage() {
    this.navCtrl.push(PreviewPhotoPage);
  }

  goBack() {

  }
}
