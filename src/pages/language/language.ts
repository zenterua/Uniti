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
    
   constructor( public translate: TranslateService,
                private globalization: Globalization,
                private languageService: languageService) {
     this.languageService.getLanguage().subscribe(data => {
       this.langModel = data;
     });
     this.languageService.languageGlobalization();
   }
    
    changeLang(e:any){
      window.localStorage.setItem('unitiLang', e);
      this.translate.use(e);
      this.languageService.sendLanguage(e);
    }

}
