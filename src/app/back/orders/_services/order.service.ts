import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const host = 'https://127.0.0.1:8000';
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


}
