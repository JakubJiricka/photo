import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform, normalizeURL } from 'ionic-angular';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { EditPhotoPage } from '../edit-photo/edit-photo';
import { PhotoListPage } from '../photo-list/photo-list';
import { PhotoProvider } from '../../providers/photo/photo';

const STORAGE_KEY = 'IMAGE_LIST';

@IonicPage()
@Component({
  selector: 'page-preview-photo',
  templateUrl: 'preview-photo.html',
})
export class PreviewPhotoPage {

  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  @ViewChild('imageCanvas') canvas: any;
  //@ViewChild('tempCanvas') tempCanvas: any;
  canvasElement: any;
  //tempCanvasElement: any;
  saveX: number;
  saveY: number;
  startX: number;
  startY: number;
  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;
  cropperOptions: any;
  croppedImage = null;

  storedImages = [];

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;

  isCrop = false;
  selectedColor = "green";
  dataUrl = '';
  isPen = true;
  isText = false;
  isArrow = false;
  inputDisplay = "none";
  textTop = "0";
  textLeft = "0";
  text = '';
  tempTop = "unset";
  isDown = false;
  x1;
  y1;
  w;
  h;
  imageUrlToCrop = '';
  history = [];
  initialImage = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private plt: Platform,
    private file: File, 
    private storage: Storage,
    public renderer: Renderer,
    public photoService: PhotoProvider
    ) {
      this.cropperOptions = {
        dragMode: 'crop',
        aspectRatio: 1,
        autoCrop: true,
        movable: true,
        zoomable: true,
        scalable: true,
        autoCropArea: 0.8,
      };
  
      // Load all stored images when the app is ready
      this.storage.ready().then(() => {
        this.storage.get(STORAGE_KEY).then(data => {
          if (data != undefined) {
            this.storedImages = data;
          }
        });
      });

      this.photoService.images = this.storedImages;
      console.log(this.photoService.images);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewPhotoPage');
    this.initialImage = "assets/imgs/photo-list/1.jpg";
    this.photoService.current = this.initialImage;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 300;
    
    this.canvasElement.getContext('2d').__proto__.arrow = function(startX, startY, endX, endY, controlPoints) {
      var dx = endX - startX;
      var dy = endY - startY;
      var len = Math.sqrt(dx * dx + dy * dy);
      var sin = dy / len;
      var cos = dx / len;
      var a = [];
      let i, x, y;
      a.push(0, 0);
      
      for (i = 0; i < controlPoints.length; i += 2) {
        x = controlPoints[i];
        y = controlPoints[i + 1];
        a.push(x < 0 ? len + x : x, y);
      }
      a.push(len, 0);
      for (i = controlPoints.length; i > 0; i -= 2) {
       x = controlPoints[i - 2];
       y = controlPoints[i - 1];
        a.push(x < 0 ? len + x : x, -y);
      }
      a.push(0, 0);
      for (i = 0; i < a.length; i += 2) {
        x = a[i] * cos - a[i + 1] * sin + startX;
        y = a[i] * sin + a[i + 1] * cos + startY;
        if (i === 0) this.moveTo(x, y);
        else this.lineTo(x, y);
      }
    };

    this.history.push(this.initialImage);

    this.loadImageToCanvas(this.initialImage);
  }

  loadImageToCanvas(src: string) {
    let ctx = this.canvasElement.getContext('2d');
    let img = new Image;
    img.src = src;
    let width = this.canvasElement.width;
    img.onload = function() {
      ctx.drawImage(img, 0, 0, width, 300);
    };
  }

  // Tools
  arrowTool() {
    this.isPen=false; this.isText; this.isArrow=true; this.inputDisplay = "none";
  }

  textTool() {
    this.isPen=false; this.isArrow=false; this.isText=true;
  }

  penTool() {
    this.isText=false; this.isArrow=false; this.isPen=true; this.inputDisplay = "none";
  }

  cropTool() {
    var dataUrl = this.canvasElement.toDataURL();
    this.imageUrlToCrop = dataUrl;
    this.isCrop = true;
    this.inputDisplay = "none";
  }

  undo() {
    this.inputDisplay = "none";
    console.log(this.history);
    if(this.history.length > 0) {
      if(this.history.length === 1){
        this.photoService.current = this.history[0];        
      }else {
        this.history.pop();
        this.photoService.current = this.history[this.history.length - 1];
      }

      this.loadImageToCanvas(this.photoService.current);
      
    }
  }

  // StartDrawing

  startDrawing(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();
    
    console.log(ev.touches[0].pageX, ev.touches[0].pageY);

    // Put input box and write text
    if(this.isText) {
      if(this.text != '') this.writeText();
      this.inputDisplay = "block";
      this.text = "";
      this.textTop = (ev.touches[0].pageY - 350) + "";
      this.textLeft = (ev.touches[0].pageX) + "";
    }

    if(this.isArrow) {
      let ctx = this.canvasElement.getContext('2d');
      this.tempTop = "0";
      ctx.lineWidth = 1;
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";

      ctx.setTransform(1, 0, 0, 1, 20, 0);
      ctx.translate(0, 40);
      ctx.beginPath();
      this.startX = ev.touches[0].pageX;
      this.startY = ev.touches[0].pageY - canvasPosition.y;
    }
    this.saveX = ev.touches[0].pageX;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    if(this.isText) return false;
    
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY - canvasPosition.y;
    let ctx = this.canvasElement.getContext('2d');

    if(this.isArrow) {
      // ctx.clearRect(0, 0,ctx.width, 300);
      // ctx.arrow(this.startX, this.startY, currentX, currentY, [0, 1, -10, 1, -10, 5]);
      // ctx.fill();
    } else if(this.isPen) {
      ctx.lineJoin = 'round';
      ctx.strokeStyle = this.selectedColor;
      ctx.lineWidth = 5;

      ctx.beginPath();
      
      ctx.moveTo(this.saveX, this.saveY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();

      ctx.stroke();
    }    

    this.saveX = currentX;
    this.saveY = currentY;
  }

  endDrawing() {
    this.dataUrl = this.canvasElement.toDataURL();
    if(!this.isText) this.history.push(this.dataUrl);
    if(this.isArrow) {
      let ctx = this.canvasElement.getContext('2d');
      ctx.arrow(this.startX, this.startY - 50, this.saveX, this.saveY - 50, [0, 1, -10, 1, -10, 5]);
      ctx.fill();
    } 
    
  }

  // Write Text
  writeText() {
    this.inputDisplay = "none";
    let ctx = this.canvasElement.getContext('2d');

    ctx.font = "20px Georgia";

    ctx.fillStyle = this.selectedColor;
    ctx.fillText(this.text, this.saveX, this.saveY + 20);
    this.dataUrl = this.canvasElement.toDataURL();
    this.history.push(this.dataUrl);
  }  

  saveCanvasImage() {
    if(this.isText) this.writeText();
    this.dataUrl = this.canvasElement.toDataURL();
    //console.log(this.history);
  }

  upload() {
    this.saveCanvasImage();
    this.storeImage();
  }

  storeImage() {
    let saveObj = { image_string: this.dataUrl, notes: this.photoService.notes, category: this.photoService.category, fileName: this.photoService.fileName };
    this.storedImages.push(saveObj);
    this.photoService.images = this.storedImages;
    console.log(this.storedImages);
    this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      setTimeout(() =>  {
        this.content.scrollToBottom();
      }, 500);
    });
  }
   
  removeImageAtIndex(index) {
    let removed = this.storedImages.splice(index, 1);
    this.photoService.images = this.storedImages;
    // this.file.removeFile(this.file.dataDirectory, removed[0].img).then(res => {
    // }, err => {
    //   console.log('remove err; ' ,err);
    // });
    this.storage.set(STORAGE_KEY, this.storedImages);
  }
   
  getImagePath(imageName) {
    let path = this.file.dataDirectory + imageName;
    // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
    path = normalizeURL(path);
    return path;
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
   
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
   
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
   
      var byteArray = new Uint8Array(byteNumbers);
   
      byteArrays.push(byteArray);
    }
   
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  clear() {
    this.angularCropper.cropper.clear();
  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }

  save() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.loadImageToCanvas(croppedImgB64String);
    this.isCrop = false;
  }

  goEditPage() {
    this.navCtrl.push(EditPhotoPage);
  }
  goPhotoListPage() {
    this.navCtrl.push(PhotoListPage);
  }
}
