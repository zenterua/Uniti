import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ApiDataService } from '../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'page-password-report',
  templateUrl: 'password-report.html'
})
export class ReportsPasswordPage {
    @ViewChild('circleChartPassword') circleChartPassword;
    @ViewChild('picker') picker;
    crChart: any;
    timeFilterArr = [];
    filterDate:any;
    filterTime:any = 0;
    format:string = 'MMMM/DD/YYYY';
    dateText:string;
    noGroupsTitle:boolean = false;
    noGroups:boolean = false;
    noGroupsKeys:boolean = false;
    noGroupsArr:boolean = false;
    percentage:any = 0;
    dateObj:any = {};
    resultArr:any = [];
    arrFormat:string;
    detailGroup:any = {};
    errorClose:boolean = false;
    groupsResult:boolean = false;
    monthNamesArr = [];
    sIndex:number = 0;
    gIndex:number = 0;
    order = 'date';
    ascending = false;
    chatMessageFormat:string;
    globalLang:string;

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
        this.globalLang = window.localStorage.getItem('unitiLang');
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
    
    exportPasswordReport(){
      let loginXml;
      this.translate.get('please_wait').subscribe((val)=>{
        loginXml = this.loadingCtrl.create({
          content: val
        });
        loginXml.present();
      });
      this.dateObj = {
          type:this.filterTime,
          date:this.filterDate
      };
      this.api.exportPasswordXml(this.dateObj).finally(()=>{
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
      this.crChart = new Chart(this.circleChartPassword.nativeElement, {
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
      this.chatTimeFormatMsg();
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
       arrRes.push({date: typeDate, day:typeDay, month:typeMonth, year:typeYear, start: item.start, end: item.end, code:item.code, users: item.users, audio:item.audio});
      }
      if (this.filterTime == 'year'){
        this.arrFormat = 'MM/yyyy';
        this.groupByStatus(arrRes, 'month');
      }
      if (this.filterTime == 'month'){
        this.arrFormat = 'yyyy/MM/dd';
        this.groupByStatus(arrRes, 'day');
      }
      if (this.filterTime == 'day' && this.globalLang == 'en' ){
        this.arrFormat = 'yyyy/MM/dd hh:mm a';
        this.groupByStatus(arrRes, 'day');
      } else {
        this.arrFormat = 'yyyy/MM/dd HH:mm';
        this.groupByStatus(arrRes, 'day');
      }
    }
    
    groupByStatus(arr:any, type:string){
      this.resultArr = [];
      let dataArr = [];
      const groupedCollectionMonth = arr.reduce((previous, current)=> {
        if(!previous[current[type]]) {
          previous[current[type]] = [current];} else {previous[current[type]].push(current);}
        return previous;
      },{});
      let resMonth = Object.keys(groupedCollectionMonth).map(key=>({ month: key, value: groupedCollectionMonth[key]}));

      dataArr.push(resMonth);
      for (let res of dataArr[0]) {
        let date = new Date(+res.value[0].date);
        this.resultArr.push({date:date, value:res.value});
      }
    }

  getGroupDetail(item:any, j:any){ // list of rooms
      this.sIndex = item.code; // room name
      this.gIndex = j;
      this.noGroupsKeys = false;
      this.noGroups = true;
      this.groupsResult = true;
      let startDate = item.start * 1000;
      let RoomLifeTime:any = ( item.end ) - ( item.start );
      let endDate:any;
      let duration:any;
      this.percentage = 0;
      if (item.end !== 0) {
         this.errorClose = false;
         console.log(startDate);
         endDate = item.end * 1000;
         let h = Math.floor(RoomLifeTime / 3600);
         let m = (Math.floor(RoomLifeTime/ 60) - (Math.floor(RoomLifeTime / 3600) * 60));
         let s = Math.floor(RoomLifeTime % 60);
         duration = `${h} : ${m} : ${s}`;
      }else{
         this.errorClose = true;
         endDate = '-';
         duration = '-';
         this.percentage = 0;
      }

    this.detailGroup = {
      users:item.users,
      audio:item.audio,
      code: item.code,
      start:startDate,
      end:endDate,
      duration:duration
    };

    if (this.detailGroup.users == 0) {
      this.percentage = 0;
    }else{
      this.percentage = (this.detailGroup.audio/this.detailGroup.users)*100;
    }
    this.crChart.data.datasets[0].data[0] = this.detailGroup.users;
    this.crChart.data.datasets[0].data[1] = this.detailGroup.audio;
    this.crChart.update();
  }
    
  filterByDate():void {
    this.dateObj = {
        type:this.filterTime,
        date:this.filterDate
    };
    this.noGroupsKeys = false;
    this.noGroups = false;
    this.noGroupsTitle = false;
    this.groupsResult = false;
    this.resultArr = [];
    this.api.reportsPasswordByDate(this.dateObj).subscribe((data)=>{
      if (data.status == 'OK' && data.error == false) {
        if (data.report.length > 0) {
          this.noGroupsKeys = true;
          this.noGroups = true;
          this.noGroupsTitle = true;
          this.noGroupsArr = true;

          this.summActiveArr(data.report);
        }else{
          this.noGroupsTitle = false;
        }
      }else {
        this.noGroupsTitle = false;
      }
      });
    }
    
  openPiker(){
    this.picker.open();
    this.filterDate = '';
  }

  chatTimeFormatMsg() {
    console.log(this.globalLang);
    if ( this.globalLang != 'en' ) {
      this.chatMessageFormat = 'MMM d, y, HH:mm:ss';
    } else {
      this.chatMessageFormat = 'MMM d, y, hh:mm:ss a';
    }
  }

}
