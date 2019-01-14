import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { ApiDataService } from '../services/api.service';
import { DataUpdateService } from '../services/data.service';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/finally';

declare var cordova: any;

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
    accountForm: FormGroup;
    accountData = {
        first_name: '',
        email: '', 
        avatar: ''
    };
    imgFromLib:any;
    avatarImg:any = '';
    errorValid:boolean = false;
    errServer:string;
    accountChange:any = {};
    avatarImgSmSize:any = '';
    isDataChange:boolean = false;
    
    constructor( public navCtrl: NavController,
								 private camera: Camera,
								 private file: File,
								 public toastCtrl: ToastController,
								 public actionSheetCtrl: ActionSheetController,
								 private api: ApiDataService,
								 public alertCtrl: AlertController,
								 private dataUpdateService:DataUpdateService,
								 public translate: TranslateService,
								 public loadingCtrl: LoadingController ) {
        this.accountForm = new FormGroup({
            accountName: new FormControl('', [<any>Validators.required]),
            accountEmail: new FormControl('', [<any>Validators.required])
        });
        this.setUserData(); 
        let update:any = {isupdate:''}
        this.dataUpdateService.changeMessage(update);
    }
    
    setUserData(){
        this.api.getUserData().subscribe((data)=>{
          if (data.error == false && data.status == 'OK'){    
            this.accountData = {
                first_name: data.first_name,
                email: data.email, 
                avatar:data.avatar
            }
          }
        }) 
    }
    
    alertSend(){
      this.translate.get('data_was_updated').subscribe((val)=>{    
         let alert = this.alertCtrl.create({
           title: val,
           buttons: [{
                   text: 'OK',
                   role: 'cancel',
                   handler: () => {
                      this.setUserData();
                      this.isDataChange = true;
                      let update:any = {isupdate:'updated'}
                      this.dataUpdateService.changeMessage(update);
                   }
                 }]
         });
         alert.present();
      });
    }
    
    alertEmailSend(){
      this.translate.get('data_was_updated_confirm').subscribe((val)=>{ 
         let alertEmail = this.alertCtrl.create({
           title: val.txt1,
           subTitle:val.txt2,    
           buttons: [{
               text: 'OK',
               role: 'cancel',
               handler: () => {
                 this.saveData();
               }
              },
              {
               text: val.txt3,
               role: 'cancel'
              }   
             ]
         });
         alertEmail.present();
      });  
    }
    
    serverErrorFunc(error){ 
        let observable = new Observable(observer => {
          this.translate.get('error_server').subscribe((val)=>{
            for (const key of Object.keys(val)) {
               if (key == error) {
                  observer.next(val[key]);
               }
            }
          })
        });
        return observable;
    }
    
    
    saveData(){
        this.accountChange = {
            first_name: this.accountData.first_name,
            email: this.accountData.email,
            avatar: this.avatarImgSmSize !== '' ? this.avatarImgSmSize : this.accountData.avatar
        };
        this.api.updateUserData(this.accountChange).subscribe((data)=>{
           if (data.error == false && data.status == 'OK') {
                this.alertSend();
            }else{
                this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
                   this.errServer = err; 
                }); 
            }
        }); 
    }
    
    changeData(form){
	  let saveLoad;
      this.errorValid = false;
      this.errServer = '';
        if (form.valid){
		this.translate.get('please_wait').subscribe((val)=>{
          saveLoad = this.loadingCtrl.create({
            content: val
          });
          saveLoad.present();
        });
		this.api.getUserData()
		  .finally(()=>{
			  saveLoad.dismiss();
		  })
		  .subscribe((data)=>{
		  if (data.error == false && data.status == 'OK'){
			  if (data.email !== this.accountData.email) {
				   this.alertEmailSend();
			  }else{
				   this.saveData();
			  }
		  }
		});
        }else{
           this.errorValid = true;
        }
    }
    
    private createFileName() {
	  var d = new Date(),
	  n = d.getTime(),
	  newFileName =  n + ".jpg";
	  return newFileName;
    }
	
    private copyFileToLocalDir(namePath, currentName, newFileName) {
	  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
		this.imgFromLib = newFileName;
	  }, error => {
	  });
	}
    
	public pathForImage(img) {
	  if (img === null) {
		return '';
	  } else {
		return cordova.file.dataDirectory + img;
	  }
	}

	public takePicture(sourceType) {
          let optionsCam = {
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              saveToPhotoAlbum: false,
              allowEdit: true,
              sourceType: sourceType      
	      };
          this.camera.getPicture(optionsCam).then((imagePath) => {
              this.avatarImg = 'data:image/jpeg;base64,' + imagePath;
              this.generateFromImage(this.avatarImg, 111, 111, 0.5, data => {
                  this.avatarImgSmSize = data;
                  console.log(data);
                  this.accountData.avatar = this.avatarImgSmSize;
              });
              let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
              let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
              
          }, (err) => {
              this.translate.get('no_img').subscribe((val)=>{ 
                this.presentToast(val);
              });
          });
    }
    
    generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
        var canvas: any = document.createElement("canvas");
        var image = new Image();
        image.onload = () => {
          var width = image.width;
          var height = image.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, width, height);
          var dataUrl = canvas.toDataURL('image/jpeg', quality);

          callback(dataUrl)
        };
        image.src = img;
    }
    
    private presentToast(text) {
	  let toast = this.toastCtrl.create({
		message: text,
		duration: 3000,
		position: 'top' 
	  });
	  toast.present();
	}
	
	deleteAvatar(){
		let removeAvatar;
		this.translate.get('please_wait').subscribe((val)=>{     
          removeAvatar = this.loadingCtrl.create({
            content: val
          });
          removeAvatar.present(); 
        });	 
		this.api.deleteAvatar()
		  .finally(()=>{
			  removeAvatar.dismiss(); 
		  })
		  .subscribe((data)=>{
		  if (data.status == 'OK' && data.error == false) {
			  console.log(data);
			  this.saveData();
		  }
		 });
	}
    
    openActionSheet() {
     this.translate.get('avatar_img').subscribe((val)=>{     
	   let actionSheet = this.actionSheetCtrl.create({
		 title: val.txt1,
		 buttons: [
		   {
			 text: val.txt2,
			 handler: () => {
				 this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);}
		   },
		   {
			 text: val.txt3,
			 handler: () => {
				 this.takePicture(this.camera.PictureSourceType.CAMERA);}
		   },
           {
			 text: val.txt5,
             role:'destructive',
			 handler: () => {
				 this.deleteAvatar();
             }
		   },     
		   {
			 text: val.txt4,
			 role: 'cancel'
           }]
	   });
	   actionSheet.present();
     });
	}
}
