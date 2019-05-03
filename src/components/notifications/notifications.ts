import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsComponent {

  text: string;
  count = 0;

  constructor(public events: Events) {
    console.log('Hello NotificationsComponent Component');
    this.events.subscribe('upload', (upload_count) => {
        this.count = upload_count;
        if(this.count===0) {
          this.text = '';
        }else {
          if(this.count === 1) {
            this.text = "1 photo left to upload";
          }else {
            this.text = this.count + " photo(s) left to upload";
          }      
        }
    });    
  }

}
