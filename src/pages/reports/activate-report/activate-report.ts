import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ApiDataService } from '../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'page-activate-report',
  templateUrl: 'activate-report.html'
})
export class ReportsActivatePage {
    
    @ViewChild('circleChartActivated') circleChartActivated;
    @ViewChild('picker') picker;
    crChart: any;
    timeFilterArr = [];
    filterDate:any;
    filterTime:any = 0;
    format:string = 'MMMM/DD/YYYY';
    dateText:string;
    noReports:boolean;
    percentage:any = 0;
    activatedNumber:any = 0;
    usedNumber:any = 0;
    dateObj:any = {};
    resultArr:any = [];
    arrFormat:string;
    typeArr = [];
    monthNamesArr = [];
    order = 'date';
    ascending = false;
    
    constructor( public navCtrl: NavController, private api: ApiDataService, public translate: TranslateService, public alertCtrl: AlertController, public loadingCtrl: LoadingController ) { 
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
    
    exportActiveReport(){
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
      this.api.exportActiveXml(this.dateObj).finally(()=>{
         loginXml.dismiss();
        }).subscribe((data)=>{
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
      this.crChart = new Chart(this.circleChartActivated.nativeElement, {
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
      let arrRes = [], typeDay, typeMonth, typeYear, amount, used, typeDate;
      for (let item of arrResult) {
        let d = +item.date*1000;
        typeDate = new Date(d);
        typeDay = new Date(d).getDate();
        typeMonth = new Date(d).getMonth();
        typeYear = new Date(d).getFullYear();
        amount = +item.amount;
        used = +item.used;
        arrRes.push({date: typeDate, day:typeDay, month:typeMonth, year:typeYear, amount: amount, used: used});
      }
      console.log(arrRes);
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
      let resMonth;
      const groupedCollectionMonth = arr.reduce((previous, current)=> {
          if(!previous[current[type]]) {
            previous[current[type]] = [current];
          } else {
            previous[current[type]].push(current);
          }
         return previous;
      },{});
      resMonth = Object.keys(groupedCollectionMonth).map(key=>({ month: key, value: groupedCollectionMonth[key]}));
      this.typeArr.push(resMonth);
    }
    
    grouped(arr:any){ 
      this.resultArr = [];  
      let summAmount, summCredits;
      for (let res of arr[0]) {
        summAmount = 0; summCredits = 0;
        for (let r of res.value) {
           summAmount += +r.amount;
           summCredits += +r.used;
        }
        let date = new Date(+res.value[0].date);
        this.resultArr.push({amount:summAmount, used:summCredits, date:date});
      }
    }
 
    summaryChart(arr:any){
      this.activatedNumber = 0;
      this.usedNumber = 0;    
        for (let sum of arr) {  
          this.activatedNumber += +sum.amount;
          this.usedNumber += +sum.used;
        }
        this.percentage = (this.activatedNumber/this.usedNumber)*100;
        this.crChart.data.datasets[0].data[0] = this.activatedNumber;
        this.crChart.data.datasets[0].data[1] = this.usedNumber;
        this.crChart.update();
    }
    
    filterByDate():void {
      this.dateObj = {
        type:this.filterTime,
        date:this.filterDate
      };
      this.api.reportsActivateByDate(this.dateObj).subscribe((data)=>{
        console.log(data);
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
      this.activatedNumber = 0;
      this.usedNumber = 0;
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
