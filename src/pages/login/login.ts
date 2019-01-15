import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { ForgotPage } from '../forgot/forgot';
import { AuthService } from '../services/auth.service';
import { MenuPage } from '../menu/menu';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/finally';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { TranslateService } from '@ngx-translate/core';
import { SocketIo } from '../services/socket.io.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
   loginForm: FormGroup;	
   errorLog:boolean = false;
   user:any = {
	 email: '',
	 password: ''
   };
   serverErr:string = '';    
   emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";  
   count:number = 0;
   showPassword: boolean = false;
    
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              private faio: FingerprintAIO,
              public translate: TranslateService,
              public socket: SocketIo,
              private toastCtrl: ToastController) {
      this.loginForm = new FormGroup({
           loginName: new FormControl('', [<any>Validators.required, <any>Validators.pattern(this.emailPattern)]),
           loginPass: new FormControl('', [<any>Validators.required])
      });
      
    platform.ready().then(() => {
       if (window.localStorage.getItem('logoutEvent') == 'islogout' && !this.navParams.get('logout')) {
          this.touchIdDialog();
       }
       if ( window.localStorage.getItem('tokenLifeEnd') != null ) {
         window.localStorage.removeItem('tokenLifeEnd');
         this.translate.get('session_end').subscribe((val)=>{
           let toast = this.toastCtrl.create({
             message: val,
             duration: 5000,
             position: 'top'
           });
           toast.present();
         });

       }
    });
   }
    
   touchIdDialog(){
    this.faio.isAvailable()
      .then((result: any) => {
         this.faio.show({
          clientId: 'UnitTouchID',
          clientSecret: 'password',
          disableBackup:true,
          localizedFallbackTitle: 'Use Pin',
          localizedReason: 'Please authenticate'
         })
         .then((result: any) => {
           this.navCtrl.setRoot(MenuPage);
         })
         .catch((error: any) => {
           window.localStorage.removeItem('authUniti');
         });
      })
      .catch((error: any) => {
        window.localStorage.removeItem('isCard');
        window.localStorage.removeItem('authUniti');
      });
  }     

  registerPage(){
    this.navCtrl.push(RegisterPage);
  }

  forgotPage(){
	  this.navCtrl.push(ForgotPage);
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

  login(form, user) {
    console.log(user);
    if (form.valid) {
      let loginLoading:any;
      this.translate.get('please_wait').subscribe((val)=>{
        loginLoading = this.loadingCtrl.create({
          content: val
        });
        loginLoading.present();
      });
		  this.authService.authenticate(user).finally(()=>{loginLoading.dismiss();}).subscribe(data => {
         if (data.error == false && data.token) {
           this.navCtrl.setRoot(MenuPage);
         } else {
           this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
             let alertErr = this.alertCtrl.create({
                title: err,
                buttons: ['OK']
             });
             alertErr.present();
           });
         }
      },
      error => {
        this.translate.get('server_alert').subscribe((val)=>{
         let alert = this.alertCtrl.create({
            title: val,
            buttons: ['OK']
         });
         alert.present();
        });
      });
	  }else{
		  this.errorLog = true;
	  }
  }

  hidePasswordToggle() {
    this.showPassword = !this.showPassword;
  }
}
