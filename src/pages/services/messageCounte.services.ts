import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {ApiDataService} from "./api.service";

@Injectable()
export class messageCounterService {
	private subject = new Subject<any>();
	totalCount: number = 0;
	usersArray:any = [];
	userMsg:any = [];
	user_Id:number = 0;
	findUser:boolean = false;

	constructor(private api: ApiDataService) {}

	messageCounter(userId, currentlyMsgCount) {
		this.totalCount = currentlyMsgCount;
		this.usersArray = [];
		this.userMsg = [];
		this.user_Id = userId;

		this.api.checkAllUsers({'code': window.localStorage.getItem('room_name')}).subscribe((data) =>{
			if ( data.status == 'OK' ) {
				this.userMsg = data.history.filter( (user) => {
					return  user.event == "user_message" && user.user_id == this.user_Id;
				});

				if ( window.localStorage.getItem('messageCount') != null ) {
					this.usersArray = JSON.parse(window.localStorage.getItem('messageCount'));
					this.usersArray.some( user => {
						return  user.userId === this.user_Id ? this.findUser = true : this.findUser = false;
					});

					if ( this.findUser ) {
						this.usersArray.forEach(user => {
							if ( user.userId === this.user_Id ) {
								this.totalMsgCount();
								user.messageLen = this.userMsg.length;
							}
						})
					} else {
						this.totalMsgCount();
						this.usersArray.push({'userId': userId, 'messageLen': this.userMsg.length});
					}
					window.localStorage.setItem('messageCount', JSON.stringify(this.usersArray));
				} else {
					this.totalMsgCount();
					this.usersArray.push({'userId': userId, 'messageLen': this.userMsg.length});
					window.localStorage.setItem('messageCount', JSON.stringify(this.usersArray));
				}
			}
		});
	}

	recountLocalMessages(userId, currentlyMsgCount, allusersInChat) {
		this.totalCount = currentlyMsgCount;
		this.user_Id = userId;
		this.api.checkAllUsers({'code': window.localStorage.getItem('room_name')}).subscribe((data) => {

			if (data.status == 'OK') {
				this.usersArray = JSON.parse(window.localStorage.getItem('messageCount'));
				this.userMsg = data.history.filter((user) => {
					return user.event == "user_message" && user.user_id == this.user_Id;
				});
				this.usersArray.some( user => {
					return  user.userId === this.user_Id ? this.findUser = true : this.findUser = false;
				});
				this.totalMsgCount();
				this.usersArray.forEach(user => {
					if (user.userId === this.user_Id) {
						user.messageLen = this.userMsg.length;
					}
				});

				allusersInChat.forEach( user => {
					if (user.id === userId) {
						user.chat = false;
					}
				});
				window.localStorage.setItem('messageCount', JSON.stringify(this.usersArray));
			}
		});
	}

	totalMsgCount() {
		let thisUser:any = {};
		if ( this.findUser ) {
			this.usersArray.forEach(user => {
				if ( user.userId === this.user_Id ) {
					thisUser = user;
				}
			});
			if ( this.userMsg.length > thisUser.messageLen ) {
				this.totalCount -= ( this.userMsg.length - thisUser.messageLen );
				this.subject.next(this.totalCount);
			}
		} else {
			this.totalCount -= this.userMsg.length;
			this.subject.next(this.totalCount);
		}
		this.findUser = false;
	}

	messagesCountOnLoad(allusersInChat) {
		let oldTotalMessages = 0;
		let newTotalMessages = 0;
		let totalMessagesFromBase = 0;
		this.usersArray = JSON.parse(window.localStorage.getItem('messageCount'));
		this.api.checkAllUsers({'code': window.localStorage.getItem('room_name')}).subscribe((data) =>{
			if ( data.status == 'OK' ) {
				if ( window.localStorage.getItem('messageCount') != null ) {
					allusersInChat.forEach( user => {
						let oldMessages = 0;
						let newMessages = 0;
						this.usersArray.forEach((localUser) => {
							if ( user.id == localUser.userId ) {
								oldMessages = localUser.messageLen;
								oldTotalMessages += localUser.messageLen;
							}
						});

						data.history.forEach( (fromBaseUser) => {
							if ( fromBaseUser.event == "user_message" ) {
								if ( fromBaseUser.user_id == user.id ) {
									newMessages++;
									newTotalMessages++;
								}
							}
						});
						if ( newMessages > oldMessages ) {
							user.chat = true;
						}
					});

					if ( newTotalMessages > oldTotalMessages ) {
						this.subject.next(newTotalMessages - oldTotalMessages);
					}
				} else {
					allusersInChat.forEach( (user) => {
						user.chat = true;
					});
					data.history.forEach( (user) => {
						if ( user.event == "user_message" ) {
							totalMessagesFromBase++;
							user.chat = true;
						}
					});
					if ( totalMessagesFromBase ) {
						this.subject.next(totalMessagesFromBase);
					}
				}

			}
		});
	}

	sendMsgCount(): Observable<any> {
		return this.subject.asObservable();
	}
}