import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiDataService } from '../services/api.service';
import { ModalPayCard } from '../credit/credit';
import { DataUpdateService } from '../services/data.service';

@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
    cardForm: FormGroup;
    card:any = {};
    cardExist:boolean = false;
    
    constructor( public navCtrl: NavController, private api: ApiDataService, public modalCtrl: ModalController, private dataUpdateService:DataUpdateService ) {
          this.cardForm = new FormGroup({
              cardNumber: new FormControl(),
              cardMonth: new FormControl(),
              cardYear: new FormControl()
          });
          this.getCreditCard();
    }

    getCreditCard(){
        this.api.infoCreditCard().subscribe((data)=>{
            if (data.status == 'OK' && data.error == false) {
                this.cardExist = true;
                this.card = {
                    number:'**** **** **** ****' + data.last4,
                    month: data.exp_month, 
                    year:data.exp_year,
                };
            }else{
                this.cardExist = false;
            }
         });
    }
    
    changeCardPopup(){
        let openPayCardModal = this.modalCtrl.create(ModalPayCard);
        openPayCardModal.present();
        openPayCardModal.onDidDismiss(data => {
            this.getCreditCard(); 
        });
    }

    

}
