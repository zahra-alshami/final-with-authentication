import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import {user} from '../../../server/models/user'

//import {  server} from "../../../server/server";
/**
 * Generated class for the LogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@IonicPage()
@Component({
  selector: 'page-log',
  templateUrl: 'log.html'
})
export class LogPage {
  username = '';
  password= '';
  constructor(public navCtrl: NavController,
    private socket: Socket,public toastCtrl:ToastController,) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LogPage');
  }
  joinPresentaion() {
 
    user.authenticate(this.username, this.password, function (error, user) {
      if (error || !user) {
        //var err = new Error('Wrong username or password.');
       this.showToast('Wrong username or password')
      } else {
        this.navCtrl.push('PresentationRoomPage',
        {
          username: this.username,
          socket: this.socket
        });
      }
    }); 
  } 
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
}
