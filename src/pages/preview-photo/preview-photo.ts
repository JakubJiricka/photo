import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { Storage } from '@ionic/storage';
import { EditPhotoPage } from '../edit-photo/edit-photo';
import { PhotoListPage } from '../photo-list/photo-list';
import { PhotoProvider } from '../../providers/photo/photo';
import { Toast } from '@ionic-native/toast';

const STORAGE_KEY = 'IMAGE_LIST';
const UPLOAD_KEY = 'UPLOAD_FILE';

@IonicPage()
@Component({
  selector: 'page-preview-photo',
  templateUrl: 'preview-photo.html',
})
export class PreviewPhotoPage {

  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  @ViewChild('imageCanvas') canvas: any;
  @ViewChild('header') header: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
  startX: number;
  startY: number;
  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;
  cropperOptions: any;
  croppedImage = null;

  storedImages = [];
  pendingUploadImages = [];

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  canvasPositionY;

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
  imageUrlToCrop = '';
  history = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private storage: Storage,
    public renderer: Renderer,
    public photoService: PhotoProvider,
    private toast: Toast
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
      this.storage.get(UPLOAD_KEY).then(data => {
        if (data != undefined) {
          this.pendingUploadImages = data;
        }
      });
    });

    console.log(this.storedImages);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewPhotoPage');
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = this.plt.height() - this.header.nativeElement.offsetHeight + '';
    this.canvasPositionY = this.header.nativeElement.offsetHeight;

    this.canvasElement.getContext('2d').__proto__.arrow = function (startX, startY, endX, endY, controlPoints) {
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

    this.history.push(this.photoService.current);

    this.loadImageToCanvas(this.photoService.current);
  }

  loadImageToCanvas(src: string) {
    let ctx = this.canvasElement.getContext('2d');
    let img = new Image;
    img.src = src;
    let width = this.canvasElement.width;
    let height = this.canvasElement.height;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, width, height);
    };
  }

  // Tools
  arrowTool() {
    this.isPen = false; this.isText = false; this.isArrow = true; this.inputDisplay = "none"; this.text = '';
    if (this.text != '') this.writeText();
  }

  textTool() {
    this.isPen = false; this.isArrow = false; this.isText = true; this.text = '';
  }

  penTool() {
    this.isText = false; this.isArrow = false; this.isPen = true; this.inputDisplay = "none"; this.text = '';
  }

  cropTool() {
    var dataUrl = this.canvasElement.toDataURL();
    this.imageUrlToCrop = dataUrl;
    this.isCrop = true;
    this.inputDisplay = "none";
    this.text = '';
  }

  undo() {
    if(this.isText) {
      this.writeText();
      this.isText = false;
    }
    if (this.history.length > 0) {
      if (this.history.length === 1) {
        this.photoService.current = this.history[0];
      } else {
        this.history.pop();
        this.photoService.current = this.history[this.history.length - 1];
      }

      this.loadImageToCanvas(this.photoService.current);

    }
  }

  // StartDrawing

  startDrawing(ev) {

    let height = this.canvasElement.height;

    // Put input box and write text
    if (this.isText) {
      if (this.text != '') this.writeText();
      this.inputDisplay = "block";
      this.text = "";
      this.textTop = (ev.touches[0].pageY - height - 50) + "";
      this.textLeft = (ev.touches[0].pageX) + "";
    }

    if (this.isArrow) {
      let ctx = this.canvasElement.getContext('2d');
      this.tempTop = "0";
      ctx.lineWidth = 1;
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";

      //ctx.setTransform(1, 0, 0, 1, 20, 0);
      //ctx.translate(0, 40);
      ctx.beginPath();
      this.startX = ev.touches[0].pageX;
      this.startY = ev.touches[0].pageY - this.canvasPositionY;
    }
    this.saveX = ev.touches[0].pageX;
    this.saveY = ev.touches[0].pageY - this.canvasPositionY;
  }

  moved(ev) {
    if (this.isText) return false;

    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY - this.canvasPositionY;
    let ctx = this.canvasElement.getContext('2d');

    if (this.isArrow) {

    } else if (this.isPen) {
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
    
    if (this.isArrow) {
      let ctx = this.canvasElement.getContext('2d');
      ctx.arrow(this.startX, this.startY - 50, this.saveX, this.saveY - 50, [0, 1, -10, 1, -10, 5]);
      ctx.fill();
    }

    this.dataUrl = this.canvasElement.toDataURL();
    if (!this.isText) this.history.push(this.dataUrl);

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
    this.text = '';
  }

  saveCanvasImage() {
    if (this.isText) this.writeText();
    this.dataUrl = this.canvasElement.toDataURL();
    this.photoService.current = this.dataUrl;
  }

  upload() {
    this.saveCanvasImage();
    this.storeImage();
    this.toast.show('Photo queued for upload', '1000', 'center').subscribe(
      toast => {
        this.photoService.openCamera = true;
        this.navCtrl.push(PhotoListPage);
      }
    );
  }

  storeImage() {
    let saveObj = { image_string: this.dataUrl, notes: this.photoService.notes, category: this.photoService.category, fileName: this.photoService.fileName };
    this.storedImages.push(saveObj);
    this.pendingUploadImages.push(saveObj);
    this.storage.set(UPLOAD_KEY, this.pendingUploadImages).then(() => {
    });
    this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      this.photoService.uploadPhoto();
    });
  }

  removeImageAtIndex(index) {
    this.storedImages.splice(index, 1);
    this.storage.set(STORAGE_KEY, this.storedImages);
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
    this.isCrop = false;
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.loadImageToCanvas(croppedImgB64String);
  }

  goEditPage() {
    this.saveCanvasImage();
    this.navCtrl.push(EditPhotoPage);
  }
  goPhotoListPage() {
    this.navCtrl.push(PhotoListPage);
  }
}
