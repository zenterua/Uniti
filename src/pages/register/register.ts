import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../../pages/home/home';
import {MenuPage} from "../menu/menu";
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  register:any = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      terms: true
  };
  serverErr:string = '';
  errorRegister:any;    
  registerForm: FormGroup;	
  errorReg:boolean = false;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  showPassword: boolean = false;
  matchingPassword(passwordKey: string, confirmPasswordKey: string) {
	  return (group: FormGroup): {[key: string]: any} => {
		let password = group.get(passwordKey);
		let confirm_password = group.get(confirmPasswordKey);
		if (password.value !== confirm_password.value) {
		  return {        
			mismatchedPasswords: true
		  };
		}
	  }
  }    
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public authService: AuthService, public loadingCtrl: LoadingController, public translate: TranslateService) {
	  this.registerForm = new FormGroup({
         regName: new FormControl('', [<any>Validators.required]),
         regTerms: new FormControl('', [<any>Validators.required]),  
		     regEmail: new FormControl('', [<any>Validators.required, <any>Validators.pattern(this.emailPattern)]),
         regPassword: new FormControl('', [<any>Validators.required]) 
	  });
  }
	
  loginPage(){
	  this.navCtrl.push(LoginPage);
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
    })
    return observable;
  }    
	
  registerUser(form, user){
     if (form.valid){
       let loginRegister:any;     
         this.translate.get('please_wait').subscribe((val)=>{  
             loginRegister = this.loadingCtrl.create({
                content: val
             });
             loginRegister.present(); 
         });
         this.authService.regitration(user)
          .finally(()=>{
             loginRegister.dismiss(); 
          })
          .subscribe(
              data => {
                  if (data['status']=='OK') {
                    this.authService.authenticate(user).subscribe(
                        data => {
                          if (data.error == false && data.token) {
                            this.navCtrl.setRoot(MenuPage);
                          }else{
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
                     this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
                         let alert = this.alertCtrl.create({
                            title: err,
                            buttons: ['OK']
                         });
                         alert.present(); 
                     });
                  }
              },
              error => {
                  let alertErr = this.alertCtrl.create({
                    title: 'It seems you are not connected to the interner. Please connect and try again',
                    buttons: ['OK']
                  });
                  alertErr.present(); 
//                  this.errorRegister = error;
              });
       }else{
           this.errorReg = true;
       } 
   };

  hidPasswordToggle() {
    this.showPassword = !this.showPassword;
  }

}
