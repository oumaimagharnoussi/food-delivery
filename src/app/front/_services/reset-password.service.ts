import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
import { HttpClientService } from 'src/app/api/http-client.service';



@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

 
  constructor(
    private http: HttpClientService
  ) { 
    this.setEndpoint()
    
  }

  

  sendVerification(email:any){
    this.setEndpoint();
    return this.http.findOne('request/'+email);

  }

  verifyToken(token){
    this.setEndpoint();
    return this.http.findOne('valid/'+token)
  }

  resetPassword(token,password){
    this.setEndpoint();
    return this.http.findOne('reset/'+token+'/'+password)


  }

  setEndpoint(){
    this.http.endpoint='reset-password';
  }



}
