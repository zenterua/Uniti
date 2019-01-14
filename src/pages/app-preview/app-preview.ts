import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {RegisterPage} from "../register/register";
import {LoginPage} from "../login/login";
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-app-preview',
  templateUrl: 'app-preview.html'
})
export class AppPreviewPage {
  @ViewChild(Slides) slides: Slides;


  constructor(private platform: Platform,
              public navCtrl: NavController,
              public translate: TranslateService) {
    platform.ready().then( () =>{
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AppPreviewPage');
    this.slides.autoHeight = true;
  }

  pushRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  pushLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}


