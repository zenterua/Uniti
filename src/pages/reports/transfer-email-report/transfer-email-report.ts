import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ApiDataService } from '../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'page-transfer-email-report',
  templateUrl: 'transfer-email-report.html'
})
export class ReportsPurchaseEmailPage {
    @ViewChild('circleChartEmail') circleChartEmail;
    @ViewChild('content') content;
    crChart: any; 
    creditUsedEmailNumber:any = 0;
    creditActivatedEmailNumber:any = 0;
    totalCredits:any = 0;
    resultArrEmail:any = [];
    emailArr = [];
    filterEmail:any = 0;
    noReportsEmail:boolean;
    order = 'date';
    ascending = false;
    
    constructor( public navCtrl: NavController,
                 private api: ApiDataService,
                 public translate: TranslateService,
                 public alertCtrl: AlertController,
                 public loadingCtrl: LoadingController) {
    }
    
    serverErrorFunc(error){ 
      let observable = new Observable(observer => {
        this.translate.get('error_server').subscribe((val)=>{
          for (const key of Object.keys(val)) {
             if (key == error) {
                observer.next(val[key]);
             }
          }
        })
      });
      return observable;
    }
    
    alertFunc(mess:string){
      let alert = this.alertCtrl.create({
        title: mess,
        buttons: [{
             text: 'OK',
             role: 'cancel'
          }]
      });
      alert.present();
    }
    
    exportTransferEmailReport(){
      let loginXml;
      this.translate.get('please_wait').subscribe((val)=>{
        loginXml = this.loadingCtrl.create({
          content: val
        });
        loginXml.present();
      });
      this.api.exportTransferEmailXml({email:this.filterEmail}).finally(()=>{
        loginXml.dismiss();}).subscribe((data)=>{
          console.log(data);
          if (data.error == false && data.status == 'OK'){
            this.translate.get('send_report').subscribe((val)=>{
               this.alertFunc(val);
            });
          }else{
            this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
               this.alertFunc(err);
            });
          }
        })
    }
    
    ionViewDidLoad() {
      this.api.reportsTransferEmail().subscribe((data)=>{
        this.emailArr = data.users;
      });
      this.crChart = new Chart(this.circleChartEmail.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [0, 0],
            backgroundColor: [
              '#ff716d',
              '#073b4c'

            ],
            borderWidth: 0
          }]
        },
        options:{
          cutoutPercentage: 80,
          tooltips: {
             enabled: false
          }
        }
      });
    }
    
    recipientSummary(arr:any){
      let resEmail;
      const groupedCollectionEmail = arr.reduce((previous, current)=> {
        if(!previous[current['type']]) {
          previous[current['type']] = [current];
        } else {
          previous[current['type']].push(current);
        }
        return previous;
      },{});
      resEmail = Object.keys(groupedCollectionEmail).map(key=>({ type: key, value: groupedCollectionEmail[key]}));
      console.log(resEmail);
      for (let sum of resEmail) {
        if (sum.type == 'passive'){
           for (let i of sum.value) {
              this.creditUsedEmailNumber += +i.amount;
           }
        }else{
           for (let i of sum.value) {
              this.creditActivatedEmailNumber += +i.amount;
           }
        }
      }
      this.totalCredits = this.creditUsedEmailNumber + this.creditActivatedEmailNumber;
      this.crChart.data.datasets[0].data[0] = this.creditUsedEmailNumber;
      this.crChart.data.datasets[0].data[1] = this.creditActivatedEmailNumber;
      this.crChart.update();
    }
    
    getEmailTransfers(e){
      this.resultArrEmail = [];
      this.api.reportsTransferByMail({email:e}).subscribe((data)=>{
        console.log(data);
        if (data.status == 'OK' && data.error == false) {
          this.noReportsEmail = false;
           this.totalCredits = 0;
           this.creditUsedEmailNumber = 0;
           this.creditActivatedEmailNumber = 0;
           data.report.map((item)=>{
             this.resultArrEmail.push({type:item.type, amount:item.amount, date:new Date(item.date*1000)})
           });
           this.recipientSummary(this.resultArrEmail);
           console.log(this.content);
          setTimeout(() => {
            this.content.resize();
          }, 500);
        }else{
            this.resultArrEmail = [];
        }
      });
    }
    
}
