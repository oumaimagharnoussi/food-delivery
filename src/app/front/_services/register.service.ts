import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import DeliveryBoy from '../_models/DeliveryBoy';
import { Observable } from 'rxjs';
const host = 'https://localhost';

const httpOptions = { 
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  constructor(private http: HttpClient) {

  }
  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }



  register(user :DeliveryBoy): Observable<any> {
    return this.http.post('/api/deliveries', user, httpOptions);
  }

  login(credentials): Observable<any>  {
    return this.http.post('/api/login_check', credentials,httpOptions)
     
  }



}
