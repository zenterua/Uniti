import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/filter';

const apiUrl = 'http://uniti.redstone.media:3000'; 

@Injectable()
export class ApiDataService {
    
  constructor(private http: HttpClient, public alertCtrl: AlertController, public translate: TranslateService) {}
    
 /*************/    
 /*USERS API*/
 /*************/   
  
 /*GET USER INFO*/    
    
  getUserData() {
      return this.http.get(apiUrl + '/auth/me')
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*DELETE AVATAR*/    
    
  deleteAvatar() {
      return this.http.get(apiUrl + '/auth/delavatar')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }    
    
  /*GET USER INFO*/     
    
  chekPass(password:any) {
      return this.http.post(apiUrl + '/auth/confirm', password)
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  } 
    
  /*UPDATE USER DATA*/
    
  updateUserData(user:any) {
      return this.http.post(apiUrl + '/auth/update', user)
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*FORGOT PASSWORD*/ 
    
  forgotPassword(email:any) {
      return this.http.post(apiUrl + '/auth/forgot', email)
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }  
    
  /*CHANGE USER PASSWORD*/
    
  changeUserPass(pass:any) {
      return this.http.post(apiUrl + '/auth/change-pass', pass)
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*************/    
  /*CREDITS API*/
  /*************/    
    
  /*ADD NEW CREDIT CARD*/
    
  addNewCreditCard(card:any) {
      return this.http.post(apiUrl + '/payment/add-card', card)
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*REMOVE EXIST CREDIT CARD*/
    
  removeExistCreditCard() {
      return this.http.get(apiUrl + '/payment/del-card')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }    
  
  /*CREDIT CARD INFO*/
    
  infoCreditCard() {
      return this.http.get(apiUrl + '/payment/me')
        .map((data:any) => {
            return data;  
        })
        .retryWhen(errors => errors.delay(5000).take(5).concat(Observable.throw('Error')))
        .catch((err: HttpErrorResponse):Observable<any> => {
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*CREDITS INFO*/    
    
  infoCredits() {
      return this.http.get(apiUrl + '/payment/credits')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }    
    
  /*BUY CREDITS*/
    
  buyCredits(amount:any) {
      return this.http.post(apiUrl + '/payment/buy-credits', amount)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*ACTIVATE CREDITS*/  
    
  activateCredits(count:any) {
      return this.http.post(apiUrl + '/payment/credits-activate', count)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }    
    
  /*TRANSFER CREDITS*/  
    
  transferCredits(credit:any) {
      return this.http.post(apiUrl + '/payment/credits-transfer', credit)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /**********/    
  /*CHAT API*/
  /**********/
	
  /*CHAT EXIST*/
	
  chatExist(code:any) {
      return this.http.post(apiUrl + '/chat/exist', code)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }	
    
  /*CREATE CHAT ROOM*/
    
  createChatRoom(code:any) {
      return this.http.post(apiUrl + '/chat/create', code)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*DELETE CHAT ROOM*/
    
  deleteChatRoom() {
      return this.http.get(apiUrl + '/chat/delete')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*NEXT EXPIRED CREDITS*/
    
  expiredCredits() {
      return this.http.get(apiUrl + '/payment/next')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
 /*LAST EXPIRED CREDITS*/
    
  lastExpiredCredits() {
      return this.http.get(apiUrl + '/payment/last')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*CHAT AUDIO CONNECT*/
    
  audioConnect(code:any) {
    console.log(code);
      return this.http.post(apiUrl + '/chat/listen', code)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }    
   
  /*************/    
  /*REPORTS API*/
  /*************/ 
    
  /*REPORTS EXIST*/
    
  reportExist() {
      return this.http.get(apiUrl + '/report/list')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*TRANSFER EMAILS LIST*/     
    
  reportsTransferEmail() {
      return this.http.get(apiUrl + '/report/mail/list')
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*TRANSFER HISTORY BY MAIL*/     
    
  reportsTransferByMail(email:any) {
      return this.http.post(apiUrl + '/report/transfer/mail', email)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  } 
    
  /*TRANSFER HISTORY BY DATE*/     
    
  reportsTransferByDate(date:any) {
      return this.http.post(apiUrl + '/report/transfer', date)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  } 
    
  /*PURCHASE HISTORY BY DATE*/     
    
  reportsPurchaseByDate(date:any) {
      return this.http.post(apiUrl + '/report/purchase', date)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  } 
    
  /*ACTIVATE AND USEGE BY DATE*/     
    
  reportsActivateByDate(date:any) {
      return this.http.post(apiUrl + '/report/activate', date)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /*PASSWORD AND USERS BY DATE*/     
    
  reportsPasswordByDate(date:any) {
      return this.http.post(apiUrl + '/report/users', date)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }
    
  /********************/    
  /*EXPORT REPORTS API*/
  /********************/
    
  exportTransferXml(email:any) {
      return this.http.post(apiUrl + '/report/transfer/xml', email)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }    
    
  exportTransferEmailXml(email:any) {
      return this.http.post(apiUrl + '/report/transfer/mail/xml', email)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }

  exportPurchaseXml(email:any) {
      return this.http.post(apiUrl + '/report/purchase/xml', email)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  } 
    
  exportActiveXml(email:any) {
      return this.http.post(apiUrl + '/report/activate/xml', email)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  } 
    
  exportPasswordXml(email:any) {
      return this.http.post(apiUrl + '/report/users/xml', email)
        .map((data:any) => {
            return data;  
        })
        .catch((err: HttpErrorResponse):Observable<any> => {
            
            let errorMsg = 'Error';
            return Observable.throw(errorMsg);
        });
  }

  checkAllUsers(room:any) {
    return this.http.post(apiUrl + '/chat/history', room)
      .map((data:any) => {
        return data;
      })
      .catch((err: HttpErrorResponse):Observable<any> => {

        let errorMsg = 'Error';
        return Observable.throw(errorMsg);
      });
  }
    
}
