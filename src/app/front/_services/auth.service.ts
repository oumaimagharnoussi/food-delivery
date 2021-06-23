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
 async  ifLoggedIn() {


  this.platform.ready().then(async() => {
    await  this.storage.get("access_token").then(async(response) => {

     
      if (response) {
        console.log(response)
        this.token=response.token
        await  this.storage.get("uuid").then(async(response) => {
          if(response){
            this.uuid=response;
            this.device_service.uuid=this.uuid;
            
          }else{
            this.uuid=uuidv4();
            await this.set('uuid',this.uuid)
            this.device_service.uuid=this.uuid;

          }
          
          console.log(response)
        });
        this.authState.next(true);
      }else{
        await  this.storage.get("uuid").then((response) => {
          if(response){
            this.uuid=response;
            this.device_service.uuid=response;
          }else{
            this.uuid=uuidv4();
            this.set('uuid',this.uuid)
            this.device_service.uuid=this.uuid;

          }
          
          console.log(response)
        });
        this.router.navigate(['/login'])
      }
    });
  });



  }


  async  ifNotLoggedIn() {


    this.platform.ready().then(async() => {
      await  this.storage.get("access_token").then(async(response) => {
  
       
        if (!response) {
          await  this.storage.get("uuid").then(async(response) => {
            if(response){
              this.uuid=response;
              this.device_service.uuid=response;
            }else{
              this.uuid=uuidv4();
              await this.set('uuid',this.uuid)
              this.device_service.uuid=this.uuid;
            }
            
            console.log(response) 
          });
          console.log(response)
          this.authState.next(false);
        }else{
          this.token=response.data
          window.location.href = "/app/orders";
        }
      });
    });
  
  
  
    }
  

  async  getDark():Promise<boolean> {
    var darkState;
    await  this.storage.get("dark").then((response) => {
      darkState =response;
      });
      return darkState;
    }

    async  get(key):Promise<any> {
      var value;
      await  this.storage.get(key).then((response) => {    
          value =response;
        });
        return value;
      }

    async  getUser():Promise<any> {
      var user;
      await  this.storage.get("access_token").then((response) => {
          user =response;
        });
       return user
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
    this._storage?.set(key, value);
  }





  login(credentials): Observable<any>  {
    this.setEndpoint()
    return this.http.save(credentials);
     
  }


 async logout(): Promise<void> {
    this.authState.next(false);

    await  this.storage.get("access_token").then((response) => {
      this.http.endpoint='deliveries';
      this.http.update(response.data.id,{
        deviceToken: ""
      }).subscribe(
        ()=>{
          this._storage.remove("access_token");
          this._storage.remove("uuid");
          this._storage.remove("acceptedList");
          this._storage.remove("comissionList");
          this._storage.remove("deliveryInfo");
          this._storage.remove("dark").then(
            ()=>{window.location.href = "/login";}
          );;
        },
        ()=>{
          this._storage.remove("access_token");
          this._storage.remove("uuid");
          this._storage.remove("acceptedList");
          this._storage.remove("comissionList");
          this._storage.remove("deliveryInfo");
          this._storage.remove("dark").then(
            ()=>{window.location.href = "/login";}
          );;
        }

      )
    })
    
       
           
          
        

      
    
    return;
  }

  setEndpoint(){
    this.http.endpoint='login_check';
  }

}
