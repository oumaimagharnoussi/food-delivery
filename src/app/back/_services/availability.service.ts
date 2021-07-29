import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService { 

  isOnline:boolean;
 
  @Output() change: EventEmitter<boolean> = new EventEmitter();


  constructor() { }

  setOnline(){
    this.isOnline=true;
    this.change.emit(this.isOnline);

  }

  
  setOffline(){ 
    this.isOnline=false;
    this.change.emit(this.isOnline);
  
  }


}
