
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
import { HttpClientService } from 'src/app/api/http-client.service';



@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

 
  constructor(
    private http: HttpClientService
  ) { 
    this.setEndpoint()
    
  }

  
  resetPassword(currentPassword,newPassword){
    this.setEndpoint();
    return this.http.findOne(currentPassword+'/'+newPassword)
  }
  

  setEndpoint(){
    this.http.endpoint='change-password';
  }



}
