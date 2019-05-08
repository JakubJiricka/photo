import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ImportPhotosPage } from '../import-photos/import-photos';
import { PhotoListPage } from '../photo-list/photo-list';
import { PhotoProvider } from '../../providers/photo/photo';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';

const UPLOAD_KEY = 'UPLOAD_FILE';
const STORAGE_KEY = 'IMAGE_LIST';

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
  tempImages = [];
  storedImages = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public photoService: PhotoProvider,
    private storage: Storage,
    private toast: Toast,
    public events: Events
  ) {

    for (let i = 0; i < 4; i++) {
      this.checked[i] = false;
    }

    this.tempImages = this.photoService.multiImages;
    this.checked[0] = true;
    // Load all stored images when the app is ready
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != undefined) {
          this.storedImages = data;
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportPreviewPage');
    setTimeout(() => {
      this.count = this.tempImages.length;
    }, 100);
  }

  clickItem(num: number) {
    for (let i = 0; i < 4; i++) {
      this.checked[i] = false;
    }
    this.checked[num] = true;
    this.selected = num;
  }

  goImportPhoto() {
    //this.navCtrl.push(ImportPhotosPage);
    //this.photoService.openGallery = true;
    this.navCtrl.push(PhotoListPage);
  }

  goListPage() {
    for (let i = 0; i < this.count; i++) {
      this.tempImages[i].category = this.category[this.selected];
      this.storedImages.push(this.tempImages[i]);
      this.photoService.pendingUploadImages.push(this.tempImages[i]);
    }
    this.storage.set(UPLOAD_KEY, this.photoService.pendingUploadImages).then(() => {
      this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
        let message = '';
        if (this.count > 1) message = "Photos queued for upload";
        else message = "Photo queued for upload";
        this.toast.show(message, '1000', 'center').subscribe(
          toast => {
          }
        );
        this.photoService.upload_count += this.count;
        this.events.publish('upload', this.photoService.upload_count);
        this.navCtrl.push(PhotoListPage);
        return false;
      })
    });
  }
}
