import {Injectable} from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class logoutService {

  constructor(){}

  private subject = new Subject<any>();

  sendLogout():void {
    this.subject.next();
  }

  getLogout(): Observable<any> {
    return this.subject.asObservable();
  }
}
