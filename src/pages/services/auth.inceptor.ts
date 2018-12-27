import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = localStorage.getItem('authUniti');
        if (currentUser) {
            const authReg = request.clone({
				headers: request.headers.set('Authorization', 'Bearer ' + currentUser)
            });
			return next.handle(authReg);
        }else{	
			return next.handle(request);
		}

    }
}