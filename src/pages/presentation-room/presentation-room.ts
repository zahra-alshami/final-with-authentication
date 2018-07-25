import { IonicPage, NavParams, ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomePage } from '../home/home';


interface IPresentation {
  username: string,
  url: string,
  size: number,
  num: number,
  event: string,
  color:string
}


@IonicPage()
@Component({
  selector: 'page-presentation-room',
  templateUrl: 'presentation-room.html'
})
export class PresentationRoomPage {
  public rootPage: any = HomePage;

  idle = true;
  username = '';
  presentation: IPresentation = { username: '', url: '', size: 1, num: 1, event: 'first',color:'primary' };

  configUrl = 'http://localhost:3001/seminars/1/config.json'

  constructor(public navParams: NavParams,
    private socket: Socket,
    private toastCtrl: ToastController,
    public navController: NavController,
    private sanitizer: DomSanitizer) {

    const username = this.navParams.get('username');
    // console.log('username ' + username)
    if (username === undefined || username === '') {
      this.navController.push(this.rootPage);
      return;
    }
    this.username = username;

    this.connect();

    this.getUsers().subscribe(data => {
      const user = data['username'];
      if (data['event'] === 'left') {
        this.showToast(`User ${user} left`);
      } else {
        this.showToast(`User ${user} joined`);
      }
    });

    this.getPresentation().subscribe(data => {
      const dp = data as IPresentation;
      // console.log(`getPresentation() : ${JSON.stringify(dp)}`);
      const p = this.presentation;
      p.username = dp.username;
      p.url = dp.url;
      p.size = dp.size;
      p.num = dp.num;
      p.event = dp.event;
      p.color=dp.color;
    });
  }

  url(): SafeResourceUrl {
    const slideUrl = `${this.presentation.url}/${this.presentation.num}.html`
    return this.sanitizer.bypassSecurityTrustResourceUrl(slideUrl);
  }

  connect() {
    console.log('connect() call');
    if (this.username === '' || this.username === undefined) {
      console.log('connect(): no username ' + this.username);
      return;
    }

    this.socket.connect();
    this.socket.emit('set-username', this.username);
    this.socket.emit('which-presentation');
  }

  disconnect() {
    this.socket.disconnect();
  }

  isFreePresentation() {
    //TODO bad code here, use user authentication instead !
    return [undefined, '', this.username].some( i => i === this.presentation.username)
    //return this.idle;
  }

  setPresentationConfig() {
    console.log('set presentation on url : ' + this.configUrl);
    this.socket.emit('set-presentation', this.configUrl);
  }

  getPresentation() {
    let observable = new Observable(observer => {
      this.socket.on('presentation', data => {
        // console.log('getPresentation() ' + JSON.stringify(data));
        observer.next(data);
      });
    })
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', data => {
        // console.log('getUsers() ' + JSON.stringify(data));
        observer.next(data);
      });
    });
    return observable;
  }

  nextSlide() {
    if (this.presentation.num < this.presentation.size) {
      this.presentation.event = 'next';
      this.socket.emit('set-slide', this.presentation)
    }
  }

  prevSlide() {
    if (this.presentation.num > 1) {
      this.presentation.event = 'prev';
      this.socket.emit('set-slide', this.presentation)
    }
  }

  firstSlide() {
    if (this.presentation.num !== 1) {
      this.presentation.event = 'first';
      this.socket.emit('set-slide', this.presentation)
    }
  }

  lastSlide() {
    if (this.presentation.num !== this.presentation.size) {
      this.presentation.event = 'last';
      this.socket.emit('set-slide', this.presentation)
    }
  }

  getSlide() {
    let observable = new Observable(observer => {
      this.socket.on("slide", data => {
        observer.next(data);
      });
    })
    return observable;
  }

  ionViewWillLeave() {
    this.disconnect();
  }

  // ionViewDidLoad() {
  //   this.connect();
  // }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
  btnArray = 
  [
      {
          "title":"Btn1",
          "backgroudColor":"#ff00ff"
      },
      {
          "title":"Btn2",
          "backgroudColor":"#ff00ff"
      },
      {
          "title":"Btn3",
          "backgroudColor":"#ff00ff"
      }
  ]
  btnActivate(ind)
  {
      this.presentation.color=this.btnArray[ind]['backgroudColor'] = "#ffff00";
  }
  
}