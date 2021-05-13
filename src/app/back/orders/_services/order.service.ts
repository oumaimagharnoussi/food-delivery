import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import {environment} from 'src/environments/environment'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor(private http: HttpClient) { 

  }

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }

  getOrders(id): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });

    const options = { headers: headers };
    return this.http.get(host+'/api/nearby_orders/'+id , options).pipe(
      map(this.extractData));
  }
getAcceptedOrders(id,page){

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': 'application/json'
  });

  const options = { headers: headers };
  return this.http.get(host+'/api/orders?status=INDELIVERY&delivery.id='+id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc' , options).pipe(
    map(this.extractData));


}

  getOrder(id): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });

    const options = { headers: headers };
    return this.http.get(host+'/api/orders/'+id , options).pipe(
      map(this.extractData));
  }

  getDelivery(id): Observable<any> { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });

    const options = { headers: headers };
    return this.http.get(host+'/api/deliveries/'+id , options).pipe(
      map(this.extractData));
  }


  accept(order_id,delivery_id): Observable<any> {
    return this.http.put(host+'/api/orders/'+order_id, {
      delivery:"api/deliveries/"+delivery_id,
      status: "INDELIVERY",
      acceptedDeliveryAt: new Date()
    }, httpOptions);
  }
  finish(order_id,delivery_id): Observable<any> {
    return this.http.put(host+'/api/orders/'+order_id, {
      
      status: "DELIVERED",
    
    }, httpOptions);
  }


}
