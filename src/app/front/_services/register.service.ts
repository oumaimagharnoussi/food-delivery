import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import DeliveryBoy from '../_models/DeliveryBoy';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
import { HttpClientService } from 'src/app/api/http-client.service';



@Injectable({ 
  providedIn: 'root'
})
export class RegisterService {


  constructor(private http: HttpClientService) {
    this.http.endpoint='deliveries'

  }

  register(user :DeliveryBoy): Observable<any> {
    this.http.endpoint='deliveries'
    return this.http.save(user);
  }





}
