import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiDataService } from '../services/api.service';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  emailForgot:any = {
      email:''
  };
  forgotForm: FormGroup;	
  errorValid:boolean = false;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  errServer:string;    
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private api: ApiDataService, public translate: TranslateService) {
	  this.forgotForm = new FormGroup({
		 forgotEmail: new FormControl('', [<any>Validators.required, <any>Validators.pattern(this.emailPattern)])
	  });
  }
	
  sendAlert(){
    this.translate.get('email_forgot_send').subscribe((val)=>{  
	 let alert = this.alertCtrl.create({
	   title: val.your_request_send,
	   subTitle: val.check_your_email,
	    buttons: [{
           text: 'OK',
           role: 'cancel',
           handler: () => {
              this.navCtrl.push(LoginPage);
           }
       }]
	 });
	 alert.present(); 
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
    })
    return observable;
  }    
	
  forgotPass(form){
      this.errorValid = false;
      this.errServer = '';
        if (form.valid){
            this.api.forgotPassword(this.emailForgot).subscribe((data)=>{
               if (data.error == false && data.status == 'OK') {
                   this.sendAlert(); 
                }else{
                    this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
                       this.errServer = err; 
                    });
                }
            })
        }else{
           this.errorValid = true;
        } 
   };	

}
