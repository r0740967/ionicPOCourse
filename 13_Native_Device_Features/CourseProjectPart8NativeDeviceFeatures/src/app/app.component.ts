import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

// CORDOVA PLUGINS
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

// CAPACITOR PLUGINS
import {Plugins, Capacitor} from '@capacitor/core'

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    // CORDOVA PLUGINS
    //private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // CORDOVA PLUGINS
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();

      // CAPACITOR PLUGINS
      if (Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
    });
  }

  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl("/auth");

  }
}
