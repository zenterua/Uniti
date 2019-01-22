import {Component, OnInit} from '@angular/core';
import { ViewController, AlertController, App, NavController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ApiDataService } from '../services/api.service';
import { DataUpdateService } from '../services/data.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  templateUrl: 'credit.html'
})

export class ModalPayCard implements OnInit {
      paycardForm: FormGroup;
	    errorCard:boolean = false;
      monthOption:Array<any>;
      yearOption:Array<any> = [];
      currentYear:any = new Date().getFullYear();
      cardError:string;
      card:any = {};
    
	  constructor(public viewCtrl: ViewController,
								public alertCtrl: AlertController,
								private api: ApiDataService,
								public app: App,
								public navCtrl: NavController,
								private dataUpdateService:DataUpdateService,
					      public translate: TranslateService ) {}


    dismiss() {
	  	this.viewCtrl.dismiss();
	  }

	  ngOnInit(){
      this.card = {
        card_number:'',
        card_month:'01',
        card_year: this.currentYear,
        card_code:''
      };
      this.paycardForm = new FormGroup({
        cardNumber: new FormControl('', [<any>Validators.required]),
        cardMonth: new FormControl('', [<any>Validators.required]),
        cardYear: new FormControl('', [<any>Validators.required]),
        cardCVV: new FormControl('', [<any>Validators.required]),
      });
      this.translate.get('month_sh').subscribe((val)=>{
        this.monthOption = [
          {name:val.Jan, val:'01'},
          {name:val.Feb, val:'02'},
          {name:val.Mar, val:'03'},
          {name:val.Apr, val:'04'},
          {name:val.May, val:'05'},
          {name:val.Jun, val:'06'},
          {name:val.Jul, val:'07'},
          {name:val.Aug, val:'08'},
          {name:val.Sep, val:'09'},
          {name:val.Oct, val:'10'},
          {name:val.Nov, val:'11'},
          {name:val.Dec, val:'12'}
        ];
      });
      for (let i = 0; i < 15; i++){
        this.yearOption.push({val:this.currentYear + i});
      }
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
		addPayCard(form){
			if (form.valid) {
				this.cardError = '';
				window.localStorage.removeItem('isCard');
				this.api.removeExistCreditCard().subscribe((data)=>{
				if (data.error == true) {
					let removeCard:any = {cardupdate:''}
					this.dataUpdateService.changeMessage(removeCard);
				}
				this.api.addNewCreditCard(this.card).subscribe((data)=>{
				  console.log(data);
					if(data.status == 'OK' && data.error == false) {
						this.translate.get('your_card_was_added').subscribe((val)=>{
							let cardAdd = this.alertCtrl.create({
								title: val,
								buttons: [{
									text: 'OK',
									role: 'cancel',
									handler: () => {
										window.localStorage.setItem('isCard', 'active');
										let update:any = {cardupdate:'updated'}
										this.dataUpdateService.changeMessage(update);
										this.viewCtrl.dismiss();
									}
								}]
							 });
							cardAdd.present();
						});
					 } else {
						 this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
								this.cardError = err;
							 });
						 }
					});
				});
			} else {
					this.errorCard = true;
				}
		}
}
