import {Injectable} from "@angular/core";
import { Observable, Subject } from "rxjs";
import {TranslateLoader, TranslateService} from "@ngx-translate/core";
import {Globalization} from "@ionic-native/globalization";
import {ApiDataService} from "./api.service";
import {App} from "ionic-angular";

@Injectable()
export class languageService implements TranslateLoader {
  unitiLang:any = 'en';

  constructor(private translate: TranslateService,
              private globalization: Globalization,
              private http: ApiDataService,
              public appCtrl: App) {}

  private subject = new Subject<any>();

  sendLanguage(language):void {
    this.subject.next(language);
  }

  languageGlobalization() {
    if (window.localStorage.getItem('unitiLang') !== null) {
      this.unitiLang = window.localStorage.getItem('unitiLang').toString();
      this.sendLanguage(this.unitiLang);
      this.setLanguageTranslate();
    }else{
      this.globalization.getPreferredLanguage()
        .then((res) => {
          if (res.value == 'pl-US' || res.value == 'pl-PL') {
            window.localStorage.setItem('unitiLang', 'pl');
            this.unitiLang = 'pl';
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'it-US' || res.value == 'it-IT') {
            window.localStorage.setItem('unitiLang', 'it');
            this.unitiLang = 'it';
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'sp-US' || res.value == 'sp-SP') {
            window.localStorage.setItem('unitiLang', 'sp');
            this.unitiLang = 'sp';
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'ua-US' || res.value == 'uk-UA') {
            window.localStorage.setItem('unitiLang', 'ua');
            this.unitiLang = 'ua';
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          } else if (res.value == 'ru-US' || res.value == 'ru-UA') {
            window.localStorage.setItem('unitiLang', 'ru');
            this.unitiLang = 'ru';
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          }else{
            window.localStorage.setItem('unitiLang', 'en');
            this.unitiLang = 'en';
            this.sendLanguage(window.localStorage.getItem('unitiLang'));
          }
        })
        .then(() => {
          this.setLanguageTranslate();
        })
        .catch(e => {
        window.localStorage.setItem('unitiLang', 'en');
        this.unitiLang = 'en';
        this.sendLanguage(window.localStorage.getItem('unitiLang'));
        this.setLanguageTranslate();
      })
    }

  }

  setLanguageTranslate() {
    this.http.watchLanguageChange().subscribe(data => {
      this.translate.setTranslation(this.unitiLang, data);
      this.translate.setDefaultLang(this.unitiLang);
    });

    this.http.loadTranslation();
  }

  getLanguage(): Observable<any> {
    return this.subject.asObservable();
  }

   getTranslation(): Observable<any> {
    return Observable.of(this.unitiLang);
  }
}
