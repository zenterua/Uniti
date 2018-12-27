import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
    
export class DataUpdateService {
    
	private messageExist = new BehaviorSubject<any>({
		isupdate:'',
        cardupdate:''
	});
	
  	currentMessage = this.messageExist.asObservable();
	
    constructor(){}
    
	changeMessage(message: string) {
		this.messageExist.next(message)
	}
}