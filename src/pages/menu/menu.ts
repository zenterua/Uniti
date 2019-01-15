import { Component } from '@angular/core';
import { NavController, AlertController, Platform, App } from 'ionic-angular';
import { AuthService } from '../services/auth.service';
import { ApiDataService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';
import { AccountPage } from '../account/account';
import { CardPage } from '../card/card';
import { PasswordPage } from '../password/password'; 
import { ReportsPage } from '../reports/reports';
import { TutorialPage } from '../tutorial/tutorial'; 
import { LanguagePage } from '../language/language';
import { DataUpdateService } from '../services/data.service';
import { SocketIo } from '../services/socket.io.service';
import { ActiveCreditsVal } from '../services/active.number';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AppPreviewPage } from '../app-preview/app-preview';
import { logoutService } from '../services/logout.service';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
   rootPage:any = HomePage;  
   cardExpired:boolean = false; 
   cardExist:boolean = false;
   reportPage:boolean = false; 
   cardNumb:any;
   dateUpdate:any;  

   constructor(public navCtrl: NavController,
               public authService: AuthService,
               private api: ApiDataService,
               public alertCtrl: AlertController,
               private dataUpdateService:DataUpdateService,
               private socket: SocketIo,
               public translate: TranslateService,
               public globalActive: ActiveCreditsVal,
               public platform: Platform,
               public appCtrl: App,
               private backgroundMode: BackgroundMode,
               private logoutService: logoutService) {
       this.getCreditCardInfo();
    }
    
    getCreditCardInfo(){
      this.api.infoCreditCard().subscribe((data)=>{
        if (data.status == 'OK' && data.error == false) {
          this.cardNumb = data.last4;
          let currentYear = new Date().getFullYear();
          let currentMonth = new Date().getMonth();
          if (currentYear >= +data.exp_year && currentMonth > +data.exp_month) {
            this.cardExpired = true;
          }else {
            this.cardExpired = false;
          }
        }else {
          this.cardExpired = false;
        }
      });
    }

   ionViewDidEnter() {
     this.dataUpdateService.currentMessage.subscribe(message => {
      if (message) {
        this.dateUpdate = message;
         if (this.dateUpdate.cardupdate == 'updated'){
           this.getCreditCardInfo();
           this.dateUpdate.cardupdate = '';
         }
         if (window.localStorage.getItem('isCard') == 'active') {
            this.cardExist = true;
         }else{
            this.cardExist = false;
         }
      }
     });

     this.api.reportExist().subscribe((data)=>{
       if (data.status == 'OK' && data.error == false) {
         if (data.type.length) {
           this.reportPage = true;
         }else{
           this.reportPage = false;
         }
       }
     });
    }
    
    openPage1(){
       this.navCtrl.push(AccountPage);  
    }
    openPage2(){
       this.navCtrl.push(ReportsPage);  
    }
    openPage3(){
       this.navCtrl.push(CardPage);  
    }
    openPage4(){
       this.navCtrl.push(PasswordPage);    
    }
    openPage5(){
       this.navCtrl.push(TutorialPage); 
    }
    openPage6(){
       this.navCtrl.push(LanguagePage); 
    }
    
   logout(){
     this.translate.get('want_to_logout').subscribe((val)=>{
      let exitFromPage = this.alertCtrl.create({
      title: val.txt1,
      buttons: [{
       text: 'OK',
          handler: () => {
            window.localStorage.removeItem('isCard');
            window.localStorage.removeItem('room_name');
            this.authService.logout();
            window.localStorage.setItem('logoutEvent', 'islogout');
            this.appCtrl.getRootNav().setRoot(AppPreviewPage, {logout:true});
            this.backgroundMode.disable();
            clearInterval(this.globalActive.getActiveCreditsNumber);
            this.logoutService.sendLogout();
          }
        },
        {
         text: val.txt2,
         role: 'cancel'
        }]
      });
       exitFromPage.present();
     });
      
   }
    
}
