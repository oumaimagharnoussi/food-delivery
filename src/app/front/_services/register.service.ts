import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import DeliveryBoy from '../_models/DeliveryBoy';
import { Observable } from 'rxjs';

const host = 'http://127.0.0.1:8000';

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
    return this.http.post(host+'/api/deliveries', user, httpOptions);
  }

  login(credentials): Observable<any>  {
    return this.http.post(host+'/api/login_check', credentials,httpOptions)
     
  }



}
