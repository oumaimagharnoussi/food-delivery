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

  ngOnInit() {
    this.mapInit(this.source,this.destination)

  }
  mapInit(source,destination){
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 17,
      center: destination,
      mapId: '68e5f02535b42522',
      disableDefaultUI: true
    });
    this.directionsDisplay.setMap(this.map);
    var markerStart = new google.maps.Marker({
      position: source,
      icon: {
        url: './assets/imgs/truck_pin.svg',
        anchor: new google.maps.Point(35,10),
        scaledSize: new google.maps.Size(70, 70)
      },
      map: this.map
    });
    var destinationMarker = new google.maps.Marker({
      position: destination,
      icon: {
        url: './assets/imgs/destination_custom_pin.svg',
        anchor: new google.maps.Point(35,10),
        scaledSize: new google.maps.Size(70, 70)
      },
      map: this.map
    });
  }
  calculateAndDisplayRoute () {

    const that = this;
    this.directionsService.route({
      origin: this.source,
      destination: this.destination ,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setOptions({
          suppressPolylines: false,
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
