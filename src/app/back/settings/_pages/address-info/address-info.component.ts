

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;
@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss'],
})
export class AddressInfoComponent implements OnInit {

  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;

 
  constructor(
    private geolocation: Geolocation,
  
    public zone: NgZone,
  ) {
   
  }
 
  //LOAD THE MAP ONINIT.
  ngOnInit() {
    this.initMap()
   
  }

  
 markers = [];

 initMap() {
  const haightAshbury = { lat: 37.769, lng: -122.446 };
  this.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: haightAshbury,
    mapTypeId: "terrain",
  });
  // This event listener will call addMarker() when the map is clicked.
  this.map.addListener("click", (event) => {
    this.addMarker(event.latLng);
  });
  // add event listeners for the buttons
  document
    .getElementById("show-markers")
    .addEventListener("click", this.showMarkers);
  document
    .getElementById("hide-markers")
    .addEventListener("click", this.hideMarkers);
  document
    .getElementById("delete-markers")
    .addEventListener("click", this.deleteMarkers);
  // Adds a marker at the center of the map.
  this.addMarker(haightAshbury);
}

// Adds a marker to the map and push to the array.
addMarker (position) {
  let map=this.map
  const marker = new google.maps.Marker({
    position,
    map
  });
  this.markers.push(marker);
}

// Sets the map on all markers in the array.
 setMapOnAll(map) {
  for (let i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
 hideMarkers() {
  this.setMapOnAll(null);
}

// Shows any markers currently in the array.
 showMarkers() {
  this.setMapOnAll(this.map);
}

// Deletes all markers in the array by removing references to them.
 deleteMarkers() {
  this.hideMarkers();
  this.markers = [];
}

}
