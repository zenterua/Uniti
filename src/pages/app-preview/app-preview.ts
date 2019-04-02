import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {RegisterPage} from "../register/register";
import {LoginPage} from "../login/login";
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-app-preview',
  templateUrl: 'app-preview.html'
})
export class AppPreviewPage {
  @ViewChild(Slides) slides: Slides;


  constructor(private platform: Platform,
              public navCtrl: NavController,
              public translate: TranslateService,
              public splashScreen: SplashScreen) {
    platform.ready().then( () =>{
      this.slides.autoHeight = true;
      if ( window.localStorage.getItem('tokenLifeEnd') != null ) {
        splashScreen.show();
        setTimeout(() => {
          this.navCtrl.push(LoginPage);
        }, 500);

      }
    });
  }
  ionViewDidLoad() {

  }

  pushRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  pushLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}


