import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImportPhotosPage } from '../import-photos/import-photos';
import { PhotoListPage } from '../photo-list/photo-list';

@IonicPage()
@Component({
  selector: 'page-import-preview',
  templateUrl: 'import-preview.html',
})
export class ImportPreviewPage {
  checked = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for(let i = 0; i < 4; i++) {
      this.checked[i] = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportPreviewPage');
  }

  clickItem(num: number) {
    for(let i = 0; i < 4; i++) {
      this.checked[i] = false;
    }
    this.checked[num] = true;
  }

  goImportPhoto() {
    this.navCtrl.push(ImportPhotosPage);
  }

  goListPage() {
    this.navCtrl.push(PhotoListPage);
  }
}
