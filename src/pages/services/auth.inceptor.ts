import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as jwt_decode from "jwt-decode";
import { App } from "ionic-angular";
import { LoginPage } from '../login/login';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	tokenEndTime:any;
	tokenLifeCoun:boolean = true;

	constructor(private appCtrl: App) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let currentUser = localStorage.getItem('authUniti');

		if (currentUser) {
			this.getDecodedAccessToken(currentUser);
			const currentDate = new Date().getTime();
 			if ( currentDate > this.tokenEndTime.exp * 1000 && this.tokenLifeCoun ) {
 				this.tokenLifeCoun = false;
				this.appCtrl.getRootNav().setRoot(LoginPage, {logout:true});
				window.localStorage.setItem('tokenLifeEnd', 'lifeEnd');
				window.localStorage.removeItem('authUniti');
			} else {
 				this.tokenLifeCoun = true;
				const authReg = request.clone({
					headers: request.headers.set('Authorization', 'Bearer ' + currentUser)
				});
				return next.handle(authReg);
			}
		} else {
			return next.handle(request);
		}

	}

	getDecodedAccessToken(token:string): any {
		try{
			return this.tokenEndTime = jwt_decode(token);
		}
		catch(Error){
			return null;
		}
	}
}