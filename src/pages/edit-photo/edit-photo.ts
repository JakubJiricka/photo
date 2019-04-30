import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoProvider } from '../../providers/photo/photo';
import { PreviewPhotoPage } from '../preview-photo/preview-photo';

@IonicPage()
@Component({
  selector: 'page-edit-photo',
  templateUrl: 'edit-photo.html',
})
export class EditPhotoPage {

  current: string;
  private metaData = {
    notes: '',
    category: '',
    fileName: '',
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public photoService: PhotoProvider
    ) {
  }

  ionViewDidLoad() {
    this.current = this.photoService.current;
    console.log('ionViewDidLoad EditPhotoPage');
  }

  goPreviewPage(flag: Boolean) {
    if(flag) {
      this.photoService.notes = this.metaData.notes;
      this.photoService.category = this.metaData.category;
      this.photoService.fileName = this.metaData.fileName;
    }    
    this.navCtrl.push(PreviewPhotoPage);
  }

}
