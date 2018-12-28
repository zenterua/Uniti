import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {RegisterPage} from "../register/register";
import {LoginPage} from "../login/login";
import { Sensors } from '@ionic-native/sensors';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-app-preview',
  templateUrl: 'app-preview.html',
})
export class AppPreviewPage {
  test;
  test2;
  proximityStates: any;
  @ViewChild(Slides) slides: Slides;


  constructor(private platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              private sensors: Sensors) {
    platform.ready().then( () =>{
      document.addEventListener("deviceready",() => {

        this.sensors.enableSensor("PROXIMITY");
        setTimeout(()=> {
          this.sensors.enableSensor("PROXIMITY");
        }, 500);

        setInterval(() =>{
          this.proximityStates = this.sensors.getState();
          this.sensors.getState().then(val => {
            this.test = val[0];
            this.test2 = val[1];
          });
        }, 1000);


      }, false);

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


