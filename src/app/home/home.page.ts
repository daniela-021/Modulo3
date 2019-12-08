import { Component, OnInit,  } from '@angular/core';
import {IonRouterOutlet } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
 
  canGoBack: boolean = false;

  currentUser = '';

  constructor(
    private routerOutlet: IonRouterOutlet,
    private nativeStorage: NativeStorage
    
    
  ) {}

  ngOnInit() {
    this.nativeStorage.getItem('nickname')
  .then(
    data =>{
       console.log(data)
       this.currentUser = data.nombre
    },
    error => console.error(error)
  );
    
    this.canGoBack =this.routerOutlet && this.routerOutlet.canGoBack();
  }
  ionViewWillLeave(){

    this.nativeStorage.setItem('nickname', {nombre: this.currentUser,})
  .then(
    () => console.log('nickname Stored '),
    error => console.error('Error storing item', error)
  );
  }
 
}
