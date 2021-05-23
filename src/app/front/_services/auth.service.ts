import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {Storage} from '@ionic/storage-angular'
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClientService } from "src/app/api/http-client.service";






const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Init with null to filter out the first value in a guard!
    authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
   
    token:any;



  private _storage: Storage | null = null;

  
 
  constructor(
   private http: HttpClientService,
   private  storage:Storage,
   private router: Router,
   private platform: Platform,

  ) {
    this.setEndpoint()
    this.init()
    
     
  }


  isAuthenticated() {
  
    return this.authState.value;

  }
 async  ifLoggedIn() {


  this.platform.ready().then(async() => {
    await  this.storage.get("access_token").then((response) => {

     
      if (response) {
        console.log(response)
        this.authState.next(true);
      }else{
        this.router.navigate(['/login'])
      }
    });
  });



  }


  async  ifNotLoggedIn() {


    this.platform.ready().then(async() => {
      await  this.storage.get("access_token").then((response) => {
  
       
        if (!response) {
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
        if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
          return user;
        }else {
          let info=JSON.parse(user);
          let detail=info.data;
          return detail;
        }
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
