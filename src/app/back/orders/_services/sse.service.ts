import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SseService {
  constructor(private http:HttpClient) { }
  evs:EventSource;
  private subj=new BehaviorSubject([]);
  returnAsObservable()
  {
  return this.subj.asObservable();
  }
  GetExchangeData(url)
  {
  let subject=this.subj;
  if(typeof(EventSource) !=='undefined')
  {
  this.evs=new EventSource(url);
  this.evs.onopen=function(e)
  {
  console.log("Opening connection.Ready State is "+this.readyState);
  }
  this.evs.onmessage=function(e)
  {
  console.log("Message Received.Ready State is "+this.readyState);
  
  subject.next(JSON.parse(e.data));
  }
  this.evs.addEventListener("timestamp",function(e)
  {
  console.log("Timestamp event Received.Ready State is "+this.readyState);
  subject.next(e["data"]);
  })
  this.evs.onerror=function(e)
  {
  console.log(e);
  if(this.readyState==0)
  {
  console.log("Reconnecting…");
  }
  }
  }
  }


  stopExchangeUpdates()
  {
  this.evs.close();
  }
  

    
}