import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {

  @Input() order: any;
  @Input() delivery: any;
  distances: any;

  constructor(private order_service:OrderService,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController
    ) {
    console.log(this.order)
    console.log(this.delivery)
   }

  ngOnInit() {
    console.log(this.order)
    console.log(this.delivery)
    this.getDistances();
  }

  getDistances(){
    this.order_service.getDistances(this.order.order.id).subscribe(
      (data)=>{
        this.distances=data;
        console.log(this.distances)
      }
    )
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


 async acceptOrder(id){

  
   
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
          mode: 'ios',
          translucent: true
        });
        await loading.present();

        this.order_service.acceptOrder(id).subscribe(
          data=>{
            loading.dismiss();

            console.log('Loading dismissed!');
            this.showMessage("Order accepted","success")
            this.modalController.dismiss();
           // this.router.navigate(['/orders'])
          },err=>{
            loading.dismiss();
            console.log('Loading dismissed!'); 

          }
        )
     


  



}

finishOrder(id){
    this.order_service.finishOrder(id).subscribe(
          data=>{
            this.showMessage("Order finished","success")
           // window.location.href = "/app/payments";
           this.modalController.dismiss();
        
          }
        )

}


async accept(){ 
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Are you sure delivering order',
    message: '',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.acceptOrder(this.order.order.id)
        }
      }
    ]
  });

  await alert.present();
}
async finish(){ 
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Confirm delivery completed',
    message: '',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.finishOrder(this.order.order.id)
        }
      }
    ]
  });

  await alert.present();
}

async showMessage(message,color){
    
  const toast = await this.toastController.create({
    message: message,
    duration: 4000,
    color: color,
    position: 'bottom'
  });
  toast.present();
}

}
