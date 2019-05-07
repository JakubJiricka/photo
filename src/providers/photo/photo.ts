import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
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
  storedImages = [];
  upload_count = 0;
  mytimer : any;
  handle = 0;
  edit = -1;
  multiImages = [];

  constructor(
    public http: HttpClient,
    private storage: Storage,
    public events: Events
    ) {
    console.log('Hello PhotoProvider Provider');
    let that = this;
    this.storage.ready().then(() => {
      this.storage.get(UPLOAD_KEY).then(data => {
        if (data != undefined) {
          this.pendingUploadImages = data;
          that.upload_count = this.pendingUploadImages.length;     
        }
        that.events.publish('upload',this.upload_count);
      });
    });
    setTimeout(() => {
      that.uploadPhoto();
    }, 500);
  }

  apiUrl = 'http://192.168.5.90:3000';

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
      this.http.post(this.apiUrl+'/photo', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });        
    });
  }

  uploadPhoto() {
    let that = this;
    if(this.handle != 0) return;
    this.handle = 1;     
    this.mytimer = setInterval(function(){
      console.log(that.pendingUploadImages.length);
      if(that.pendingUploadImages.length === 0) {
        clearInterval(this.mytimer);
        that.handle = 0;
        return;
      }
      let first = that.pendingUploadImages[0];
      that.addPhoto(first).then((result) => {
        console.log('yes');
        console.log(result);
        that.removeImageAtIndex(0);
      }, (err) => {
        console.log('no');
        console.log(err);
      });
    }, 10000);
  }

  removeImageAtIndex(index) {
    this.pendingUploadImages.splice(index, 1);
    this.storage.set(UPLOAD_KEY, this.pendingUploadImages);
    this.upload_count = this.pendingUploadImages.length;
    this.events.publish('upload',this.upload_count);
  }
}
