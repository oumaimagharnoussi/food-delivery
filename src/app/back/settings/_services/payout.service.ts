import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
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

  constructor(private http: HttpClient) {

  }
  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }

  addMethod(data): Observable<any> {
    return this.http.post(host+'/api/payment_methods', data, httpOptions);
  }
  deleteMethod(id): Observable<any> {
    return this.http.delete(host+'/api/payment_methods/'+id,httpOptions);

  }


}
