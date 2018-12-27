import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { languageService } from '../services/language.service';

@Component({
  selector: 'language-menu',
  templateUrl: 'language.html'
})
export class LanguagePage {
   langModel:string;    
    
   constructor( public translate: TranslateService, private globalization: Globalization, private languageService: languageService) {
    if (window.localStorage.getItem('unitiLang') !== null) {
        let lang = window.localStorage.getItem('unitiLang').toString();
        translate.setDefaultLang(lang); 
        this.langModel = lang;
    }else{
        this.globalization.getPreferredLanguage()
           .then((res) => {
             console.log(res);
             if (res.value == 'pl-US' || res.value == 'pl-PL') {
               translate.setDefaultLang('pl');
               this.langModel = 'pl';
               window.localStorage.setItem('unitiLang', 'pl');
             } else if (res.value == 'it-US' || res.value == 'it-IT') {
               translate.setDefaultLang('it');
               this.langModel = 'it';
               window.localStorage.setItem('unitiLang', 'it');
             } else if (res.value == 'sp-US' || res.value == 'sp-SP') {
               translate.setDefaultLang('sp');
               this.langModel = 'sp';
               window.localStorage.setItem('unitiLang', 'sp');
             } else if (res.value == 'ua-US' || res.value == 'uk-UA') {
               translate.setDefaultLang('ua');
               this.langModel = 'ua';
               window.localStorage.setItem('unitiLang', 'ua');
             }
             else if (res.value == 'ru-US' || res.value == 'ru-UA') {
               translate.setDefaultLang('ru');
               this.langModel = 'ru';
               window.localStorage.setItem('unitiLang', 'ru');
             }else{
               translate.setDefaultLang('en');
               this.langModel = 'en';
               window.localStorage.setItem('unitiLang', 'en');
             }
           })
           .catch(e => {
            this.langModel = 'en';
            translate.setDefaultLang('en');
           })
       }   
        
    }
    
    changeLang(e:any){
        window.localStorage.setItem('unitiLang', e);
        this.translate.use(e);
        this.languageService.sendLanguage(e);
    }

}
