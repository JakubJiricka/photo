import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoListPage } from '../photo-list/photo-list';
import { ImportPreviewPage } from '../import-preview/import-preview';
import { PhotoProvider } from '../../providers/photo/photo';
import { Toast } from '@ionic-native/toast';

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
    public photoService: PhotoProvider,
    private toast: Toast,
  ) {
    for (let i = 0; i < 100; i++) {
      this.checked[i] = false;
    }
    this.images = this.photoService.multiImages;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportPhotosPage');
  }

  goListPage(flag) {
    this.photoService.openCamera = flag;
    this.navCtrl.push(PhotoListPage);
  }

  goImportPreview() {
    let count = 0;
    for(let i = 0; i < this.images.length; i++) {
      if(this.checked[i]) {
        count++;
        this.toUpload = this.images[i];
        let saveObj = { image_string: this.toUpload, notes: this.photoService.notes, category: this.photoService.category, fileName: this.photoService.fileName };
        this.photoService.storedImages.push(saveObj);
      }
    }
    if(count === 0) {
      this.toast.show('No image selected', '1000', 'center').subscribe(
        toast => {
        }
      );
    }else {
      this.navCtrl.push(ImportPreviewPage);
    }    
  }

  // convertToDataURLviaCanvas(url, outputFormat) {
  //   return new Promise((resolve, reject) => {
  //     let img = new Image();
  //     img.crossOrigin = 'Anonymous';
  //     img.onload = () => {
  //       let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
  //         ctx = canvas.getContext('2d'),
  //         dataURL;
  //       canvas.height = img.height;
  //       canvas.width = img.width;
  //       ctx.drawImage(img, 0, 0);
  //       dataURL = canvas.toDataURL(outputFormat);
  //       resolve(dataURL);
  //       canvas = null;
  //     };
  //     img.src = url;
  //   });
  // }
}
