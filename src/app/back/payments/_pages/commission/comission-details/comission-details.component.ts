import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comission-details',
  templateUrl: './comission-details.component.html',
  styleUrls: ['./comission-details.component.scss'],
})
export class ComissionDetailsComponent implements OnInit {
  @Input() comission: any;
  constructor(  public modalController: ModalController) { }

  ngOnInit() {}
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
