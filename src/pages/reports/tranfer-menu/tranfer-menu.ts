import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReportsTransferPage } from '../transfer-report/transfer-report';
import { ReportsPurchaseEmailPage } from '../transfer-email-report/transfer-email-report';

@Component({
  selector: 'page-reports-transfer-menu',
  templateUrl: 'tranfer-menu.html' 
})
export class ReportsTransferMenu {
    constructor( public navCtrl: NavController ) {}
    openReportPage1(){
       this.navCtrl.push(ReportsTransferPage);  
    }
    openReportPage2(){
       this.navCtrl.push(ReportsPurchaseEmailPage);  
    }
}