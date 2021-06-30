import { Component, OnInit } from '@angular/core';
import { isUndefined } from 'util';
import DeliveryBoy from '../../_models/DeliveryBoy';
import { RegisterService } from '../../_services/register.service';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpHeaders } from '@angular/common/http';
import { AlertController, Platform } from '@ionic/angular';
import {environment} from 'src/environments/environment'
import { ToastController } from '@ionic/angular';
import { MessagingService } from '../../_services/messaging.service';
import { LoadingController } from '@ionic/angular';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
const { PushNotifications } = Plugins;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
 

  confirm:string;
  dark =false;
  test=false;
  pressed=false;
  errMsg="";

  form:  DeliveryBoy ={
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: "",
    password:"",
   
  } ;
  token: string;
  loading :any;
  constructor(public loadingController: LoadingController,
    public toastController: ToastController,
    private platform:Platform,
    private http: HTTP,
    private register_service : RegisterService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private messagingService: MessagingService ) {
     
    }
  async showMessage(message,color){
    
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        color: color,
        position: 'bottom'
      });
      toast.present();
  } 
  async ngOnInit() {
   

    this.authService.ifNotLoggedIn()
    await this.authService.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

  }

  onClick(event){
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addListener(this.colorTest);
    if(event.detail.checked){
      document.body.setAttribute('data-theme', 'dark');
      this.authService.set("dark",true)
    }
    else{
      document.body.setAttribute('data-theme', 'light');
      this.authService.set("dark",false)
    }
  }
  
  ValidateEmail(mail) 
  {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
    {
      return (true)
    }
      
      return (false)
  }

   colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('data-theme', 'dark');		
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }
  async onSubmit(){
    const deliveryBoyInfo = new DeliveryBoy();
    deliveryBoyInfo.address=""
    deliveryBoyInfo.telephone=this.form.telephone
    deliveryBoyInfo.email=this.form.email;
    deliveryBoyInfo.password=this.form.password;
    deliveryBoyInfo.firstName=this.form.firstName;
    deliveryBoyInfo.lastName=this.form.lastName;
  

    if(this.form.firstName == "" || this.form.lastName==""){
      this.pressed=true;
 
      this.showMessage("Please enter your name !","danger")
      return;
    }
    if(this.form.email == "" ){
      this.pressed=true;
  
      this.showMessage("Email is required !","danger")
      return;
    }
    if (!this.ValidateEmail( this.form.email) ){
      this.pressed=true;
  
      this.showMessage("Verify your mail syntax !","danger")
      return;
    } 
    if(this.form.telephone == "" ){
      this.pressed=true;
     
      this.showMessage("Phone number is required !","danger")
      return;
    }
    if(this.form.password == "" ){
      this.pressed=true;
     
      this.showMessage("Password is required !","danger")
      return;
    }

    if(this.form.password.length < 8 ){
      this.pressed=true;
     
      this.showMessage("Password min 8 caracters","danger")
      return;
    }
  

    if (this.confirm == this.form.password){
      this.loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Wait we\'re creating your account',
      });
      await this.loading.present();
      if (this.platform.is("mobileweb")|| this.platform.is("desktop")){
        this.register_service.register(deliveryBoyInfo).subscribe(
          livreur=>{
            console.log(livreur)
            this.pressed=true;
            this.test=true;
            this.authenticate(deliveryBoyInfo.email,deliveryBoyInfo.password)
            this.form=new DeliveryBoy();
            this.confirm="";
            //this.router.navigate(['/login'])
            
          },async (error)=>{
            this.pressed=true;
            await this.loading.dismiss();
            console.log('Loading dismissed!');
            this.showMessage("Mail or phone already exists","danger")
  
          }
          
        );

      }else{
        this.http.setServerTrustMode("nocheck");

        this.http.sendRequest(environment.api_url+'/api/deliveries',{method: "post",data:
        {
  
  
          "firstName": deliveryBoyInfo.firstName.toString(),
          "lastName": deliveryBoyInfo.lastName.toString(),
          "email":  deliveryBoyInfo.email.toString(),
          "telephone": deliveryBoyInfo.telephone.toString()
        
        
        }
        ,serializer:"json"}).then(response => {
          // prints 200
          console.log(response);
          this.router.navigate(['/login'])
        })
        .catch(async response => {
          // prints 403
          console.log(response.status);
          
          // prints Permission denied
          console.log(response.error);
          await this.loading.dismiss();
          console.log('Loading dismissed!');
        });


      }

      

      
     


    }
    else{
      this.pressed=true;
      
      this.showMessage("Verify confirmation password !","danger")

    }


   

    console.log(deliveryBoyInfo);
  }
  redirect(route){
    this.router.navigate([route])
  }

  authenticate(username,password){
    //call auth service
    let data=   {
     username:  username,
     password: password
   }
   if(data.username == ""){
     this.pressed=true;
 
     this.showMessage("Username required is required !","danger")
     return;
   }
 
   if(data.password == "" ){
     this.pressed=true;
 
     this.showMessage("Password is required !","danger")
     return;
   }
   this.authService.login(data)
   .subscribe((token: any) => {
     //initialise form control
     
     //request FCM token
     this.saveToken(token).then(
       ()=>{
         this.requestMessaginToken(token)
       }
     ) 
 
   },async err=>{  
    await this.loading.dismiss();
    console.log('Loading dismissed!');
     this.showMessage(err.statusText,"danger")
     
 
   });
 
  }
  

  async saveToken(token){
    this.platform.ready().then(async() => {
      console.log("save token this : ",token)
      if(this.platform.is('capacitor')){
        let data=JSON.parse(token.data)
        this.authService.set('access_token',data)  
        this.authService.token=data;
        
      }else{
        this.authService.set('access_token',token)  
        this.authService.token=token; 
      }
      
    })
    
   }
  
   async requestMessaginToken(user:any){
     if(this.platform.is('capacitor')){
            // Request permission to use push notifications
            // iOS will prompt user and return if they granted permission or not
            // Android will just grant without prompting
            PushNotifications.requestPermission().then( result => {
              if (result.granted) {
                // Register with Apple / Google to receive push via APNS/FCM
                PushNotifications.register();
              } else {
                // Show some error
              }
            });
        
            // On success, we should be able to receive notifications
            PushNotifications.addListener('registration',
              (tokenF: PushNotificationToken) => {
                this.authService.set('fcm',tokenF)  
                this.authService.setFcmToken(tokenF);
              //  alert('Push registration success, token: ' + tokenF.value);
              let info=JSON.parse(user.data)
              window.location.href = "/app/orders";
           //   this.updateTokenDevice(info,tokenF.value)
  
              }
            );
        
            // Some issue with our setup and push will not work
            PushNotifications.addListener('registrationError',
              (error: any) => {
                alert('Error on registration: ' + JSON.stringify(error));
              }
            );
        
            // Show us the notification payload if the app is open on our device
            PushNotifications.addListener('pushNotificationReceived',
              (notification: PushNotification) => {
                //alert('Push received: ' + JSON.stringify(notification));
              }
            );
        
            // Method called when tapping on a notification
            PushNotifications.addListener('pushNotificationActionPerformed',
              (notification: PushNotificationActionPerformed) => {
                let id=JSON.stringify(notification.notification.data);
                this.router.navigate(['/orders/details/'+id.toString().substring(1,id.toString().length-1)])
                console.log(id)
           
              }
            );
  
            
  
     }else{
      this.messagingService.requestPermission().subscribe(
        async tokenF => {
          this.authService.set('fcm',tokenF)  
          this.authService.setFcmToken(tokenF);
       
          this.listenForMessages();
          this.token=tokenF;
          this.platform.ready().then(async() => {
           // this.updateTokenDevice(user,tokenF)
           window.location.href = "/app/orders";
          });
         
          
        },
        async (err) => {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: err,
            buttons: ['OK'],
          });
   
          await alert.present();
        }
      );
  
     }
   }
  
   listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title ,
        subHeader: msg.notification.body,
        message: msg.data.info,
        buttons: [ 'OK',   
        ],
      });
 
      await alert.present();
    });
  }

  
}
