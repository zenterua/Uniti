import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ApiDataService } from '../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'page-purchase-report',
  templateUrl: 'purchase-report.html'
})
export class ReportsPurchasePage {
    
    @ViewChild('circleChartPurchase') circleChartPurchase;
    @ViewChild('picker') picker;
    crChart: any;
    timeFilterArr = [];
    filterDate:any;
    filterTime:any = 0;
    format:string = 'MMMM/DD/YYYY';
    dateText:string;
    noReports:boolean;
    percentage:any = 0;
    compleatedNumber:any = 0;
    declinedNumber:any = 0;
    dateObj:any = {};
    resultArr:any = [];
    arrFormat:string;
    typeArr = [];
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

    exportPurchaseReport(){
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
      };
      this.api.exportPurchaseXml(this.dateObj).finally(()=>{
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
      this.crChart = new Chart(this.circleChartPurchase.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [0, 0],
            backgroundColor: [
              '#073b4c',
              '#ff716d'
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
      let arrRes = [], typeDay, typeMonth, typeYear, amount, credits;
      for (let item of arrResult) {
        typeDay = new Date(item.date*1000).getDate();
        typeMonth = new Date(item.date*1000).getMonth();
        typeYear = new Date(item.date*1000).getFullYear();
        if (item.amount !== null || item.credits !== null) {
          amount = +item.amount;
          credits = +item.credits;
          }else {
            amount = 0;
            credits = 0;
        }
       arrRes.push({date: new Date(item.date*1000), day:typeDay, month:typeMonth, year:typeYear, amount: amount, credits: credits, status:item.status});
      }
      if (this.filterTime == 'year'){
        this.arrFormat = 'MM/yyyy';
        this.groupByStatus(arrRes, 'month');
        this.grouped(this.typeArr);
      }
      if (this.filterTime == 'month'){
        this.arrFormat = 'yyyy/MM/dd';
        this.groupByStatus(arrRes, 'day');
        this.grouped(this.typeArr);
      }
      if (this.filterTime == 'day'){
        this.arrFormat = 'yyyy/MM/dd h:mm a';
        this.resultArr = arrRes;
      }
      this.summaryChart(this.resultArr);
    }
    
    groupByStatus(arr:any, type:string){
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
          if(!previous[current['status']]) {
              previous[current['status']] = [current];
          } else {
              previous[current['status']].push(current);
          }
         return previous;
        },{});
        resStatus = Object.keys(groupedCollectionStatus).map(key=>({ status: key, value: groupedCollectionStatus[key]}));
        this.typeArr.push(resStatus);
      }
    }
    
    grouped(arr:any){  
      this.resultArr = [];
      let summAmount = 0, summCredits = 0;
      for (let res of arr) {
        for (let r of res) {
          summAmount = 0; summCredits = 0;
          for (let m of r.value) {
            if (m.amount !== 0) {
                summAmount += +m.amount;
                summCredits += +m.credits;
              }else{
                summAmount = 0;
                summCredits = 0;
              }
          }
          let date = new Date(+r.value[0].date);
          this.resultArr.push({amount:summAmount, credits:summCredits, status:r.status, date:date});
        }
      }
    }
 
    summaryChart(arr:any){
      this.compleatedNumber = 0;
      this.declinedNumber = 0;    
      for (let sum of arr) {
        if (sum.status == 'OK') {
          this.compleatedNumber += +sum.amount;
        }else{
          this.declinedNumber += +sum.amount;
        }
      }
      this.percentage = (this.declinedNumber/this.compleatedNumber)*100;
      this.crChart.data.datasets[0].data[0] = this.compleatedNumber;
      this.crChart.data.datasets[0].data[1] = this.declinedNumber;
      this.crChart.update();
    }
    
    filterByDate():void {
      this.dateObj = {
        type:this.filterTime,
        date:this.filterDate
      };
      this.api.reportsPurchaseByDate(this.dateObj).subscribe((data)=>{
        if (data.status == 'OK' && data.error == false) {
          if (data.report.length > 0) {
            this.noReports = false;
            this.resultArr = [];
            this.summActiveArr(data.report);
          }else{
            this.clearCart();
          }
        }else{
          this.clearCart();
        }
      });
    }
    clearCart(){
      this.noReports = true;
      this.compleatedNumber = 0;
      this.declinedNumber = 0;
      this.percentage = 0;
      this.crChart.data.datasets[0].data[0] = 0;
      this.crChart.data.datasets[0].data[1] = 0;
      this.crChart.update();
    }
    openPiker(){
      this.picker.open();
      this.filterDate = '';
    }
}
