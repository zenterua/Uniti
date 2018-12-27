import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuPage } from '../pages/menu/menu';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppPreviewPage } from '../pages/app-preview/app-preview';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  lang_type:any;

     
  constructor(public platform: Platform,
              private androidPermissions: AndroidPermissions, statusBar: StatusBar, splashScreen: SplashScreen, keyboard: Keyboard,
              public translate: TranslateService,
              private globalization: Globalization) {
    
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

      if (window.localStorage.getItem('unitiLang') !== null) {
            let lang = window.localStorage.getItem('unitiLang').toString();
            translate.setDefaultLang(lang);
            this.lang_type = 'lang_' + lang;    
      }else{
        this.globalization.getPreferredLanguage()
          .then((res) => {
					if (res.value == 'pl-US' || res.value == 'pl-PL') {
						translate.setDefaultLang('pl');
						this.lang_type = 'lang_pl';
						window.localStorage.setItem('unitiLang', 'pl');
					} else if (res.value == 'it-US' || res.value == 'it-IT') {
            translate.setDefaultLang('it');
            this.lang_type = 'lang_it';
            window.localStorage.setItem('unitiLang', 'it');
          } else if (res.value == 'sp-US' || res.value == 'sp-SP') {
            translate.setDefaultLang('sp');
            this.lang_type = 'lang_sp';
            window.localStorage.setItem('unitiLang', 'sp');
          } else if (res.value == 'ua-US' || res.value == 'uk-UA') {
            translate.setDefaultLang('ua');
            this.lang_type = 'lang_ua';
            window.localStorage.setItem('unitiLang', 'ua');
          } else if (res.value == 'ru-US' || res.value == 'ru-UA') {
            translate.setDefaultLang('ru');
            this.lang_type = 'lang_ru';
            window.localStorage.setItem('unitiLang', 'ru');
          }else{
						translate.setDefaultLang('en');
						this.lang_type = 'lang_en';
						window.localStorage.setItem('unitiLang', 'en');
					}
          }).catch(e => {
              translate.setDefaultLang('en');
              this.lang_type = 'lang_en';
              window.localStorage.setItem('unitiLang', 'en');
          })
      }

     if (window.localStorage.getItem('authUniti') !== null && !window.localStorage.getItem('logoutEvent')){
          this.rootPage = MenuPage;
     }else{
          this.rootPage = AppPreviewPage;
     }

    });
  }
   
}
