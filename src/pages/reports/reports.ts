import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ReportsTransferMenu } from './tranfer-menu/tranfer-menu';
import { ReportsPurchasePage } from './purchase-report/purchase-report';
import { ReportsActivatePage } from './activate-report/activate-report';
import { ReportsPasswordPage } from './password-report/password-report';
import { ApiDataService } from '../services/api.service';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage {
    reportPage1Exist:any;
    reportPage2Exist:any;
    reportPage3Exist:any;
    reportPage4Exist:any;
    
    constructor( public navCtrl: NavController, private api: ApiDataService, public alertCtrl: AlertController) {
         this.api.reportExist().subscribe((data)=>{
           if (data.status == 'OK' && data.error == false) {
             if (data.type.length) {
              for (let item of data.type) {
                if (item == 'purchase'){
                 this.reportPage3Exist = 'purchase';
                 }
                 if (item == 'transfer'){
                 this.reportPage1Exist = 'transfer';
                 }
                 if (item == 'activate'){
                 this.reportPage2Exist = 'activate';
                 }
                 if (item == 'chat'){
                 this.reportPage4Exist = 'chat';
                 }
              }
            }
           }else{
             let errReports = this.alertCtrl.create({
               title: data.error_msg,
                 buttons: [{
                     text: 'OK',
                     role: 'cancel'
                 }]
               });
             errReports.present();
           }
         })
    }

    openReportPage1(){
       this.navCtrl.push(ReportsPurchasePage);  
    }
    openReportPage2(){
       this.navCtrl.push(ReportsTransferMenu);  
    }
    openReportPage3(){
       this.navCtrl.push(ReportsActivatePage);  
    }
    openReportPage4(){
       this.navCtrl.push(ReportsPasswordPage);  
    }

}