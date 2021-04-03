import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of, throwError } from "rxjs";
import { map } from "rxjs/operators";
import {Storage} from '@ionic/storage-angular'
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { Platform, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { TestBed } from "@angular/core/testing";




const AUTH_API = 'https://localhost/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'accept': 'application/json'
  })
};
const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Init with null to filter out the first value in a guard!
    authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
   
    token = '';



  private _storage: Storage | null = null;

  
 
  constructor(
   private  storage:Storage,private http: HttpClient, private router: Router,  private platform: Platform,  public toastController: ToastController
  ) {
    this.init()
  /*  this.platform.ready().then(() => {
      this.ifLoggedIn();
    });*/
    
  }
 
  isAuthenticated() {
  
    return this.authState.value;

  }
 async  ifLoggedIn() {
  await  this.storage.get("access_token").then((response) => {

     
      if (response) {
        console.log(response)
        this.authState.next(true);
      }else{
        this.router.navigate(['/login'])
      }
    });
  }

  async  getDark():Promise<boolean> {
    var test;
    await  this.storage.get("dark").then((response) => {
  
        test =response;
        
        
         
       
      });
      return test;
    
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
    return this.http.post(AUTH_API+'login_check', credentials,httpOptions)
     
  }


  logout(): Promise<void> {
    this.authState.next(false);
    return this._storage.remove("access_token");
  }






}
