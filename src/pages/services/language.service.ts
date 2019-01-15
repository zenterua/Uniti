import {Injectable} from "@angular/core";
import { Observable, Subject } from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {Globalization} from "@ionic-native/globalization";

@Injectable()
export class languageService {
  constructor(private translate: TranslateService,
              private globalization: Globalization) {}

  private subject = new Subject<any>();

  sendLanguage(language):void {
    this.subject.next(language);
  }

  languageGlobalization() {
    if (window.localStorage.getItem('unitiLang') !== null) {
      let lang = window.localStorage.getItem('unitiLang').toString();
      this.translate.setDefaultLang(lang);
      this.sendLanguage(lang);
    }else{
      this.globalization.getPreferredLanguage()
        .then((res) => {
          if (res.value == 'pl-US' || res.value == 'pl-PL') {
            this.translate.setDefaultLang('pl');
            window.localStorage.setItem('unitiLang', 'pl');
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'it-US' || res.value == 'it-IT') {
            this.translate.setDefaultLang('it');
            window.localStorage.setItem('unitiLang', 'it');
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'sp-US' || res.value == 'sp-SP') {
            this.translate.setDefaultLang('sp');
            window.localStorage.setItem('unitiLang', 'sp');
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'ua-US' || res.value == 'uk-UA') {
            this.translate.setDefaultLang('ua');
            window.localStorage.setItem('unitiLang', 'ua');
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'ru-US' || res.value == 'ru-UA') {
            this.translate.setDefaultLang('ru');
            window.localStorage.setItem('unitiLang', 'ru');
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          }else{
            this.translate.setDefaultLang('en');
            window.localStorage.setItem('unitiLang', 'en');
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          }
        }).catch(e => {
        this.translate.setDefaultLang('en');
        window.localStorage.setItem('unitiLang', 'en');
        this.sendLanguage(window.localStorage.getItem('unitiLang'));
      })
    }
  }

  getLanguage(): Observable<any> {
    return this.subject.asObservable();
  }
}
