import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
declare var google;
@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss'],
})
export class ModalMapComponent implements OnInit {
  map:any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  


  @Input() destination: any;
  @Input() source: any;

  constructor(public modalController: ModalController) { }

   contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">McPizza</h1>' +
    
    '<div> <ion-button id="navigate">Navigate</ion-button> </div>'
    "</div>";
  ngOnInit() {
    this.mapInit(this.source,this.destination)

  }
  mapInit(source,destination){
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 9,
      center: source,
      mapId: '68e5f02535b42522',
      disableDefaultUI: true
    });
    this.directionsDisplay.setMap(this.map);
    const infowindow = new google.maps.InfoWindow({
      content: this.contentString,
    });
    var markerStart = new google.maps.Marker({
      position: source,
      title: "you",
      icon: {
        url: './assets/imgs/truck_pin.svg',
        anchor: new google.maps.Point(35,10),
        scaledSize: new google.maps.Size(70, 70)
      },
      map: this.map
    });

    var markerRestaurant = new google.maps.Marker({
      position: {
        lat: 35.69303302544718,
        lng: 8.902773358214844
      },
      icon: {
        url: './assets/imgs/restau.svg',
        anchor: new google.maps.Point(35,10),
        scaledSize: new google.maps.Size(50, 50)
      },
      map: this.map
    });
    markerRestaurant.addListener("click", () => {
      this.calculateAndDisplayRoute()
      infowindow.open(this.map, markerRestaurant);
    });
    var markerClient = new google.maps.Marker({
      position: destination,
      icon: {
        url: './assets/imgs/destination_custom_pin.svg',
        anchor: new google.maps.Point(35,10),
        scaledSize: new google.maps.Size(70, 70)
      },
      map: this.map
    });
    markerClient.addListener("click", () => {
      this.directionToClient()
    });
    google.maps.event.addListener(infowindow,'domready',()=> {
      document.getElementById('navigate').addEventListener('click',()=> {
        console.log('navigation clicked')
        window.open('https://www.google.com/maps/dir/?api=1&origin='+source.lat+','+source.lng+'&destination='+destination.lat+','+destination.lng)
      })
    })
  }
  calculateAndDisplayRoute () {

    const that = this;
    this.directionsService.route({
      origin: this.source,
      destination: {
        lat: 35.69303302544718,
        lng: 8.902773358214844
      } ,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setOptions({
          suppressPolylines: false,
          suppressMarkers: true,

          map:document.getElementById("map")
        })
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

  
  }
  directionToClient(){
    const that = this;
    this.directionsService.route({
      origin: this.source,
      destination: this.destination ,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setOptions({
          suppressPolylines: false,
          suppressMarkers: true,
          map:document.getElementById("map")
        })
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
