import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
import { HttpClientService } from 'src/app/api/http-client.service';



@Injectable({
  providedIn: 'root'
})
export class PhoneVerifService {

 
  constructor(
    private http: HttpClientService
  ) { 
    this.setEndpoint()
    
  }

  

  verifyNumber(number:any,code:any){
    this.setEndpoint();
    return this.http.save({
      telephone: number,
      code: code
    });

  }
  
  sendCode(number){
    this.http.endpoint='send-code';
    return this.http.save({
      telephone: number,
    });

  }

  

  setEndpoint(){
    this.http.endpoint='verify-code';
  }



}
