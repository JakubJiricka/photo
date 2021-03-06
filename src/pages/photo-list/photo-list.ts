import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PreviewPhotoPage } from '../preview-photo/preview-photo';
import { ImportPhotosPage } from '../import-photos/import-photos';
import { ImportPreviewPage } from '../import-preview/import-preview';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoProvider } from '../../providers/photo/photo';
import { Storage } from '@ionic/storage';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

const STORAGE_KEY = 'IMAGE_LIST';

@IonicPage()
@Component({
  selector: 'page-photo-list',
  templateUrl: 'photo-list.html',
})
export class PhotoListPage {
  @ViewChild('header') header: any;
  Arr = Array;
  num: number = 60;
  picture = '';
  storedImages = [];
  isLongPress = false;
  isDelete = false;
  index;
  photos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private storage: Storage,
    public photoService: PhotoProvider,
    public events: Events,
    private imagePicker: ImagePicker,
    private plt: Platform,
  ) {

    // Load all stored images when the app is ready
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != undefined) {
          this.storedImages = data;
        }
      });
    });

    this.photoService.storedImages = [];

    //Load all images from server

    // this.photoService.getPhotos()
    // .then(data => {
    //   this.photos = data;
    //   console.log(this.photos.length);
    // });

    //this.photoService.images = this.storedImages;
  }



  ionViewDidEnter() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoListPage');

    if (this.photoService.openCamera) {
      this.photoService.openCamera = false;
      this.openCamera();
    }

    if (this.photoService.openGallery) {
      this.photoService.openGallery = false;
      this.goImportPhotos();
    }
  }

  openCamera() {
    this.photoService.edit = -1;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.picture = 'data:image/jpeg;base64,' + imageData;
      this.goPreviewPage(this.picture, -1);
    }, (err) => {
      // Handle error
    });
  }

  goPreviewPage(str: string, index: number) {
    if (!this.isLongPress) {
      if (str != "new") {
        this.photoService.current = str;
        this.photoService.edit = index;
        this.navCtrl.push(PreviewPhotoPage);
      } else {
        this.openCamera();
      }
    }
    this.isLongPress = false;
  }

  goBack() {
    this.navCtrl.push(LoginPage);
  }

  pressed(i) {
    this.index = i;
    this.isLongPress = true;
    this.isDelete = true;
  }

  active() {
  }

  released() {
  }

  delete() {
    this.storedImages.splice(this.index, 1);
    this.storage.set(STORAGE_KEY, this.storedImages);
    this.isDelete = false;
  }

  goImportPhotos() {
    let height = this.plt.height() - this.header.nativeElement.offsetHeight
    console.log(this.plt.width() + '-' + height);
    this.photoService.multiImages = [];
    let that = this;
    let options: ImagePickerOptions = {
      quality: 100,
      width: this.plt.width(),
      height: height,
      maximumImagesCount: 15,
      outputType: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        let saveObj = { image_string: 'data:image/jpeg;base64,' + results[i], notes: '', category: '', fileName: '' };
        that.photoService.multiImages.push(saveObj);
      }
      console.log(that.photoService.multiImages.length);
      this.navCtrl.push(ImportPreviewPage);
    }, (err) => { });
  }
}
