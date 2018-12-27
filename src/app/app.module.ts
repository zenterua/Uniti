import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TooltipsModule } from 'ionic-tooltips';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPage } from '../pages/forgot/forgot';
import { MenuPage } from '../pages/menu/menu';
import { AccountPage } from '../pages/account/account';
import { ModalPayCard } from '../pages/credit/credit'; 
import { CardPage } from '../pages/card/card'; 
import { PasswordPage } from '../pages/password/password'; 
import { ReportsPage } from '../pages/reports/reports'; 
import { ReportsTransferPage } from '../pages/reports/transfer-report/transfer-report';
import { ReportsPurchasePage } from '../pages/reports/purchase-report/purchase-report';
import { ReportsActivatePage } from '../pages/reports/activate-report/activate-report';
import { ReportsPasswordPage } from '../pages/reports/password-report/password-report';
import { ReportsPurchaseEmailPage } from '../pages/reports/transfer-email-report/transfer-email-report';
import { ReportsTransferMenu } from '../pages/reports/tranfer-menu/tranfer-menu';
import { TutorialPage } from '../pages/tutorial/tutorial'; 
import { LanguagePage } from '../pages/language/language'; 

import { AuthInterceptor } from '../pages/services/auth.inceptor';
import { AuthService } from '../pages/services/auth.service';
import { ApiDataService } from '../pages/services/api.service';
import { SocketIo } from '../pages/services/socket.io.service';
import { DataUpdateService } from '../pages/services/data.service';
import { ActiveCreditsVal } from '../pages/services/active.number';
import { logoutService } from '../pages/services/logout.service';
import { languageService } from '../pages/services/language.service';
 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Clipboard } from '@ionic-native/clipboard';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { BackgroundMode } from '@ionic-native/background-mode';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization';
import { AppRate } from '@ionic-native/app-rate';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';

import { OnlyNumber } from '../pages/pipe/number/number.pipe';
import { UniqueArray } from '../pages/pipe/number/unique.pipe';
import { SumPipe } from '../pages/pipe/number/summ.pipe';
import { OrderBy } from '../pages/pipe/number/orderby.pipe';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppPreviewPage } from '../pages/app-preview/app-preview';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Sensors } from '@ionic-native/sensors';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translate/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    MenuPage,
    AccountPage,
    ModalPayCard,
    OnlyNumber,
    OrderBy,  
    UniqueArray,
    SumPipe,  
    CardPage,
    PasswordPage,
    ReportsPage,
    TutorialPage,
    ReportsTransferPage,
    ReportsPurchasePage,
    ReportsActivatePage,
    ReportsPasswordPage,
    ReportsPurchaseEmailPage,
    ReportsTransferMenu,
    LanguagePage,
    AppPreviewPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }   
    }),  
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
	TooltipsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    MenuPage,
    AccountPage,
    ModalPayCard,
    CardPage,
    PasswordPage,
    ReportsPage,  
    TutorialPage,
    ReportsTransferPage,
    ReportsPurchasePage,
    ReportsActivatePage,
    ReportsPasswordPage,
    ReportsPurchaseEmailPage,
    ReportsTransferMenu,
    LanguagePage,
    AppPreviewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    ApiDataService,   
    Clipboard, 
    FingerprintAIO,
    File,
	  Camera,
    SocketIo,
    Keyboard,
    DataUpdateService, 
    BackgroundMode, 
    Globalization, 
    AppRate, 
    ActiveCreditsVal,
    LocalNotifications,   
	  Network,
    AndroidPermissions,
    ScreenOrientation,
    logoutService,
    languageService,
    Sensors,
    {provide: '_OPTIONS_', useValue: {
    transports: ['websocket'],
    query: {token: window.localStorage.getItem('authUniti'),
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity}
    }},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class AppModule {}
