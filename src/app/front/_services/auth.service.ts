import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {Storage} from '@ionic/storage-angular'
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClientService } from "src/app/api/http-client.service";
import { v4 as uuidv4 } from 'uuid';
import { DeviceIdService } from "src/app/api/device-id.service";





const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Init with null to filter out the first value in a guard!
    authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
   
    token:any;
    uuid: any;
    fcm_token :any;



  private _storage: Storage | null = null;
  userId: any;

  
 
  constructor(
   private http: HttpClientService,
   private  storage:Storage,
   private router: Router,
   private platform: Platform,
   private device_service: DeviceIdService

  ) {
    this.setEndpoint()
    this.init()
    
     
  }

  setFcmToken(token){
    this.fcm_token=token;
  }

  isAuthenticated() {
  
    return this.authState.value;

  }

  async getToken(){
    
    
          this.token=localStorage.getItem("access_token")
        this.http.token= localStorage.getItem("access_token")

     

  }


 async  ifLoggedIn() {

   
 

     
      if (localStorage.getItem("access_token")) {
       
        this.token=localStorage.getItem("access_token")
        this.http.token=localStorage.getItem("access_token")
     
        this.authState.next(true);
      }else{
  
        this.router.navigate(['/index'])
      }
 




  }


  async  ifNotLoggedIn() {



      !this.ifLoggedIn()
  
  
  
  
    }
  

  async  getDark():Promise<boolean> {
    var darkState;
    await  this.storage.get("dark").then((response) => {
      darkState =response;
      });
      return darkState;
    }

    async  get(key):Promise<any> {
     
      return  localStorage.getItem(key)
      }

    async  getUser():Promise<any> {
      
      return  localStorage.getItem("access_token")
      }

      async  getFcmToken():Promise<any> {
        var fcm;
        await  this.storage.get("fcm").then((response) => {
          fcm =response;
          });
         return fcm
        }


  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    localStorage.setItem(key, value);
  }





  login(credentials): Observable<any>  {
    this.setEndpoint()
    return this.http.save(credentials);
     
  }


 async logout(): Promise<void> {
    this.authState.next(false);

    await  this.storage.get("access_token").then((response) => {
      this.http.endpoint='deliveries';
      this.http.update(localStorage.getItem('userData'),{
        deviceToken: ""
      }).subscribe(
        ()=>{
          localStorage.clear()
          this._storage.remove("acceptedList");
          this._storage.remove("comissionList");
          this._storage.remove("deliveryInfo");
          this._storage.remove("dark").then(
            ()=>{window.location.href = "/index";}
          );;
        },
        ()=>{
          localStorage.clear()
          this._storage.remove("acceptedList");
          this._storage.remove("comissionList");
          this._storage.remove("deliveryInfo");
          this._storage.remove("dark").then(
            ()=>{window.location.href = "/index";}
          );;
        },()=>{
          localStorage.clear()
          this._storage.remove("acceptedList");
          this._storage.remove("comissionList");
          this._storage.remove("deliveryInfo");
          this._storage.remove("dark").then(
            ()=>window.location.href = "/index"
          )
        }

       

      )

    })
    
       
           
          
        

      
    
    return;
  }

  setEndpoint(){
    this.http.endpoint='login_check';
  }

}
