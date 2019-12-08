import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController, IonRouterOutlet} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  message = '';
  messages = [];
  currentUser = '';

  canGoBack: boolean = false;
  
  constructor(
    private toastCtrl: ToastController,
    private socket: Socket,
    private activatedRoute: ActivatedRoute,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    
    this.canGoBack =this.routerOutlet &&
                    this.routerOutlet.canGoBack();

    this.currentUser = this.activatedRoute.snapshot.paramMap.get('nickname');
    console.log( this.currentUser);

    this.socket.connect();
    
    this.socket.emit('set-name', this.currentUser);
 
    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast( user + 'ha dejado el chat');
      } else {
        this.showToast( user + ' ha ingresado al chat');
      }
    });
 
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }
    
  ionViewWillLeave() {
    this.socket.disconnect();
  }
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
