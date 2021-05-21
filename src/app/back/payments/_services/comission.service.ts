import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import {environment} from 'src/environments/environment'
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/front/_services/auth.service';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
const host = environment.BACK_API_WPA;
const httpOptions = { 
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ComissionService {
  userID;

  constructor(private http: HttpClient,
 
    private platform:Platform,
    private httpNative: HTTP) { 
   

  }


  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }

  getDelivery(user): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
  
      const options = { headers: headers };
      return this.http.get(host+'/api/deliveries/'+user.id , options).pipe(
        map(this.extractData));

    }else{
      this.httpNative.setServerTrustMode("nocheck");
      let info=JSON.parse(user);
      let id=info.data.id;
      return from(
        this.httpNative.get(environment.BACK_API_MOBILE+'/api/deliveries/'+id ,  {},
        {
          "Content-Type": "application/json",
          "accept": "application/json"
        }  
        )
      ).pipe(
        map(data=>{
          return JSON.parse(data.data)
        })
      )



    }

  }




  
  getComissions(user,page): Observable<any>{
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
 
      const options = { headers: headers };

      return this.http.get(host+'/api/comissions?page='+page+'&delivery.id='+user.id+'&order%5BcreatedAt%5D=desc'  , options).pipe(
        map(this.extractData));

    }else{
      let info=JSON.parse(user);
      let id=info.data.id;
      this.httpNative.setServerTrustMode("nocheck");
      return from(
  
         this.httpNative.get(environment.BACK_API_MOBILE+'/api/comissions?page='+page+'&delivery.id='+id+'&order%5BcreatedAt%5D=desc' ,  {},
        {
          "Content-Type": "application/json",
          "accept": "application/json"
        }  )

      ).pipe(
        map(data=>{
          return JSON.parse(data.data)
        })
      )

    }
  }



 
  

}
