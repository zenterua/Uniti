import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
    @ViewChild(Slides) slides: Slides;
    skipMsg:string;
    
    constructor( public navCtrl: NavController, public translate: TranslateService ) {
        this.translate.get('skip').subscribe((val)=>{ 
            this.skipMsg = val;
        });
    }
	
	closeTooltip(){
		console.log('close tooltip')
	}
    
    skip(){
        if (this.slides.isEnd()) {
           this.navCtrl.pop(); 
        }else{
           this.slides.slideNext(500); 
        }
    } 
    
    slideChanged() {
        if (this.slides.isEnd())
        this.translate.get('alright').subscribe((val)=>{    
            this.skipMsg = val;
        });
    }
}