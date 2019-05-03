import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
const UPLOAD_KEY = 'UPLOAD_FILE';

class Image {
  image_string: String;
  notes: String;
  category: string;
  fileName: string;
}
/*
  Generated class for the PhotoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PhotoProvider {

  current: string;
  image_string: String;
  notes: String;
  category: string;
  fileName: string;
  images: Array<Image>[];
  pendingUploadImages = [];
  openCamera = false;

  constructor(
    public http: HttpClient,
    private storage: Storage,
    ) {
    console.log('Hello PhotoProvider Provider');
    this.storage.ready().then(() => {
      this.storage.get(UPLOAD_KEY).then(data => {
        if (data != undefined) {
          this.pendingUploadImages = data;
        }
      });
    });
  }

  apiUrl = 'https://your server url';

  getPhotos() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/photo').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  addPhoto(data) {
    return new Promise((resolve, reject) => {      
      this.http.post(this.apiUrl+'/photo', JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });        
    });
  }

  uploadPhoto() {
    let that = this;
    if(this.pendingUploadImages.length > 1) return;
    let mytimer = setInterval(function(){
      if(that.pendingUploadImages.length === 0) clearInterval(mytimer);
      let first = that.pendingUploadImages[0];
      that.addPhoto(first).then((result) => {
        console.log(result);
        that.removeImageAtIndex(0);
      }, (err) => {
        console.log(err);
      });
    }, 10000);
  }

  removeImageAtIndex(index) {
    this.pendingUploadImages.splice(index, 1);
    this.storage.set(UPLOAD_KEY, this.pendingUploadImages);
  }
}
