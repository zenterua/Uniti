import {Injectable} from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class languageService {
  constructor() {}

  private subject = new Subject<any>();

  sendLanguage(language):void {
    this.subject.next(language);
  }

  getLanguage(): Observable<any> {
    return this.subject.asObservable();
  }
}
