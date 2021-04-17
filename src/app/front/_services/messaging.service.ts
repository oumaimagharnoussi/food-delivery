import { Injectable } from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging'
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MessagingService  {
  token=null

  constructor(private afMessaging : AngularFireMessaging ) { 

  }

  requestPermission(){
    return this.afMessaging.requestToken.pipe(
      tap(token=>{
        this.token=token
        console.log('store the token:', this.token);

        
      })

    )
  }

  getMessages(){
    this.afMessaging.onMessage((payload)=>{
      console.log(payload)
    })
   
    console.log(this.afMessaging.messages)
    return this.afMessaging.messages;
  }

  deleteToken(){
   if(this.token){
      this.afMessaging.deleteToken(this.token)
      this.token=null;
    }
    var req = indexedDB.deleteDatabase("firebase-messaging-database");
    var req = indexedDB.deleteDatabase("firebase-installations-database");
    req.onsuccess = function () {
      console.log("Deleted database successfully");
  };
  req.onerror = function () {
      console.log("Couldn't delete database");
  };
  req.onblocked = function () {
      console.log("Couldn't delete database due to the operation being blocked");
  };
  }
}
