import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
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
export class PayoutService {


  constructor(private http: HttpClient,
    private httpNative: HTTP,
    private platform:Platform,
    private auth:AuthService,
    ) {


  }
  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }

  addMethod(data,user): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      data.delivery="api/deliveries/"+user.id;
      return this.http.post(host+'/api/payment_methods', data, httpOptions);
    }
    else{
      let info=JSON.parse(user);
      let id=info.data.id;
      data.delivery="api/deliveries/"+id;
    return  from(
      this.httpNative.sendRequest(environment.BACK_API_MOBILE+'/api/payment_methods',{method: "post",data:
      data
         ,serializer:"json"})

      )
      


    }
    
  }

  deleteMethod(id){
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      return this.http.delete(host+'/api/payment_methods/'+id,httpOptions);

    }
    else{
      this.httpNative.setServerTrustMode("nocheck");
      return from(
       
        this.httpNative.delete(environment.BACK_API_MOBILE+'/api/payment_methods/'+id ,  {},
        {
          "Content-Type": "application/json",
          "accept": "application/json"
        }  )

      )
      
    }

  }



}
