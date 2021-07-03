

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
import { HttpClientService } from 'src/app/api/http-client.service';



@Injectable({
  providedIn: 'root'
})
export class MailConfirmService {

 
  constructor(
    private http: HttpClientService
  ) { 
    this.setEndpoint()
    
  }

  

  sendConfirmation(id:any){
    this.setEndpoint();
    return this.http.findOne(id);

  }

  

  setEndpoint(){
    this.http.endpoint='confirm';
  }



}
