import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, Platform, ToastController, AlertController, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/finally';
import { Clipboard } from '@ionic-native/clipboard';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AppRate } from '@ionic-native/app-rate';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';
import { ApiDataService } from '../services/api.service';
import { SocketIo } from '../services/socket.io.service';
import { DataUpdateService } from '../services/data.service';
import { ActiveCreditsVal } from '../services/active.number';
import { ForgotPage } from '../forgot/forgot';
import { ModalPayCard } from '../credit/credit';
import { AccountPage } from '../account/account';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { logoutService } from '../services/logout.service';
import { languageService } from '../services/language.service';

export declare var RTCMultiConnection: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  messages = [];
  messagesToUser = [];
  message:string = '';
  messageAdmin:any;
  nickname = '';
  connection:any;
  room_join:any;
  room_open:any = '';
  count:any;
  range:boolean = false;
  createRoomChat:boolean = false;
  joinRoomChat:boolean = false;
  record:boolean = false;
  messChatToAll:boolean = false;
  messCount:number = 0;
  messCountAdm:number = 0;
  users:any = [];
  openUsersChatList:boolean = false;
  activateCredit:boolean = false;
  activeCredits:number = 0;
  allCredits:number = 0;
  creditsToActive:any;
  isActiveTransfer:boolean = false;
  transferCredit:boolean = false;
  creditsToTransfer:any;
  sendCreditToUser:any = {};
  allCreditsTriger:boolean = false;
  activeCreditsTriger:boolean = false;
  transferEmail: FormGroup;
  emailTransform:string;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  closePayCredits:boolean = false;
  passForCredit:boolean = false;
  passToCredit:string;
  openRoomShow:boolean = false;
  joinRoomShow:boolean = false;
  hideStartButton:boolean = false;
  messChatToAdmin:boolean = false;
  chatName:string;
  layerClose:boolean = false;
  startVoiceTime:boolean = false;
  voiceActive:boolean = false;
  userData:any = {
    username: '',
    email:'',
    avatar:'',
    id:''
  };
  groupChatStart:boolean = false;
  hasTouchID:boolean = false;
  ticks = 0;
  minutesDisplay: number = 0;
  hoursDisplay: number = 0;
  secondsDisplay: number = 0;
  sub: Subscription;
  msg:any;
  numberVoiceChatUsers:number = 0;
  getAllVoiceConnection:any;
  subscribTimer:any;
  checkVoiceRoom:any;
  userId:any;
  isAdmin:boolean = false;
  idUser:any;
  timeEnd:any;
  timeLess:any;
  dateUpdate:any;
  soundOff:boolean = false;
  startListen:boolean = false;
  isAdminConnected:boolean = false;
  networkConnectStatus:boolean = true;
  checkVoice = true;
  chekRoomExist:any;
  activeUserInGroupLen:any = 0;
  globalRoomTime:number;
  roomLife_hours:number;
  roomLife_minutes:number;
  roomLife_second:number;
  globalHistoryChat:any = [];
  boardRoom:any;
  thisPrivateChatUser: any;
  lockedUsers:any = [];
  tourGuidSpeakNotifi:boolean = true;
  globalLang:string;
  chatMessageFormat: string;
  subscription: Subscription;
  checkSendMessage: boolean = false;
  checkAdminSendMessage: boolean = false;
  checkNetError:boolean = true;
  keyCheckExist: boolean = false;

  @ViewChild('audioPlay') audioPlay: ElementRef;
  @ViewChild('openKeyField1') openKeyField1;
  @ViewChild('openKeyField2') openKeyField2;
  @ViewChild('openKeyField3') openKeyField3;
  @ViewChild('openKeyField4') openKeyField4;
  @ViewChild('openKeyField5') openKeyField5;
  @ViewChild('userItem') userItem;
  @ViewChild('fullchat') fullchat;
  @ViewChild('voicechat') voicechat;
  @ViewChild('chattoprivatuser') chattoprivatuser;
  @ViewChild('chattoalluser') chattoalluser;
  @ViewChild('myMessage') myMessage: ElementRef;
  @ViewChild('myAdminMessage') myAdminMessage: ElementRef;

  constructor(public navCtrl: NavController,
              public socket: SocketIo,
              public platform: Platform,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController,
              private clipboard: Clipboard,
              public modalCtrl: ModalController,
              private faio: FingerprintAIO,
              private api: ApiDataService,
              public viewCtrl: ViewController,
              private dataUpdateService:DataUpdateService,
              public loadingCtrl: LoadingController,
              private backgroundMode: BackgroundMode,
              public translate: TranslateService,
              private appRate: AppRate,
              public globalActive: ActiveCreditsVal,
              private zone: NgZone,
              private localNotifications: LocalNotifications,
              private network: Network,
              private logoutService: logoutService,
              private languageService: languageService) {
    this.socket = new SocketIo({
      query: {
        token: window.localStorage.getItem('authUniti'),
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity
      }
    }).connect();

    platform.ready().then(() => {
      this.backgroundMode.enable();
      this.faio.isAvailable()
        .then((result: any) => {this.hasTouchID = true;})
        .catch((error: any) => {this.hasTouchID = false;});

      this.connection = new RTCMultiConnection();
      this.connection.socketURL = 'https://uniti.redstone.media:9001/';
      this.connection.socketMessageEvent = 'audio-conference-demo';
      this.connection.session = {audio: true,video: false};
      this.connection.mediaConstraints = {audio: true,video: false};
      this.connection.bandwidth = {audio: 6};
      this.connection.sdpConstraints.mandatory = {OfferToReceiveAudio: true,OfferToReceiveVideo: false};
      let containerAudio = this.audioPlay.nativeElement;
      let fullchat = this.fullchat.nativeElement;
      let voicechat = this.voicechat.nativeElement;
      this.room_join = window.localStorage.getItem('room_name');
      this.boardRoom = window.localStorage.getItem('room_name');

      this.adminGetAllUsers();

      // Check chat on first connect
      this.api.chatExist({'code': window.localStorage.getItem('room_name')}).subscribe((data) =>{ // admin

        if ( data.status == 'OK' && window.localStorage.getItem('Group_Initiator') == '1') {

          setTimeout( () => {
            let currentDate = new Date().getTime();
            let roomCreateDate = this.globalRoomTime * 1000;
            let roomLife = (currentDate - roomCreateDate) / 1000;
            this.roomLife_hours = Math.floor(roomLife / 3600);
            this.roomLife_minutes = (Math.floor(roomLife/ 60) - (Math.floor(roomLife / 3600) * 60));
            this.roomLife_second = Math.floor(roomLife % 60);

            setTimeout( () => {
              this.startTimer(this.roomLife_hours,this.roomLife_minutes,this.roomLife_second);
            }, 1000);

          },  400);

          this.socket.emit('room', window.localStorage.getItem('room_name'));
          this.socket.emit('list_users');
          this.joinRoomShow = false;
          this.openRoomShow = true;
          this.isAdmin = true;
          this.startVoiceTime = true;
          this.hideStartButton = true;

        } else if ( data.status == 'OK' && window.localStorage.getItem('Group_listener') == '1') { // user
          this.startTimer();
          this.hideStartButton = true;
          this.joinRoomShow = true;
          this.socket.emit('room', window.localStorage.getItem('room_name'));
          this.socket.emit('list_users');
          this.checkVoiceChatOpen();
          this.getUserData();
        }

        setTimeout(() => {
          if ( this.globalHistoryChat.length > 0 ) {

            let adminMessage = this.globalHistoryChat[0].filter( (user) => {
              return  user.event == "admin_message" && user.value != '';
            });

            let userMessage = this.globalHistoryChat[0].filter( (user) => {
              return user.event == "admin_message" || user.event == "user_message" || user.event == "private_message" && user.user_id == this.userData.id && user.value != '';
            });

            let onlyMyMessage = userMessage.filter( (user) => {
              return user.event == "admin_message" || user.user_id == this.userData.id;
            });

            if ( window.localStorage.getItem('Group_Initiator') == '1' ) { // admin

              if ( adminMessage ) { // check if adminMessage not empty
                adminMessage.forEach( (user) => {
                  this.messages.push({text: user.value, from:this.nickname, date: new Date(user.date * 1000)});
                });
              }

            } else if (window.localStorage.getItem('Group_listener') == '1' ) { // user

              if ( onlyMyMessage ) { // check if userMessage not empty

                if ( adminMessage ) this.isAdmin = false; // check if admin message not empty, in not we show admin message col

                onlyMyMessage.forEach( (user) => {
                  if ( user.event == "admin_message" || user.event == "private_message" ) {
                    this.messages.push({text: user.value, from:'TourGuide', date: new Date(user.date * 1000)});
                  } else if ( user.event == "user_message" ) {
                    this.messages.push({text: user.value, from:this.nickname, date: new Date(user.date * 1000)});
                  }
                });

              }

            }
          }
          this.myMessage.nativeElement.setAttribute('data-loadChat', 'loadingFromBase');
        }, 1000);

      });

      this.connection.onPeerStateChanged = (event)=> {
        // check chat is full
        if(this.connection.extra.roomAdmin == this.connection.sessionid && event.iceConnectionState == 'connected' && this.connection.getAllParticipants().length >= this.activeCredits){
          this.connection.extra.fullRoom = 'full';
          this.connection.updateExtraData();
        } else if (this.connection.extra.roomAdmin == this.connection.sessionid && event.iceConnectionState == 'disconnected' && this.connection.getAllParticipants().length <= this.activeCredits){
          this.connection.extra.fullRoom = '';
          this.connection.updateExtraData();

        }

        setTimeout( () => {
          if(event.iceConnectionState == 'new' && event.signalingState == 'have-remote-offer' && event.extra.fullRoom == 'full'){
            this.translate.get('fullRoom').subscribe((val)=>{
              let fullRoom = this.alertCtrl.create({
                title: val,
                buttons: [{
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {

                  }
                }]
              });
              fullRoom.present();
              this.reconnect();
              this.voiceActive = false;
            });

          }
        }, 1000);

        if( event.iceConnectionState == 'disconnected' && event.extra.roomAdmin == window.localStorage.getItem('room_name') && event.extra.close !== 'closed') {
          setTimeout(() => {
            var z = 0;
            this.connection.peers.getAllParticipants().forEach((userid)=> {
              var admin = this.connection.peers[userid].extra.roomAdmin;

              if(admin == this.connection.sessionid) {
                z = 1;
              }

            });
            if (z == 0) {
              this.translate.get('admin_networ_problem_first').subscribe((val)=>{
                this.localNotifications.schedule({
                  id:1,
                  title:val.txt1,
                  priority:1
                });
                let internet = this.alertCtrl.create({
                  title: val.txt1,
                  buttons: [{
                    text: val.txt2,
                    role: 'cancel'
                  }]
                });
                internet.present();
              });
            }

          }, 14000);

          setTimeout(()=> {
            var z = 0;
            this.connection.peers.getAllParticipants().forEach((userid)=> {
              var admin = this.connection.peers[userid].extra.roomAdmin;
              if(admin == this.connection.sessionid) {
                z = 1;
              }

            });

            if(z == 0) {
              this.translate.get('admin_network_problem').subscribe((val)=>{
                this.localNotifications.schedule({
                  id:1,
                  title:val.txt1,
                  priority:1
                });
                let internet = this.alertCtrl.create({
                  title: val.txt1,
                  buttons: [{
                    text: val.txt2,
                    role: 'cancel'
                  }]
                });
                internet.present();
              });

              this.voiceActive = false;
              this.room_join = '';
              this.reconnect();
              this.checkVoiceChatOpen();

            } else {

            }
          }, 30000);
        }
      };

      this.connection.onleave = (event)=> {
        if (this.connection.extra.roomAdmin == this.connection.sessionid && this.connection.getAllParticipants().length <= this.activeCredits){
          this.connection.extra.fullRoom = '';
          this.connection.updateExtraData();
        }
        if (event.extra.close == 'closed') {
          this.reconnect();
          voicechat.classList.remove('open');
          this.voiceActive = false;
          this.room_join = '';
          this.checkVoiceChatOpen();
          window.localStorage.removeItem('listen_start');

          this.translate.get('stop_speak').subscribe((val)=>{
            this.localNotifications.schedule({
              id:1,
              title:val.txt1,
              priority:1
            });
            let stop_speak = this.alertCtrl.create({
              title: val.txt1,
              buttons: [{
                text: val.txt2,
                role: 'cancel',
                handler: () => {

                }
              }]
            });
            stop_speak.present();
          });
        }
      };

      this.connection.onstream = (e)=> {
        let mediaElement = e.mediaElement;
        containerAudio.appendChild(mediaElement);
        setTimeout(function(){

          if (mediaElement){
            mediaElement.play();
          }
        }, 1000);

        mediaElement.id = e.streamid;

        if(e.type == 'local' && !this.connection.extra.roomAdmin){
          this.connection.streamEvents[e.streamid].stream.mute();
        }

        if(e.type == 'remote' && this.connection.extra.roomAdmin){
          this.connection.streamEvents[e.streamid].stream.mute();
        }
      };

      this.connection.onRoomFull = function(roomid){
        fullchat.classList.add('show-elem');
      };

      this.connection.onstreamended = function(e){
        let mediaElement:any = document.getElementById(e.streamid);

        fullchat.classList.remove('show-elem');
        if (mediaElement) {
          mediaElement.parentNode.removeChild(mediaElement);
        }

      };
    });

    this.transferEmail = new FormGroup({
      trEmail: new FormControl('', [<any>Validators.required, <any>Validators.pattern(this.emailPattern)]),
      isActiveTransfer: new FormControl(),
      creditsToTransfe: new FormControl()
    });

    this.getAllVoiceConnection = this.checkVoiceRoom = Observable.interval(3000);

    this.translate.get('rate_texts').subscribe((val)=>{
      this.appRate.preferences = {
        promptAgainForEachNewVersion:true,
        displayAppName:'Uniti',
        storeAppURL:{
          ios: '1407364757',
          android: 'market://details?id=uniti.app.com',
        },
        simpleMode:true,
        customLocale:{
          title: val.rate_txt1,
          message: val.rate_txt2,
          rateButtonLabel: val.rate_txt3,
          laterButtonLabel: val.rate_txt4,
          cancelButtonLabel: val.rate_txt5
        },
        callbacks:{
          onButtonClicked: function(buttonIndex){
            if (buttonIndex == 3) {
              window.localStorage.setItem('unitiRate', 'isRate');
            }
          }
        }
      };
    });

    this.onTransferCredit().subscribe((data:any) => {
      this.translate.get('transform_txt').subscribe((word)=>{
        let credits;
        let active;
        let inactive;
        let state;
        let lang = window.localStorage.getItem('unitiLang').toString();
        if (lang == 'pl') {
          if (data.amount == 1) {
            credits = word.txt_3;
            active = word.txt_6;
            inactive = word.txt_7;
          }else{
            if (data.amount == 2 || data.amount == 3 || data.amount == 4 || data.amount == 22 || data.amount == 23 || data.amount == 24 || data.amount == 32 || data.amount == 33 || data.amount == 34) {
              credits = word.txt_4;
              active = word.txt_8;
              inactive = word.txt_9;
            }else{
              credits = word.txt_5;
              active = word.txt_10;
              inactive = word.txt_11;
            }
          }
        }else{
          active = word.txt_6;
          inactive = word.txt_7;
          if (data.amount == 1) {
            credits = word.txt_3;
          }else{
            credits = word.txt_4;
          }
        }
        if (data.type == 'active') {
          state = active;
        }else{
          state = inactive;
        }

        if (data.to == this.userData.id) {
          this.api.infoCredits().subscribe((data)=>{
            if (data.status == 'OK' && data.error == false) {
              this.activeCredits = data.active;
              this.allCredits = data.passive;
            }else{
              clearInterval(this.globalActive.getActiveCreditsNumber);
            }
          });

          let creditTransfer = this.alertCtrl.create({
            title: word.txt_1 + ' ' + + data.amount + ' ' + state + ' '
              + credits + ' ' + word.txt_2 + ' ' + data.from_name,
            buttons: [{text: 'OK',role: 'cancel'}]
          });
          creditTransfer.present();
          this.localNotifications.schedule({
            id:1,
            title: word.txt_1 + ' ' + data.amount + ' ' + state + ' '
              + credits + ' ' + word.txt_2 + ' ' + data.from_name,
            priority:2
          });
        }
      });
    });

    this.getMessages().subscribe((message:any) => {
      if ( window.localStorage.getItem('room_name') != null ) {
        this.messages.push(message);

        if (this.messChatToAll == false){
          this.messCount ++;
          this.localNotifications.schedule({
            id:1,
            title:message.from,
            text:message.text,
            priority:2
          });
        }
        if (this.messChatToAdmin == false){
          this.messCountAdm ++;
          this.localNotifications.schedule({
            id:1,
            title:message.from,
            text:message.text,
            priority:2
          })
        }
        if (this.isAdmin == true) {
          this.idUser = message.id;
          if (this.users && this.messChatToAdmin == false) {

            this.users.forEach( (user) => {
              if ( user.id == this.idUser) {
                user.chat = true;
              }
            });
          }
        }
      }
    });

    this.getPrivateMessages().subscribe((message:any) => {
      if (this.messChatToAdmin == false){
        this.messCountAdm ++;
      }
      this.messages.push(message);
    });

    this.getUsers().subscribe((data:any) => {

      this.socket.emit('list_admin');
      this.adminGetAllUsers();
    });

    this.onSocketCloseRoom().subscribe((data:any) => {
      if (window.localStorage.getItem('room_name') == data && this.joinRoomShow == true) {
        this.clearTimer();
        this.openRoomShow = false;
        this.joinRoomShow = false;
        this.openUsersChatList = false;
        this.layerClose = false;
        this.startVoiceTime = false;
        this.hideStartButton = false;
        this.groupChatStart = false;
        this.isAdmin = false;
        this.isAdminConnected = false;
        this.checkVoice = true;
        window.localStorage.removeItem('listen_start');
        window.localStorage.setItem('Group_Initiator', '');
        window.localStorage.setItem('room_name', '');
        this.clearCounters();
        clearTimeout(this.timeEnd);
        clearTimeout(this.timeLess);
        this.record = false;
        this.socket.emit('leave');

        this.translate.get('tour_guide_close').subscribe((val)=>{
          let groupClose = this.alertCtrl.create({
            title: val,
            buttons: [{
              text: 'OK',
              role: ''
            }]
          });
          groupClose.present();

          this.localNotifications.schedule({
            id:1,
            title:val,
            priority:1
          });
        });
      }
    });

    this.network.onDisconnect().subscribe(() => {

      clearInterval(this.globalActive.getActiveCreditsNumber);
      if ( this.checkNetError ) {
        setTimeout(()=>{
          this.checkNetError = false;
          if (this.networkConnectStatus == false){
            this.translate.get('admin_left_room').subscribe((val)=>{
              this.localNotifications.schedule({
                id:1,
                title:val.txt_5,
                priority:1
              });
              let noNetwork = this.alertCtrl.create({
                title: val.txt_5,
                buttons: [{
                  text: 'Ok',
                  role: 'cancel'
                }]
              });
              noNetwork.present();
            });
          }
        },3000);
      }

      this.networkConnectStatus = false;
    });

    this.network.onConnect().subscribe(() => {
      this.checkNetError = true;
      this.networkConnectStatus = true;
      let room = window.localStorage.getItem('room_name');
      this.getUserData();
      this.getCredisInfo();

      this.reconnect();

      this.connection.checkPresence(room, (isRoomExist, roomid) => {
        if (isRoomExist) {
          if (window.localStorage.getItem('listen_start')) {
            this.connection.join(room);
          }
        } else {
          if ( this.connection.extra.roomAdmin == room ) {
            this.record = false;
          }
        }
      });

      this.adminGetAllUsers();

    });

    this.onSocketDisconnect().subscribe((data:any) => {
      let room = window.localStorage.getItem('room_name');
      if (room){
        this.socket.emit('room', room.toLowerCase());
      }
    });

    this.logoutService.getLogout().subscribe( () => {
      if ( window.localStorage.getItem('Group_Initiator') == '1'  && window.localStorage.getItem('room_name') != '') {
        this.exitCreateChatMethod();
      } else {
        this.voiceActive = false;
        this.joinRoomShow = false;
        this.room_join = '';
        this.room_open = '';
        this.messChatToAdmin = false;
        this.isAdmin = false;
        this.messCount = 0;
        this.socket.emit('leave');
        window.localStorage.removeItem('room_name');
        window.localStorage.removeItem('listen_start');
        window.localStorage.setItem('Group_listener', '');
        this.hideStartButton = false;
        this.messages = [];
        this.reconnect();
        clearInterval(this.chekRoomExist);
      }
    });

  }

  ionViewDidLoad() {
    window.localStorage.removeItem('logoutEvent');
    this.creditsAmount();
    this.getUserData();
    this.dataUpdateService.currentMessage.subscribe(message => {
      if (message) {
        this.dateUpdate = message;
        if (this.dateUpdate.isupdate == 'updated'){
          this.getUserData();
        }
      }
    });
    setTimeout( () => {
        if ( window.localStorage.getItem("lockedUsers") ) {
          this.lockedUsers = JSON.parse(window.localStorage.getItem("lockedUsers"));

          this.lockedUsers.map( (topUser) => {
            this.users.map( ( user, i ) => {
              if ( user.id == topUser.id ) {
                this.userItem.nativeElement.children[i].classList.add('lock');
              }
            }) ;
          });

        }
      },1000);

    this.globalLang = window.localStorage.getItem('unitiLang');

    this.subscription = this.languageService.getLanguage().subscribe( language => {
      this.globalLang = language;
      this.chatTimeFormatMsg();
    });

    this.chatTimeFormatMsg();

  }

  /* EXIT APP */

  ionViewWillUnload() {
    this.socket.disconnect();
    this.api.deleteChatRoom();
    clearInterval(this.globalActive.getActiveCreditsNumber);
  }

  /* GET CREDITS INFO */

  getCredisInfo(){
    this.globalActive.getActiveCreditsNumber = setInterval(()=>{
      this.creditsAmount();
    },5000);
  }

  /* GET CREDITS AMOUNT */

  creditsAmount(){
    this.api.infoCredits().subscribe((data)=>{
      if (data.status == 'OK' && data.error == false) {
        this.activeCredits = data.active;
        this.allCredits = data.passive;
        if (this.activeCredits > 0) {
          this.ifTimeLeft();
        }
      }else{
        clearInterval(this.globalActive.getActiveCreditsNumber);
      }
    });
  }

  /* ERRORS FROM SERVER */

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

  /* CREATE CHAT ROOM */

  getUserData(){
    this.api.getUserData().subscribe((data)=>{
      if (data.error == false && data.status == 'OK'){
        this.nickname = data.first_name;
        this.userData = {
          username: data.first_name,
          email: data.email,
          avatar: data.avatar,
          id: data.id
        };
      }
    });
  }

  /* ROOM TIMER */

  private startTimer(h = 0, m = 0, s = 0) {
    let timer = Observable.timer(1, 1000);
    this.sub = timer.subscribe(
      t => {
        this.ticks = t;
        this.secondsDisplay = this.getSeconds(this.ticks + ( s * 60 ));
        this.minutesDisplay = this.getMinutes(this.ticks + ( m * 60 ));
        this.hoursDisplay = this.getHours(this.ticks +  (h * 3600) );
      }
    );
  }

  private getSeconds(ticks: number) {return this.pad(ticks % 60);}

  private getMinutes(ticks: number) {return this.pad((Math.floor(ticks / 60)) % 60);}

  private getHours(ticks: number) {return this.pad(Math.floor((ticks / 60) / 60));}

  private pad(digit: any) { return digit <= 9 ? '0' + digit : digit;}

  /* COPY TO CLIPBOARD */

  copyToClipboard(text:string){
    this.clipboard.copy(text).then(
      (resolve: string) => {
        this.translate.get('clipboard_copy').subscribe((val)=>{
          this.showToast(val);
        });
      },
      (reject: string) => {
        this.translate.get('clipboard_err').subscribe((val)=>{
          this.showToast(val);
        })
      });
  }

  /* TRANSFER CREDIT TO ACTIVE */

  startActivateCredits(){
    this.transferCredit = false;
    this.range = false;
    if (this.allCredits == 0) {
      this.translate.get('activate_credits_err').subscribe((val)=>{
        let alert3 = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
        alert3.present();
      })
    }else{
      this.activateCredit = !this.activateCredit;
      setTimeout(()=> this.openKeyField4.nativeElement.focus(), 200);
    }
  }

  addCreditToActive(){
    if (this.creditsToActive > 0) {
      if (this.creditsToActive > this.allCredits) {
        this.translate.get('activate_credits_err_less').subscribe((val)=>{
          let alertNotCorrect = this.alertCtrl.create({
            title: val,
            buttons: ['OK']
          });
          alertNotCorrect.present();
        });
      }else{
        this.translate.get('activate_credits').subscribe((val)=>{
          let many;
          if (this.creditsToActive > 1) {many = val.txt2;
          }else{many = val.txt5;}

          let activeTransfer = this.alertCtrl.create({
            title: val.txt1 + this.creditsToActive + many,
            subTitle: val.txt4,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.api.activateCredits({"amount":this.creditsToActive}).subscribe((data)=>{
                  if (data.status == 'OK' && data.error == false){
                    this.activeCredits += +this.creditsToActive;
                    this.allCredits = this.allCredits - +this.creditsToActive;
                    this.activateCredit = false;
                    this.ifTimeLeft();
                    this.creditsToActive = '';
                  }else{
                    this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
                      let activateErr = this.alertCtrl.create({
                        title: err,
                        buttons: ['OK']
                      });
                      activateErr.present();
                    });
                  }
                });
              }
            },{
              text: val.txt3,
              role: 'cancel'
            }]
          });
          activeTransfer.present();
        });

      }

    }else{
      this.translate.get('enter_the_value').subscribe((val)=>{
        let alert2 = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
        alert2.present();
      });
    }
  }

  /* TRANSFER CREDIT TO USER */

  transferCredits(){
    this.sendCreditToUser = {};
    this.emailTransform = '';
    this.range = false;
    this.activateCredit = false;
    if ((this.allCredits == 0)&&(this.activeCredits == 0)) {
      this.translate.get('activate_credits_err_less').subscribe((val)=>{
        let alert1 = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
        alert1.present();
      });
    }else{
      this.transferCredit = !this.transferCredit;
      this.isActiveTransfer = false;
      setTimeout(()=> this.openKeyField3.nativeElement.focus(), 200);
      if (this.allCredits == 0) {
        this.isActiveTransfer = true;
      }
    }
  }

  transferCreditToUser(form){

    if (form.valid){
      let alertNotCorrectTr,
          alertNotCorrectTr2;

      this.translate.get('no_credits_to_transfer').subscribe((val)=>{
        alertNotCorrectTr = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
      });
      this.translate.get('no_enough_credits_to_transfer').subscribe((val)=>{
        alertNotCorrectTr2 = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
      });


      if (this.creditsToTransfer > 0 && this.emailTransform !== this.userData.email) {

        if (this.isActiveTransfer == true ){  // transfer active credits

          if (this.creditsToTransfer > this.activeCredits) {
            alertNotCorrectTr.present();
          }else{
            this.translate.get('transfer_credits_err').subscribe((val)=>{
              let creditWord;
              if (this.creditsToTransfer > 1){
                creditWord = val.txt2;
              }else{
                creditWord = val.txt4;
              }
              let confirmTransfer = this.alertCtrl.create({
                title: val.txt1 + this.creditsToTransfer + creditWord + this.emailTransform,
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.connection.checkPresence(window.localStorage.getItem('room_name'), (isRoomExist, roomid) => {
                      if (isRoomExist && window.localStorage.getItem('Group_Initiator') == '1') {
                        this.translate.get('activeCreditTransErr').subscribe((val)=>{
                          let creditTranserOnActiveRoom = this.alertCtrl.create({
                            title: val,
                            buttons: [{
                              text: 'OK',
                              handler: () => {
                              }
                            }]
                          });
                          creditTranserOnActiveRoom.present();
                          return;
                        });

                      }else{
                        this.transferActiveFunc();
                        return;
                      }
                    });
                  }
                },{
                  text: val.txt3,
                  role: 'cancel'
                }]
              });
              confirmTransfer.present();
            });
          }
        }else{ // transfer passive credits
          if (this.creditsToTransfer > this.allCredits) {
            alertNotCorrectTr2.present();
          }else{
            let creditWordIn;
            this.translate.get('transfer_credits_err2').subscribe((val)=>{
              if (this.creditsToTransfer > 1){
                creditWordIn = val.txt2;
              }else{
                creditWordIn = val.txt4;
              }
              let confirmTransfer2 = this.alertCtrl.create({
                title: val.txt1 + this.creditsToTransfer + creditWordIn + this.emailTransform,
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.transferAllFunc();
                  }
                },{
                  text: val.txt3,
                  role: 'cancel'
                }]
              });
              confirmTransfer2.present();
            });
          }
        }
      }else{
        this.translate.get('enter_the_value').subscribe((val)=>{
          let alertChhoseValue = this.alertCtrl.create({
            title: val,
            buttons: ['OK']
          });
          alertChhoseValue.present();
        });
      }
    }else{
      this.translate.get('enter_valid_user_email').subscribe((val)=>{
        let alertEmail = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
        alertEmail.present();
      });
    }
  }

  transferActiveFunc(){
    let activeCred = {
      amount:this.creditsToTransfer,
      email:this.emailTransform,
      type:'active'
    },
    checkTransferConnect,
    transferConnectNetProblem,
    checkTransfer,
    disconectJoinToRoom;

    this.translate.get('badNetWorkCreditError').subscribe((val)=>{
      checkTransfer = this.loadingCtrl.create({
        content: val
      });

    });
    this.translate.get('badNetwork').subscribe((val)=>{
      disconectJoinToRoom = this.alertCtrl.create({
        title: val,
        buttons: [{
          text: 'OK',
          handler: () => {}
        }]
      });

    });
    checkTransferConnect = setTimeout( () => {
      checkTransfer.present();
    }, 1500);
    transferConnectNetProblem = setTimeout( () => {
      disconectJoinToRoom.present();
      checkTransfer.dismiss();
    }, 11500);

    this.api.transferCredits(activeCred).subscribe((data)=>{
      if (data.status == 'OK' && data.error == false){
        clearInterval(checkTransferConnect);
        clearInterval(transferConnectNetProblem);
        checkTransfer.dismiss();
        this.sendCreditToUser = {
          number:this.creditsToTransfer,
          active:this.isActiveTransfer
        };
        this.activeCredits -= +this.creditsToTransfer;
        this.creditsToTransfer = '';
        this.transferCredit = false;
        this.creditsAmount();
      }else{
        this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
          let errTransfering = this.alertCtrl.create({
            title: err,
            buttons: ['OK']
          });
          errTransfering.present();
        });
      }
    })
  }

  transferAllFunc(){
    let activeCred = {
      amount:this.creditsToTransfer,
      email:this.emailTransform,
      type:'passive'
    },
    checkTransferConnect,
    transferConnectNetProblem,
    checkTransfer,
    disconectJoinToRoom;

    this.translate.get('badNetWorkCreditError').subscribe((val)=>{
      checkTransfer = this.loadingCtrl.create({
        content: val
      });

    });
    this.translate.get('badNetwork').subscribe((val)=>{
      disconectJoinToRoom = this.alertCtrl.create({
        title: val,
        buttons: [{
          text: 'OK',
          handler: () => {}
        }]
      });

    });
    checkTransferConnect = setTimeout( () => {
      checkTransfer.present();
    }, 1500);
    transferConnectNetProblem = setTimeout( () => {
      disconectJoinToRoom.present();
      checkTransfer.dismiss();
    }, 11500);

    this.api.transferCredits(activeCred).subscribe((data)=>{
      if (data.status == 'OK' && data.error == false){
        clearInterval(checkTransferConnect);
        clearInterval(transferConnectNetProblem);
        checkTransfer.dismiss();
        this.sendCreditToUser = {
          number:this.creditsToTransfer,
          active:this.isActiveTransfer
        };
        this.allCredits -= +this.creditsToTransfer;
        this.creditsToTransfer = '';
        this.transferCredit = false;
      }else{
        this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
          let errTransfering = this.alertCtrl.create({
            title: err,
            buttons: ['OK']
          });
          errTransfering.present();
        });
      }
    })
  }

  transferIsActive(){
    if (this.isActiveTransfer == true) {
      if ( (this.activeCredits == 0) && (this.activeCreditsTriger == true) ) {
        this.translate.get('no_credits_to_transfer').subscribe((val)=>{
          let alertActive = this.alertCtrl.create({
            title: val,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.isActiveTransfer = false;
              }
            }]
          });
          alertActive.present();
        });
      }
    }else{
      if ( (this.allCredits == 0) && (this.allCreditsTriger == true) ) {
        this.translate.get('only_active_credits').subscribe((val)=>{
          let alertActiveNo = this.alertCtrl.create({
            title: val,
            buttons: [{
              text: 'OK',
              role: 'cancel',
              handler: () => {
                this.isActiveTransfer = true;
              }
            }]
          });
          alertActiveNo.present();
        });
        return;
      }
    }
  }

  /* BUE CREDITS */

  openRange(){
    this.api.infoCreditCard().subscribe((data)=>{
      if ((data.status == 'OK' && data.error == false) || (window.localStorage.getItem('isCard') == 'active')) {
        if (this.hasTouchID == true) {
          this.faio.show({
            clientId: 'UnitTouchID',
            clientSecret: 'password',
            disableBackup:true,
            localizedFallbackTitle: 'Use Pin',
            localizedReason: 'Please authenticate'
          })
            .then((result: any) => {
              this.passForCredit = false;
              this.activateCredit = false;
              this.transferCredit = false;
              this.range = true;
              this.count = '';
              this.closePayCredits = true;
              this.passToCredit = '';
              setTimeout(()=> this.openKeyField2.nativeElement.focus(), 200);
            })
            .catch((error: any) => {

            });
        }else{
          this.range = false;
          this.count = 0;
          this.passForCredit = true;
          setTimeout(()=> this.openKeyField1.nativeElement.focus(), 200);
        }
      }else{
        this.translate.get('add_pay_card').subscribe((val)=>{
          let setPayCard = this.alertCtrl.create({
            title: val.txt1,
            buttons: [{
              text: 'OK',
              handler: () => {
                let openPayCardModal = this.modalCtrl.create(ModalPayCard);
                openPayCardModal.present();
              }
            },
              {
                text:  val.txt2,
                role: 'cancel'
              }]
          });
          setPayCard.present();
        });
      }
    });
  }

  closeRange(){
    this.range = false;
    this.count = 0;
    this.passForCredit = false;
    this.activateCredit = false;
    this.transferCredit = false;
  }

  openPayForCredits(){
    this.api.chekPass({'password':this.passToCredit}).subscribe((data)=>{
      if (data.status == 'OK' && data.error == false){
        this.passForCredit = false;
        this.activateCredit = false;
        this.transferCredit = false;
        this.range = !this.range;
        this.count = '';
        this.closePayCredits = true;
        this.passToCredit = '';
        setTimeout(()=> this.openKeyField2.nativeElement.focus(), 200);
      }else{
        this.translate.get('password_inccorect').subscribe((val)=>{
          let errPass = this.alertCtrl.create({
            title: val,
            buttons: [{
              text: 'OK',
              role: 'cancel'
            }]
          });
          errPass.present();
        });
      }
    })
  };

  payCreditsConfirm(){
    if (this.count > 0) {
      let payWord;
      this.translate.get('purchase').subscribe((val)=>{
        if (this.count > 1){
          payWord = val.txt2;
        }else{
          payWord = val.txt4;
        }
        let aconfirmPay = this.alertCtrl.create({
          title: val.txt1 + this.count + payWord + (this.count*10)/100,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.payCredits();
            }
          },
            {
              text: val.txt3,
              role: 'cancel',
              handler: () => {
              }
            }]
        });
        aconfirmPay.present();
      });
      this.activeCreditsTriger = true;
    }else{
      this.translate.get('please_choose_correct_value').subscribe((val)=>{
        let payValue = this.alertCtrl.create({
          title: val,
          buttons: [{
            text: 'OK',
            role: 'cancel'
          }]
        });
        payValue.present();
      });
    }

  }

  payCredits(){
    let amount = {'amount': +this.count}, loginPay;
    this.translate.get('please_wait').subscribe((val)=>{
      loginPay = this.loadingCtrl.create({
        content: val
      });
      loginPay.present();
    });
    this.api.buyCredits(amount)
      .finally(()=>{
        loginPay.dismiss();
      })
      .subscribe((data)=>{
        if (data.status == 'OK' && data.error == false) {
          this.allCredits += +this.count;
          this.range = false;
          this.closePayCredits = false;
        }else{
          this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
            let errorBuy = this.alertCtrl.create({
              title: err,
              buttons: [{
                text: 'OK',
                role: 'cancel'
              }]
            });
            errorBuy.present();
          })
        }
      })
  }

  /* CREATE CHAT ROOM */

  generatePassword(){
    const room_key = Math.random().toString(36).slice(-4);
    this.checkExistRoom(room_key);
  }

  createRoom(){
    this.createRoomChat = true;
    this.joinRoomChat = false;
    const room_key = Math.random().toString(36).slice(-4);
    this.checkExistRoom(room_key);
  }

  checkExistRoom(key) {
    this.keyCheckExist = false;
    this.api.chatExist({'code': key}).subscribe(data => {
      if (data.status === 'OK') {
        key = Math.random().toString(36).slice(-4);
        this.checkExistRoom(key);
      } else  if ( data.status === 'FAIL' && data.error_msg == 'chat_not_exists' ) {
        this.room_open = key;
        this.keyCheckExist = true;
      }
    });
  }

  connnectToRoom(room){
    window.localStorage.setItem('room_name', room);
    this.hideStartButton = true;
    this.passForCredit = false;
    this.activateCredit = false;
    this.transferCredit = false;
    this.range = false;
    this.createRoomChat = false;
    this.joinRoomChat = false;
  }

  openRoom(room){ // create room
    let code = {code:room},
        checkCreateRoomConnect,
        createRoomConnectProblem,
        checkCreateRoom,
        disconectCreateRoom;

    this.translate.get('badNetWorkCreateRoomError').subscribe((val)=>{
      checkCreateRoom = this.loadingCtrl.create({
        content: val
      });

    });
    this.translate.get('badNetwork').subscribe((val)=>{
      disconectCreateRoom = this.alertCtrl.create({
        title: val,
        buttons: [{
          text: 'OK',
          handler: () => {}
        }]
      });

    });
    checkCreateRoomConnect = setTimeout( () => {
      checkCreateRoom.present();
    }, 1500);
    createRoomConnectProblem = setTimeout( () => {
      disconectCreateRoom.present();
      checkCreateRoom.dismiss();
    }, 11500);

    this.api.deleteChatRoom().subscribe((data)=>{
      this.api.createChatRoom(code).subscribe((data)=>{
        if (data.error == false && data.status == 'OK') {
          clearInterval(checkCreateRoomConnect);
          clearInterval(createRoomConnectProblem);
          checkCreateRoom.dismiss();
          if (this.sub){
            this.clearTimer();
          }
          this.connnectToRoom(room);
          this.socket.emit('room', room.toLowerCase());
          this.socket.emit('list_users');
          this.joinRoomShow = false;
          this.openRoomShow = true;
          this.isAdmin = true;
          this.startVoiceTime = true;

          window.localStorage.setItem('Group_Initiator', '1');
          this.boardRoom = window.localStorage.getItem('room_name');

          setTimeout( () => {
            this.startTimer();
          }, 1000);

        }else{
          this.serverErrorFunc(data.error_msg).subscribe((err:any)=>{
            let createChatError = this.alertCtrl.create({
              title: err,
              buttons: [{
                text: 'OK',
                role: 'cancel'
              }]
            });
            createChatError.present();
          });
        }
      });
    });
  }

  /* JOIN TO CHAT ROOM */

  joinRoom(){
    this.joinRoomChat = true;
    this.createRoomChat = false;
    setTimeout(()=> this.openKeyField5.nativeElement.focus(), 200);
  }

  joinToOpenRoom(room){
    let joinToRoom,
        disconectJoinToRoom,
        checkRoomConnect,
        roomConnectNetProblem,
        code = {code:room};

    if (room) {
      this.translate.get('badNetWorkRoomError').subscribe((val)=>{
        joinToRoom = this.loadingCtrl.create({
          content: val
        });

      });
      this.translate.get('badNetwork').subscribe((val)=>{
        disconectJoinToRoom = this.alertCtrl.create({
          title: val,
          buttons: [{
            text: 'OK',
            handler: () => {}
          }]
        });

      });
       checkRoomConnect = setTimeout( () => {
          joinToRoom.present();
        }, 1500);
       roomConnectNetProblem = setTimeout( () => {
          disconectJoinToRoom.present();
          joinToRoom.dismiss();
          this.joinRoomChat = false;
       }, 13500);

      this.api.chatExist(code).subscribe((err:any) => {
        if (err.error == true && err.status == 'FAIL') {
          this.translate.get('error_server').subscribe((val)=>{
            let roomNotExist = this.alertCtrl.create({
              title: val.chat_not_exists,
              buttons: [{
                text: 'OK',
                role: 'cancel',
                handler: () => {}
              }]
            });
            roomNotExist.present();
            clearTimeout(checkRoomConnect);
            clearTimeout(roomConnectNetProblem);
            joinToRoom.dismiss();
          });
        }else{
          window.localStorage.setItem('Group_listener', '1');
          this.api.deleteChatRoom().subscribe((data:any)=>{
            clearTimeout(checkRoomConnect);
            clearTimeout(roomConnectNetProblem);
            joinToRoom.dismiss();
            this.connnectToRoom(room.toLowerCase());
            this.socket.emit('room', room.toLowerCase());
            this.socket.emit('list_users');
            this.messagesToUser = [];
            this.messCount = 0;
            this.joinRoomShow = true;
            this.openRoomShow = false;
            this.checkVoiceChatOpen();
            this.room_join = '';
            this.boardRoom = window.localStorage.getItem('room_name');
          });
        }
      });
    }else{
      this.translate.get('room_name').subscribe((val)=>{
        let roomLenght = this.alertCtrl.create({
          title: val,
          buttons: [{
            text: 'OK',
            role: 'cancel',
            handler: () => {
            }
          }]
        });
        roomLenght.present();
      });
    }
  };

  clearCounters(){
    this.messagesToUser = [];
    this.users = [];
    this.thisPrivateChatUser = [];
    this.messCountAdm = 0;
    this.activeUserInGroupLen = 0;
    this.numberVoiceChatUsers = 0;
    this.messages = [];
  }

  clearTimer(){
    if (this.sub){
      this.sub.unsubscribe();
    }
    this.startVoiceTime = false;
    this.ticks = 0;
    this.minutesDisplay = 0;
    this.hoursDisplay = 0;
    this.secondsDisplay = 0;
  }

  reconnect(){
    this.connection.close();
    this.connection.closeSocket();
    this.connection.resetScreen();
    this.connection.userid = this.connection.token();
  }

  /* Admin close group ( X BUTTON ) */
  exitCreateChat(){
    this.translate.get('want_to_exit_group').subscribe((val)=>{
      let exitFromChat = this.alertCtrl.create({
        title: val.txt1,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.exitCreateChatMethod();
          }
        },
          {
            text: val.txt2,
            role: 'cancel',
            handler: () => {
            }
          }]
      });
      exitFromChat.present();
    });
  }

  exitCreateChatMethod() {
    this.api.deleteChatRoom().subscribe((data)=>{
      this.clearTimer();
      this.openRoomShow = false;
      this.joinRoomShow = false;
      this.openUsersChatList = false;
      this.layerClose = false;
      this.startVoiceTime = false;
      this.hideStartButton = false;
      this.groupChatStart = false;
      this.isAdmin = false;
      this.isAdminConnected = false;
      this.checkVoice = true;
      this.room_join = '';
      this.room_open = '';
      window.localStorage.removeItem('listen_start');
      window.localStorage.setItem('Group_Initiator', '');
      window.localStorage.setItem('room_name', '');
      this.stopToVoiceChat();
      this.clearCounters();
      clearTimeout(this.timeEnd);
      clearTimeout(this.timeLess);
      this.record = false;
      this.socket.emit('leave');
    });
  }

  // user exit group
  exitFromChat(){
    this.translate.get('want_to_exit').subscribe((val)=>{
      let exitFromChat2 = this.alertCtrl.create({
        title: val.txt1,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.voiceActive = false;
            this.joinRoomShow = false;
            this.room_join = '';
            this.room_open = '';
            this.messChatToAdmin = false;
            this.isAdmin = false;
            this.messCount = 0;
            this.socket.emit('leave');
            window.localStorage.removeItem('room_name');
            window.localStorage.removeItem('listen_start');
            window.localStorage.setItem('Group_listener', '');
            this.hideStartButton = false;
            this.messages = [];
            this.reconnect();
            clearInterval(this.chekRoomExist);
            if (!window.localStorage.getItem('unitiRate')) {
              setTimeout(()=>{
                this.appRate.promptForRating(true);
              },2000);
            }
          }
        },
          {
            text: val.txt2,
            role: 'cancel',
            handler: () => {
            }
          }]
      });
      exitFromChat2.present();
    });
  }

  /* OPEN VOICE CHAT */

  ifTimeLeft(){
    this.api.expiredCredits().subscribe((data)=>{
      clearTimeout(this.timeEnd);
      clearTimeout(this.timeLess);
      if (data.status == 'FAIL' && data.error == true){
        this.stopToVoiceChat();
      }else{
        if (data.expire){
          let n = Date.now();
          let endTime:any = new Date(data.expire*1000);
          let expiredTime = endTime - n;
          let endMin = Math.floor(expiredTime);
          let end5Min = endMin - 190000;
          if (end5Min > 0) {
            this.timeLess = setTimeout(()=>{
              this.translate.get('your_active_3min_left').subscribe((val)=>{
                this.localNotifications.schedule({
                  id:1,
                  title:val,
                  priority:2
                });
                let timeLess = this.alertCtrl.create({
                  title: val,
                  buttons: [{text: 'OK',role: 'cancel'}]
                });
                timeLess.present();
              });
              this.ifTimeLeft();
            },end5Min);
          }
          if (endMin >= 0){
            this.timeEnd = setTimeout(()=>{
              this.api.infoCredits().subscribe((data)=>{
                if (data.status == 'OK' && data.error == false) {
                  this.activeCredits = data.active;
                  this.allCredits = data.passive;
                  if ( this.activeCredits <= 0 ) {
                    this.stopToVoiceChat();
                  } else {
                    setTimeout(() => {
                      this.ifTimeLeft();
                    }, 1000);
                  }
                }
              });
            }, endMin);
          }
        }
      }
    });
  }

  startToVoiceChat(){ // Speak
    let room = window.localStorage.getItem('room_name').toLowerCase();
    if (this.activeCredits > 0 && this.networkConnectStatus == true ) {

      this.record = true;
      this.soundOff = false;
      this.subscribTimer = this.getAllVoiceConnection.subscribe(()=>{
        if (this.numberVoiceChatUsers > this.activeUserInGroupLen && this.numberVoiceChatUsers !== 0) {
          this.numberVoiceChatUsers = this.activeUserInGroupLen;
        }else{
          this.numberVoiceChatUsers = this.connection.getAllParticipants().length;
        }
      });

      window.localStorage.setItem('listen_start', 'start');
      this.connection.openOrJoin(room);
      this.connection.extra.close = '';
      this.connection.updateExtraData();
      this.connection.extra.roomAdmin = window.localStorage.getItem('room_name');
      this.connection.updateExtraData();
      this.connection.extra.fullRoom = '';
      this.connection.updateExtraData();

      window.localStorage.setItem('Initiator', '1');

    }else{
      this.translate.get('activate_credits_err').subscribe((val)=>{
        let noActiveCred = this.alertCtrl.create({
          title: val,
          buttons: ['OK']
        });
        noActiveCred.present();
      });
    }
  }

  muteVoiceChat(){
    if (this.soundOff == false) {
      this.soundOff = true;
      this.connection.streamEvents.selectAll().forEach(function(user){
        if (user.type == 'local') {
          user.stream.mute();
        }
      });

    }else{
      this.soundOff = false;
      this.connection.streamEvents.selectAll().forEach(function(user){
        if (user.type == 'local') {
          user.stream.unmute();
        }
      });
    }
  }

  /*STOP OPEN VOICE CHAT*/

  // admin close audio room
  stopToVoiceChatAlert(){
    this.translate.get('stop_voice').subscribe((val)=>{
      let stopAlert = this.alertCtrl.create({
        title: val.txt1,
        subTitle: val.txt2,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.stopToVoiceChat();
          }
        },
          {
            text: val.txt3,
            role: 'cancel'
          }]
      });
      stopAlert.present();
    });
  }

  stopToVoiceChat(){
    if (this.record == true) {
      this.checkVoice = true;
      this.numberVoiceChatUsers = 0;
      clearTimeout(this.timeEnd);
      clearTimeout(this.timeLess);
      this.connection.extra.close = 'closed';
      this.connection.updateExtraData();
      window.localStorage.setItem('Initiator', '');
      window.localStorage.removeItem('listen_start');

      setTimeout( () => {
        this.reconnect();
        this.record = false;
      }, 2000);

    }
  }

  checkVoiceChatOpen(){
    let room = window.localStorage.getItem('room_name');
    let VoiceElem = this.voicechat.nativeElement;
    if (room) {
      clearInterval(this.chekRoomExist);
      this.chekRoomExist = setInterval(()=>{
        this.connection.checkPresence(room, (isRoomExist, roomid) => {
          if (isRoomExist) {
            VoiceElem.classList.add('open');

            if ( this.tourGuidSpeakNotifi ) {
              this.tourGuidSpeakNotifi = false;

              this.translate.get('TourGuideBeganSpeak').subscribe((val)=>{
                this.localNotifications.schedule({
                  id:1,
                  title:val,
                  priority:1
                });
                let timeLess = this.alertCtrl.create({
                  title: val,
                  buttons: [{text: 'OK',role: 'cancel'}]
                });
                timeLess.present();
              });
            }

            return;
          }else{
            VoiceElem.classList.remove('open');
            this.tourGuidSpeakNotifi = true;
            return;
          }
        });
      },1000);
    }
  }

  /*JOIN VOICE CHAT*/

  joinToVoiceChat(){
    let room = window.localStorage.getItem('room_name').toLowerCase();
    window.localStorage.setItem('listen_start', 'start');
    this.connection.join(room);
    this.api.audioConnect({'code':room}).subscribe( );
    this.connection.extra.roomAdmin = '';
    this.connection.extra.close = '';
    this.startListen = true;
    this.voiceActive = true;
    this.record = false;
  }

  /*STOP JOIN VOICE CHAT*/

  stopFromVoiceChat(){
    if (this.voiceActive == true){
      this.voiceActive = false;
    }
    this.reconnect();
    window.localStorage.removeItem('listen_start');
    this.checkVoice = true;
    this.checkVoiceChatOpen();
  }

  /* SEND MESSAGE TO ALL*/

  openMessChatAll(){
    this.messChatToAll = true;
    //setTimeout(()=> this.chattoalluser.nativeElement.focus(), 200);
  }

  sendMessAll(){
    if ( this.message !== '' ) {
      let messageSendDate = Math.random().toString(32).slice(-6);
      this.checkSendMessage = false;
      this.messages.push({text: this.message, from:this.userData.username, date: new Date()});


      this.socket.emit('message', this.message, (data) => {
          this.checkSendMessage = true;
          let lastMsg = this.myMessage.nativeElement.children[this.messages.length -1];
          let allMsg = this.myMessage.nativeElement.children;
          lastMsg.querySelector('.my_message').setAttribute('data-send', 'sended');

          Object.keys(allMsg).forEach((key) => {
              if ( allMsg[key].querySelector('.message').hasAttribute('data-send') && allMsg[key].querySelector('.message').getAttribute('data-send') == 'notSended' ) {
                allMsg[key].querySelector('.message').setAttribute('data-send', 'sended');
              }
           });
        }
      );

      setTimeout( () => {
        let lastMsg = this.myMessage.nativeElement.children[this.messages.length -1];
        if ( this.checkSendMessage == false ) {
          lastMsg.querySelector('.my_message').setAttribute('data-send', 'notSended');
        }
        lastMsg.querySelector('.my_message').setAttribute('data-sendTime', new Date(messageSendDate).getTime());
      },500);

      let checkSendedMsg = setInterval( () => {

        if ( !this.messChatToAll ) { // check if chat closed stop watch messages
          clearInterval(checkSendedMsg);
        }

        let allMsg = this.myMessage.nativeElement.children,
            checkNotSendedMsg = false;

        Object.keys(allMsg).forEach( (key) => {
          if ( allMsg[key].querySelector('.my_message').getAttribute('data-send') == 'notSended' ) {
            checkNotSendedMsg = true;
          }
        });
        if ( checkNotSendedMsg ) {
          this.api.checkAllUsers({'code': window.localStorage.getItem('room_name')}).subscribe(data => {
            if ( window.localStorage.getItem('Group_Initiator') == '1' ) { //admin
              let myMessages = data.history.filter(user => {
                if (user.user_id == this.userData.id && user.event == 'admin_message') {
                  return user
                }
              });
              if ( this.messages.length == myMessages.length ) {
                Object.keys(allMsg).forEach((key) => {
                  if ( allMsg[key].querySelector('.message').hasAttribute('data-send') && allMsg[key].querySelector('.message').getAttribute('data-send') == 'notSended' ) {
                    allMsg[key].querySelector('.message').setAttribute('data-send', 'sended');
                  }
                });
                checkNotSendedMsg = false;
              }
            }
          });
        }
      }, 15000);

      var element = document.getElementById('scrollToBottom');
      setTimeout(()=>{element.scrollIntoView(true)},500);
      this.message = '';
    }

  }

  /* SEND MESSAGE TO USER*/

  openChatWithAdmin(){
    this.messChatToAll = true;
    // setTimeout(()=> this.chattoalluser.nativeElement.focus(), 200);
    this.messCount = 0;
    var element = document.getElementById('scrollToBottom');
    setTimeout(()=>{element.scrollIntoView(true)},500);
  }

  closeToUserChat(){
    this.messChatToAdmin = false;
    this.openUsersChatList = false;
    this.messCountAdm = 0;
    this.layerClose = false;
  }

  /* OPEN USERS */

  openAllUsers(){
    this.openUsersChatList = !this.openUsersChatList;
    this.layerClose = !this.layerClose;
    if (this.openUsersChatList == true){
      this.messCountAdm = 0;
    }
  }

  // open chat with user
  chatToUser(userWithChat){

    this.api.checkAllUsers({'code': window.localStorage.getItem('room_name')}).subscribe((data) =>{
      let usersOnGroupArray:any = [];

      if ( data.status == 'OK' ) {
        usersOnGroupArray.push(data.history);
        this.globalHistoryChat = usersOnGroupArray;

      }

    });

    this.chatName = '';
    this.chatName = userWithChat.first_name;
    this.userId = userWithChat.id;
    this.thisPrivateChatUser = this.users.filter( (user) => {
      return user.id == this.userId;
    });

    setTimeout(()=> this.chattoprivatuser.nativeElement.focus(), 200);
    this.messCountAdm = 0;
    this.messChatToAdmin = true;
    this.thisPrivateChatUser[0].chat = false;
    let privateChatMessages = [];
    this.messages = [];


    setTimeout( () => {
      privateChatMessages = this.globalHistoryChat[0].filter( (user) => {
        return  user.event == "user_message" || user.event == "private_message" && user.user_id == this.userId && user.event != '';
      });

      if ( privateChatMessages ) { // check if privateMessages not empty
        privateChatMessages.forEach( (user) => { /// private messages
          if ( user.event == "private_message" ) {
            this.messages.push({text: user.value, from:this.nickname, date: new Date(user.date * 1000), toUserId: this.userId});
          } else if ( user.event == "user_message" ) {
            this.messages.push({text: user.value, from:userWithChat.first_name, date: new Date(user.date * 1000), id: user.user_id});
          }
          var elementUser = document.getElementById('scrollToBottomUser');
          setTimeout(()=>{elementUser.scrollIntoView(true)},500);
        });
      }

      let adminMessage = this.globalHistoryChat[0].filter( (user) => { // admin messages to ALL
        return  user.event == "admin_message" && user.value != '';
      });

      if ( window.localStorage.getItem('Group_Initiator') == '1' ) { // admin
        if ( adminMessage ) { // check if adminMessage not empty
          adminMessage.forEach( (user) => {
            this.messages.push({text: user.value, from:this.nickname, date: new Date(user.date * 1000)});
          });
          var elementUser = document.getElementById('scrollToBottomUser');
          setTimeout(()=>{elementUser.scrollIntoView(true)},500);
        }

      }
      this.myAdminMessage.nativeElement.setAttribute('data-loadChat', 'loadingFromBase');
    }, 300);

  }

  sendPrivateMess(){
    if (this.messageAdmin !== ''){
      this.checkAdminSendMessage = false;

      this.messages.push({text: this.messageAdmin, from:this.userData.username, date: new Date(), toUserId: this.userId});
      this.socket.emit('private_message', {userId: this.userId, msgAdmin: this.messageAdmin} , (data) => {
         this.checkAdminSendMessage = true;
        let allMsg = this.myAdminMessage.nativeElement.children;
        let lastMsg = this.myAdminMessage.nativeElement.children[this.messages.length -1];
        lastMsg.querySelector('.my_message').setAttribute('data-send', 'sended');

        Object.keys(allMsg).forEach((key) => {
          if ( allMsg[key].querySelector(".message") != null && allMsg[key].querySelector('.message').hasAttribute('data-send') && allMsg[key].querySelector('.message').getAttribute('data-send') == 'notSended' ) {
            allMsg[key].querySelector('.message').setAttribute('data-send', 'sended');
          }
        });

      });

      setTimeout( () => {
        if ( this.checkAdminSendMessage == false ) {
          let lastMsg = this.myAdminMessage.nativeElement.children[this.messages.length -1];
          lastMsg.querySelector('.my_message').setAttribute('data-send', 'notSended');
        }

      },500);

      var elementUser = document.getElementById('scrollToBottomUser');
      setTimeout(()=>{elementUser.scrollIntoView(true)},500);
      this.messageAdmin = '';
    }
  }

  lockUser(i, item){
    this.translate.get('lock_user').subscribe((val)=>{
      let lockUser = this.alertCtrl.create({
        title: val,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.userItem.nativeElement.children[i].classList.add('lock');
            this.socket.emit('block_user', this.users[i].id);

            this.lockedUsers.push({id: this.users[i].id});
            window.localStorage.setItem("lockedUsers", JSON.stringify(this.lockedUsers));
          }
        },
          {
            text: 'Cancel',
            role: 'cancel'
          }]
      });
      lockUser.present();
    });
  }

  unlockUser(i, item){
    this.translate.get('unlock_user').subscribe((val)=>{
      let unlockUser = this.alertCtrl.create({
        title: val,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.userItem.nativeElement.children[i].classList.remove('lock');
            this.socket.emit('unlock_user', this.users[i].id);

            this.lockedUsers.map( (user, n) =>  {
              if ( user.id == this.users[i].id ) {
                this.lockedUsers.splice(n, 1);
              }
            });
            window.localStorage.setItem("lockedUsers", JSON.stringify(this.lockedUsers));

          }
        },
          {
            text: 'Cancel',
            role: 'cancel'
          }]
      });
      unlockUser.present();
    });
  }

  adminGetAllUsers() {

    this.api.checkAllUsers({'code': window.localStorage.getItem('room_name')}).subscribe((data) =>{
      let usersOnGroupArray:any = [];

      if ( data.status == 'OK' ) {
        usersOnGroupArray.push(data.history);
        this.globalHistoryChat = usersOnGroupArray;

        if ( window.localStorage.getItem('Group_Initiator') == '1' ) { // admin
          let removeDuplicates = (myArr, prop) => ( // check first user event ( join )
            myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).lastIndexOf(obj[prop]) === pos)
          );

          let globalAdmin = data.history.filter( (user) => {
            if ( user.event == 'create') {
              return user;
            }
          });

          this.globalRoomTime = globalAdmin[0].date;

          let userArr = data.users;
          let historyArr = data.history;
          let spredArr = [];

          userArr.map( (user) => {
              historyArr.map( (x) => {
                  if (user.id == x.user_id) {
                     spredArr.push({avatar: user.avatar, event: x.event, first_name: user.first_name, id: user.id, email: user.email});
                  }
              });
          });

          let userJoinedChatArr = removeDuplicates(spredArr, 'id');

          let usersJoinedOnGroup = userJoinedChatArr.filter( (user) => {
            if ( user.event != 'user_left_leave' && user.event != "create") {
              return user;
            }
          });

          this.activeUserInGroupLen = usersJoinedOnGroup.length;

          this.users = [];
          this.users = usersJoinedOnGroup;

          if (this.activeUserInGroupLen >= 1) {
            this.groupChatStart = true;
            this.messCountAdm = 0;
          } else {
            this.groupChatStart = false;
          }

        }
      }

    });
  }

  checkRoomlen(val) {
    if ( val.length > 4) {
      this.room_join = this.room_join.substr(0, 4)
    }
  }

  chatTimeFormatMsg() {
    if ( this.globalLang != 'en' ) {
      this.chatMessageFormat = 'dd.MM HH:mm:ss';
    } else {
      this.chatMessageFormat = 'dd.MM hh:mm:ss a';
    }
  }

  /* SOCKET.IO */

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getPrivateMessages() {
    let observable = new Observable(observer => {
      this.socket.on('private_message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('list_users', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getSocketError() {
    let observable = new Observable(observer => {
      this.socket.on('error', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getSocketException() {
    let observable = new Observable(observer => {
      this.socket.on('exception', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  onSocketDisconnect() {
    let observable = new Observable(observer => {
      this.socket.on('disconnect', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  onSocketCloseRoom() {
    let observable = new Observable(observer => {
      this.socket.on('chat_delete', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  onTransferCredit() {
    let observable = new Observable(observer => {
      this.socket.on('transfer', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  onAdminLeft() {
        let observable = new Observable(observer => {
          this.socket.on('admin_left', (data) => {
            observer.next(data);
          });
        })
        return observable;
    }observer

  onAdminJoin() {
    let observable = new Observable(observer => {
      this.socket.on('list_admin', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  onAdminDisconect() {
    let observable = new Observable(observer => {
      this.socket.on('admin_disconect', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  /* FUNCTION */

  accountPage(){
    this.navCtrl.push(AccountPage);
  }

  forgotPage(){
    this.navCtrl.push(ForgotPage);
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


}
