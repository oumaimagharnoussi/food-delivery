import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import {environment} from 'src/environments/environment'
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
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
export class OrderService {

  constructor(private http: HttpClient,
    private platform:Platform,
    private httpNative: HTTP) { 


  }

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }

  getOrders(user): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
  
      const options = { headers: headers };
      return this.http.get(host+'/api/nearby_orders/'+user.id , options).pipe(
        map(this.extractData));

    }else{
      let info=JSON.parse(user);
      let id=info.data.id;
      this.httpNative.setServerTrustMode("nocheck");
      return from(
        this.httpNative.sendRequest(environment.BACK_API_MOBILE+'/api/nearby_orders/'+id ,{method: "get"
        ,serializer:"json",responseType:"json"})
      ).pipe(
        map(data=>{
          return data.data
        })
      )




    }

  }
  getAcceptedOrders(user,page): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
    
      const options = { headers: headers };
      return this.http.get(host+'/api/orders?status=INDELIVERY&delivery.id='+user.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc' , options).pipe(
        map(this.extractData));
    

    }else{
      let info=JSON.parse(user);
      let id=info.data.id;
      this.httpNative.setServerTrustMode("nocheck");
      return from(
        this.httpNative.get(environment.BACK_API_MOBILE+'/api/orders?status=INDELIVERY&delivery.id='+id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc' ,  {},
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

  getOrder(id): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
  
      const options = { headers: headers };
      return this.http.get(host+'/api/orders/'+id , options).pipe(
        map(this.extractData));

    }else{


      this.httpNative.setServerTrustMode("nocheck");
      return from(
        this.httpNative.sendRequest(environment.BACK_API_MOBILE+'/api/orders/'+id ,{method: "get"
        ,serializer:"json",responseType:"json"})
      ).pipe(
        map(data=>{
          return data.data
        })
      )
    


    }

  }


  getDelivery(user): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
  
      const options = { headers: headers };
      return this.http.get(host+'/api/deliveries/'+user , options).pipe(
        map(this.extractData));

    }else{
      this.httpNative.setServerTrustMode("nocheck");
      
      
      return from(
        this.httpNative.get(environment.BACK_API_MOBILE+'/api/deliveries/'+user ,  {},
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



  accept(order_id,user): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      return this.http.put(host+'/api/orders/'+order_id, {
        delivery:"api/deliveries/"+user.id,
        status: "INDELIVERY",
        acceptedDeliveryAt: new Date()
      }, httpOptions);
    }
    else{
      this.httpNative.setServerTrustMode("nocheck");
      let info=JSON.parse(user);
      let id=info.data.id;
      
      return from(

      this.httpNative.sendRequest(environment.BACK_API_MOBILE+'/api/orders/'+order_id,{method: "put",data:
      {
  
        status:  "INDELIVERY",
        delivery: "api/deliveries/"+id

                  
      }
      ,serializer:"json"})

    ).pipe(
      map(data=>{
        return JSON.parse(data.data)
      })
    )
    }

  }
  finish(order_id): Observable<any> {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      return this.http.put(host+'/api/orders/'+order_id, {
      
        status: "DELIVERED",
        deliveredAt: new Date()
      
      }, httpOptions);

    }else{
      return from(
        this.httpNative.sendRequest(environment.BACK_API_MOBILE+'/api/orders/'+order_id,{method: "put",data:
        {
    
          status:  "DELIVERED",
          deliveredAt: new Date()
     
        }
        ,serializer:"json"})
      ).pipe(
        map(data=>{
          return JSON.parse(data.data)
        })
      )

    }

  }


}
