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
export class ComissionService {

  constructor(private http: HttpClient) { 

  }

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
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
  getComissions(id,page): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });

    const options = { headers: headers };
    return this.http.get(host+'/api/comissions?page='+page+'&delivery.id='+id  , options).pipe(
      map(this.extractData));
  }
}
