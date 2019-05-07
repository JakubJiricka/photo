import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { PhotoProvider } from '../../providers/photo/photo';

@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsComponent {

  text: string;
  count;

  constructor(
    public events: Events,
    public photoService: PhotoProvider,
    ) {
    console.log('Hello NotificationsComponent Component');
    this.count = this.photoService.upload_count;
    if (this.count === 0) {
      this.text = '';
    } else {
      if (this.count === 1) {
        this.text = "1 photo left to upload";
      } else {
        this.text = this.count + " photo(s) left to upload";
        console.log(this.text);
      }
    }
    let that = this;
    this.events.subscribe('upload', (upload_count) => {
      that.count = upload_count;
      that.photoService.upload_count = upload_count;   
      if (that.count === 0) {
        that.text = '';
      } else {
        if (that.count === 1) {
          that.text = "1 photo left to upload";
        } else {
          that.text = that.count + " photo(s) left to upload";
        }
      }
    })
  }

}
