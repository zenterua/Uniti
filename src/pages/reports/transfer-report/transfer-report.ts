import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { ApiDataService } from '../../services/api.service';
import { ReportsPurchaseEmailPage } from '../transfer-email-report/transfer-email-report';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'page-transfer-report',
  templateUrl: 'transfer-report.html'
})
export class ReportsTransferPage {
    
    @ViewChild('circleTransferChart') circleTransferChart;
    @ViewChild('picker') picker;
    crChart: any; 
    creditsPurchaseArr:any;
    timeFilterArr = [];
    filterDate:any;
    filterTime:any = 0;
    format:string = 'MMMM/DD/YYYY';
    dateText:string;
    noReports:boolean;
    noReportsEmail:boolean;
    percentage:any = 0;
    creditUsedNumber:any = 0;
    creditActivatedNumber:any = 0;
    dateObj:any = {};
    resultArr:any = [];
    arrFormat:string;
    typeArr = [];
    resultArrEmail = [];
    recipientsNumber:any = 0;
    monthNamesArr = [];
    order = 'date';
    ascending = false;
    
    constructor( public navCtrl: NavController,
                 private api: ApiDataService,
                 public translate: TranslateService,
                 public alertCtrl: AlertController,
                 public loadingCtrl: LoadingController ) {
      this.translate.get('date_filter').subscribe((val)=>{
          this.timeFilterArr = [{text:val.day, type:'day'}, {text:val.month, type:'month'}, {text:val.year, type:'year'}];
          this.dateText = val.day_select1;
      });
      this.translate.get('month_arr').subscribe((val)=>{
         this.monthNamesArr = val;
      });
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
    
    exportTransferReport(){
      let loginXml;
      this.translate.get('please_wait').subscribe((val)=>{
        loginXml = this.loadingCtrl.create({
          content: val
        })
        loginXml.present();
      });
      this.dateObj = {
          type:this.filterTime,
          date:this.filterDate
      }
      this.api.exportTransferXml(this.dateObj).finally(()=>{
           loginXml.dismiss();
        }).subscribe((data)=>{
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
      this.crChart = new Chart(this.circleTransferChart.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
              '#ff716d',
              '#073b4c',
              '#ffdd6a'
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
    
    filterByTime(time:any){
      this.filterTime = time;
      this.dateText = '';
      this.filterDate = '';
       this.translate.get('date_filter').subscribe((val)=>{
          if (time == 'day') {this.format = 'MMMM/DD/YYYY'; this.dateText = val.day_select1;}
          if (time == 'month') {this.format = 'MMMM/YYYY'; this.dateText = val.day_select2;}
          if (time == 'year') {this.format = 'YYYY'; this.dateText = val.day_select3;}
       });
    }
    
    summActiveArr(arrResult:any){
      this.recipientSummary(arrResult);    
        let arrRes = [], typeDay, typeMonth, typeYear, amount;
        for (let item of arrResult) {
           typeDay = new Date(item.date*1000).getDate();
           typeMonth = new Date(item.date*1000).getMonth();
           typeYear = new Date(item.date*1000).getFullYear();
           amount = +item.amount; 
           arrRes.push({date: new Date(item.date*1000), day:typeDay, month:typeMonth, year:typeYear, amount: amount, type:item.type, email:item.email});
        }
        if (this.filterTime == 'year'){
          this.arrFormat = 'MM/yyyy';
          this.groupByStatus(arrRes, 'month');
          this.grouped(this.typeArr);
          this.summaryChart(this.resultArr);
        }
        if (this.filterTime == 'month'){
          this.arrFormat = 'yyyy/MM/dd';
          this.groupByStatus(arrRes, 'day');
          this.grouped(this.typeArr);
          this.summaryChart(this.resultArr);
        }
        if (this.filterTime == 'day'){
          this.arrFormat = 'yyyy/MM/dd h:mm a';
          this.noReports = true;
          this.noReportsEmail = false;
          this.groupedEmail(arrRes);
          this.summaryChartEmail(this.resultArrEmail);
        }
        this.percentage = (this.creditUsedNumber + this.creditActivatedNumber)/this.recipientsNumber;
    }
    
    groupedEmail(arr:any){
       let resEmail, resStatus = [], amount;
       this.resultArrEmail = [];
       const groupedCollectionEmail = arr.reduce((previous, current)=> {
          if(!previous[current['email']]) {
            previous[current['email']] = [current];
          } else {
            previous[current['email']].push(current);
          }
         return previous;
        },{});
        resEmail = Object.keys(groupedCollectionEmail).map(key=>({ email: key, value: groupedCollectionEmail[key]}));
        for (let x of resEmail) {
          const groupedCollectionStatus = x.value.reduce((previous, current)=> {
            if(!previous[current['type']]) {
              previous[current['type']] = [current];
            } else {
              previous[current['type']].push(current);
            }
            return previous;
          },{});
          let status = Object.keys(groupedCollectionStatus).map(key=>({ type: key, value: groupedCollectionStatus[key]}));
          resStatus.push(status)
        }
        for (let e of resStatus) {
          for (let y of e) {
            amount = 0;  
             if (y.type == 'active') {
                for (let c of y.value) {
                   amount += +c.amount;
                } 
                this.resultArrEmail.push({amount:amount, type:'active', email:y.value[0].email}); 
             }else{
                for (let c of y.value) {
                   amount += +c.amount;
                }
                this.resultArrEmail.push({amount:amount, type:'inactive', email:y.value[0].email}); 
             }  
          }  
        }
    }
    
    groupByStatus(arr:any, type:string){
        this.noReportsEmail = true;
        this.typeArr = [];
        let resStatus, resMonth;
        const groupedCollectionMonth = arr.reduce((previous, current)=> {
          if(!previous[current[type]]) {
              previous[current[type]] = [current];
          } else {
              previous[current[type]].push(current);
          }
         return previous;
        },{});
        resMonth = Object.keys(groupedCollectionMonth).map(key=>({ month: key, value: groupedCollectionMonth[key]}));
        for (let sum of resMonth) {
          const groupedCollectionStatus = sum.value.reduce((previous, current)=> {
            if(!previous[current['type']]) {
              previous[current['type']] = [current];
            } else {
              previous[current['type']].push(current);
            }
             return previous;
          },{});
          resStatus = Object.keys(groupedCollectionStatus).map(key=>({ status: key, value: groupedCollectionStatus[key]}));
          this.typeArr.push(resStatus);
        }
    }
    
    grouped(arr:any){  
       let amountActive, amountInActive, amountActiveSumm, amountInActiveSumm;
        for (let res of arr) { 
          amountActiveSumm = 0; amountInActiveSumm = 0;
            for (let r of res) {
               amountActive = 0; amountInActive = 0;
               for (let m of r.value) {
                  if (m.type == 'active') {
                    amountActive += +m.amount;
                  }else{ 
                    amountInActive += +m.amount;
                  }
               }
               amountActiveSumm += amountActive;
               amountInActiveSumm += amountInActive;  
          }
          this.resultArr.push({active:amountActiveSumm, inactive:amountInActiveSumm, date:res[0].value[0].date}); 
        }
    }
 
    summaryChart(arr:any){
      for (let sum of arr) {
        this.creditUsedNumber += +sum.inactive;
        this.creditActivatedNumber += +sum.active;
      }
      this.crChart.data.datasets[0].data[0] = this.creditUsedNumber;
      this.crChart.data.datasets[0].data[1] = this.creditActivatedNumber;
      this.crChart.data.datasets[0].data[2] = this.recipientsNumber;
      this.crChart.update();
    }
    
    summaryChartEmail(arr:any){ 
      for (let sum of arr) {
        if (sum.type == 'inactive'){
           this.creditUsedNumber += +sum.amount;
        }else{
           this.creditActivatedNumber += +sum.amount;
        }
      }
      this.crChart.data.datasets[0].data[0] = this.creditUsedNumber;
      this.crChart.data.datasets[0].data[1] = this.creditActivatedNumber;
      this.crChart.data.datasets[0].data[2] = this.recipientsNumber;
      this.crChart.update();
    }
    
    filterByDate():void {
      this.dateObj = {
          type:this.filterTime,
          date:this.filterDate
      };
      this.api.reportsTransferByDate(this.dateObj).subscribe((data)=>{
        if (data.status == 'OK' && data.error == false) {
          if (data.report.length > 0) {
              this.noReports = false;
              this.noReportsEmail = false;
              this.creditUsedNumber = 0;
              this.creditActivatedNumber = 0;
              this.resultArr = [];
              this.resultArrEmail = [];
              this.summActiveArr(data.report);

          }else{
              this.clearCart();
          }
        }else{
            this.clearCart();
        }
      });
    }
    
    recipientSummary(arr:any){
      let resEmail;
        const groupedCollectionEmail = arr.reduce((previous, current)=> {
            if(!previous[current['email']]) {
                previous[current['email']] = [current];
            } else {
                previous[current['email']].push(current);
            }
           return previous;  
        },{});
        resEmail = Object.keys(groupedCollectionEmail).map(key=>({ email: key, value: groupedCollectionEmail[key]}));
        this.recipientsNumber = resEmail.length;
    }
    
    clearCart(){
      this.noReports = true;
      this.noReportsEmail = true;
      this.creditUsedNumber = 0;
      this.creditActivatedNumber = 0;
      this.recipientsNumber = 0;
      this.percentage = 0;
      this.crChart.data.datasets[0].data[0] = 0;
      this.crChart.data.datasets[0].data[1] = 0;
      this.crChart.update();
    }
    
    getRecipientDetail(email:any){
      this.navCtrl.push(ReportsPurchaseEmailPage, {email:email})
    }

    openPiker(){
      this.picker.open();
      this.filterDate = '';
    }
}
