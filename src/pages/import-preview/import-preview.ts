import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ImportPhotosPage } from '../import-photos/import-photos';
import { PhotoListPage } from '../photo-list/photo-list';
import { PhotoProvider } from '../../providers/photo/photo';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';

const UPLOAD_KEY = 'UPLOAD_FILE';

@IonicPage()
@Component({
  selector: 'page-import-preview',
  templateUrl: 'import-preview.html',
})
export class ImportPreviewPage {
  checked = [];
  count = 0;
  category = ["Before", "After", "Damage", "Documents"];
  selected = 0;
  storedImages = [];
  pendingUploadImages = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public photoService: PhotoProvider,
    private storage: Storage,
    private toast: Toast,
    public events: Events
    ) {

    for(let i = 0; i < 4; i++) {
      this.checked[i] = false;
    }

    // Load all stored images when the app is ready
    this.storage.ready().then(() => {
      this.storage.get(UPLOAD_KEY).then(data => {
        if (data != undefined) {
          this.pendingUploadImages = data;
        }
      });
    });

    this.storedImages = this.photoService.storedImages;
    this.checked[0] = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportPreviewPage');
    setTimeout(() => {
      this.count = this.storedImages.length;
    }, 500);   
  }

  clickItem(num: number) {
    for(let i = 0; i < 4; i++) {
      this.checked[i] = false;
    }
    this.checked[num] = true;
    this.selected = num;
  }

  goImportPhoto() {
    this.navCtrl.push(ImportPhotosPage);
  }

  goListPage() {
    for(let i = 0; i < this.count; i++) {
      this.storedImages[i].category = this.category[this.selected];
      console.log(this.storedImages[i]);
      this.pendingUploadImages.push(this.storedImages[i]);
      this.storage.set(UPLOAD_KEY, this.pendingUploadImages).then(() => {
      });
    }
    this.photoService.uploadPhoto();
    let message = '';
    if(this.count > 1)  message = "Photos queued for upload";
    else message = "Photo queued for upload";
    this.toast.show(message, '1000', 'center').subscribe(
      toast => {
        this.photoService.upload_count += this.count;
        this.events.publish('upload', this.photoService.upload_count);
        this.navCtrl.push(PhotoListPage);
      }
    );
  }
}
