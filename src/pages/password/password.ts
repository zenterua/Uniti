import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiDataService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
  passwordForm:FormGroup;
  errorValid:boolean = false;
  pass:any = {};   
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
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private api: ApiDataService, public translate: TranslateService ) {
	  this.passwordForm = new FormGroup({
			oldPass: new FormControl('', [<any>Validators.required]),
			newPass: new FormControl('', [<any>Validators.required]),
			newConfPass: new FormControl('', [<any>Validators.required])
	  }, this.matchingPassword('newPass', 'newConfPass'));
	  this.pass = {
		 password:'',
		 newpass:'',
		 confPass:''
	  } 
  }
	
  alertSend(){
   this.translate.get('password_was_changed').subscribe((val)=>{      
	 let alert = this.alertCtrl.create({
	   title: val,
	   buttons: ['OK']
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
	
  changePassword(form){
     this.errorValid = false;  
	  if (form.valid){
         this.api.changeUserPass(this.pass).subscribe((data)=>{
            if (data.error == false && data.status == 'OK') {
               this.alertSend(); 
            }else{
               this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
                   this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
                       let activateErr = this.alertCtrl.create({
                          title: err,
                          buttons: ['OK']
                       });
                       activateErr.present();
                  });
               });    
            }
         });
	  }else{
		 this.errorValid = true;  
	  }
  }	

}
