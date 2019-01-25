import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { languageService } from '../services/language.service';
import {LoadingController} from "ionic-angular";

@Component({
  selector: 'language-menu',
  templateUrl: 'language.html'
})
export class LanguagePage implements OnInit{
   langModel:string;
    
   constructor( public translate: TranslateService,
                private globalization: Globalization,
                private languageService: languageService,
                private loadingCtrl: LoadingController) {
   }

   ngOnInit(){
     this.langModel = window.localStorage.getItem('unitiLang');
     this.languageService.getLanguage().subscribe(data => {
       this.langModel = data;
     });
   }
    
    changeLang(e:any){
      let reload;
      window.localStorage.setItem('unitiLang', e);
      this.translate.get('switch_language').subscribe((val)=>{
        reload = this.loadingCtrl.create({
          content: ''
        });

      });
      reload.present();
      setTimeout(() => {
        window.location.reload();
      },2000)


    }

}
