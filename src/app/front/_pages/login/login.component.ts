import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { MessagingService } from '../../_services/messaging.service';
import { DeliveryService } from 'src/app/back/settings/_services/delivery.service';


const { PushNotifications } = Plugins;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errMsg = ""
  err = false;
  pressed = false;
  dark = false;
  token = "";

  login: boolean = true

  loginForm = {
    username: '',
    password: ''
  };


  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private messagingService: MessagingService,
    private auth_service: AuthService,
    private router: Router,
    private platform: Platform,
    private delivery_serv: DeliveryService) {
    this.auth_service.ifNotLoggedIn()

  }

  async showMessage(message, color) {

    const toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }


  async ngOnInit() {

    await this.auth_service.getDark().then((test) => {
      if (test) {
        document.body.setAttribute('data-theme', 'dark');
        this.dark = true
      }
      else {
        document.body.setAttribute('data-theme', 'light');
        this.dark = false
      }

    });

  }
  ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
      return (true)
    }

    return (false)
  }


  authenticate() {
    //call auth service
    let data = {
      username: this.loginForm.username.toString(),
      password: this.loginForm.password.toString()
    }
    if (data.username == "") {
      this.pressed = true;

      this.showMessage("Username is required !", "danger")
      return;
    }





    if (data.password == "") {
      this.pressed = true;

      this.showMessage("Password is required !", "danger")
      return;
    }
    this.auth_service.login(data)
      .subscribe((token: any) => {
        //initialise form control
        this.pressed = true;
        this.err = false
        //request FCM token
        this.saveToken(token);
        window.location.href = "/app/orders";

      }, err => {
        this.pressed = true;
        this.err = true;
        console.log(err)
        this.showMessage(err.error.message, "danger")

      });

  }

  async saveToken(token) {

    console.log("save token this : ", token)

    let tokenData = token.token
    this.auth_service.set('access_token', tokenData)
    this.auth_service.token = tokenData;

    let userData = token.data.id
    this.auth_service.set('userData', userData)
    this.auth_service.userId = userData;





  }





  onClick(event) {
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addListener(this.colorTest);
    if (event.detail.checked) {
      document.body.setAttribute('data-theme', 'dark');
      this.auth_service.set("dark", true)
    }
    else {
      document.body.setAttribute('data-theme', 'light');
      this.auth_service.set("dark", false)
    }
  }

  colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }

  redirect(route) {
    this.router.navigate([route])
  }

  redirectToRegister() {
    console.log('Register page !!!');
    this.login = false;
  }




}