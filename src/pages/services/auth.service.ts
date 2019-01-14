import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const apiUrl = 'http://uniti.redstone.media:3000';

@Injectable()
 
export class AuthService {
	
    isLoggedin:boolean;
	  AuthToken;
    constructor(private http: HttpClient) {
        this.isLoggedin = false;
        this.AuthToken = null;
    }
    
    storeUserCredentials(token) {
        window.localStorage.setItem('authUniti', token);
        this.useCredentials(token);
    }
    
    useCredentials(token) {
        this.isLoggedin = true;
        this.AuthToken = token;
    }
    
    loadUserCredentials() {
        var token = window.localStorage.getItem('authUniti');
        this.useCredentials(token);
    }
    
    destroyUserCredentials() {
        this.isLoggedin = false;
        this.AuthToken = null;
    }
	
	authenticated(): boolean {
		if (window.localStorage.getItem('authUniti')){
			return true;
		}else{
			return false;
		}
	}
    
	authenticate(user:any): Observable<any> {
      return this.http.post(apiUrl + '/auth/login', user)
           .map((data:any) => {
               if (data && data['token']) {
                    this.isLoggedin = true;
                    this.storeUserCredentials(data['token']);
               } 
               return data;
            })
			.catch((err: HttpErrorResponse):Observable<any> => {
		        this.isLoggedin = false;
				let errorMsg = err;
				return Observable.throw(errorMsg);
			})
    }
    
    regitration(user:any): Observable<any> {
      return this.http.post(apiUrl + '/auth/register', user)
        .map((data:any) => {
                return data;
            })
			  .catch((err: HttpErrorResponse):Observable<any> => {
          let errorMsg = err.error;
          return Observable.throw(errorMsg);
        })
    }
    
    logout() {
        this.destroyUserCredentials();
    } 
}
