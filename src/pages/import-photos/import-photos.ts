import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { PhotoListPage } from '../photo-list/photo-list';
import { ImportPreviewPage } from '../import-preview/import-preview';
import { PhotoProvider } from '../../providers/photo/photo';

@IonicPage()
@Component({
  selector: 'page-import-photos',
  templateUrl: 'import-photos.html',
})
export class ImportPhotosPage {

  images = [];
  checked = [];
  toUpload: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private photoLibrary: PhotoLibrary,
    public photoService: PhotoProvider,
  ) {
    for (let i = 0; i < 100; i++) {
      this.checked[i] = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportPhotosPage');
    let that = this;
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach(function (libraryItem) {
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            that.images.push(libraryItem.thumbnailURL);
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
      .catch(err => console.log('permissions weren\'t granted'));
    this.images.push("assets/imgs/photo-list/1.jpg");
    this.images.push("assets/imgs/photo-list/1.jpg");
    this.images.push("assets/imgs/photo-list/1.jpg");
    this.images.push("assets/imgs/photo-list/1.jpg");
  }

  goCamera() {
    this.photoService.openCamera = true;
    this.navCtrl.push(PhotoListPage);
  }

  goImportPreview() {
    for(let i = 0; i < this.images.length; i++) {
      if(this.checked[i]) {
        this.convertToDataURLviaCanvas(this.images[i], "image/jpeg").then((base64) => {
          this.toUpload = base64;
          let saveObj = { image_string: this.toUpload, notes: this.photoService.notes, category: this.photoService.category, fileName: this.photoService.fileName };
          this.photoService.storedImages.push(saveObj);
        });
        setTimeout(function(){}, 100);
      }
    }
    this.navCtrl.push(ImportPreviewPage);
  }

  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.src = url;
    });
  }
}
