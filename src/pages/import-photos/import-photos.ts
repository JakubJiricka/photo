import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { PhotoListPage } from '../photo-list/photo-list';
import { PhotoProvider } from '../../providers/photo/photo';

@IonicPage()
@Component({
  selector: 'page-import-photos',
  templateUrl: 'import-photos.html',
})
export class ImportPhotosPage {

  images = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private photoLibrary: PhotoLibrary,
    public photoService: PhotoProvider,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportPhotosPage');
    let that = this;
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach(function(libraryItem) {
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            that.images.push(libraryItem.thumbnailURL);
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
    .catch(err => console.log('permissions weren\'t granted'));
  }

  goCamera() {
    this.photoService.openCamera = true;
    this.navCtrl.push(PhotoListPage);
  }

  goImportPreview() {

  }
}
