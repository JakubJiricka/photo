import { Injectable } from '@angular/core';

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
  constructor() {
    console.log('Hello PhotoProvider Provider');
  }
}
