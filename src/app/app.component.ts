import {Component, OnInit} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuPage } from '../pages/menu/menu';
import { Globalization } from '@ionic-native/globalization';
import {TranslateService} from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppPreviewPage } from '../pages/app-preview/app-preview';
import {languageService} from "../pages/services/language.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  lang_type:any;

  constructor(public platform: Platform,
              private androidPermissions: AndroidPermissions, statusBar: StatusBar, splashScreen: SplashScreen, keyboard: Keyboard,
              public translate: TranslateService,
              private globalization: Globalization,
              private languageService: languageService) {
    
    platform.ready().then(() => {
       keyboard.hideKeyboardAccessoryBar(false);
       keyboard.disableScroll(false);
       statusBar.styleDefault(); 
       splashScreen.hide();

      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.MICROPHONE,
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.WAKE_LOCK,
        this.androidPermissions.PERMISSION.ACCESS_WIFI_STATE
      ]);

      this.languageService.getLanguage().subscribe(data => {
        this.lang_type = data;
      });

      languageService.languageGlobalization();

     if (window.localStorage.getItem('authUniti') !== null && !window.localStorage.getItem('logoutEvent')){
        this.rootPage = MenuPage;
     }else{
        this.rootPage = AppPreviewPage;
     }

    });
  }

}
