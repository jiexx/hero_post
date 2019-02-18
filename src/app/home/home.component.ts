import { Component, OnInit, ViewChild, Type, AfterViewInit } from '@angular/core';
import { CommonModule , Location} from '@angular/common';
import { MenuFactory, OnMenuClick, Menu } from '../_helper/navbar.component';
import { DclWrapper } from '../_helper/dcl.wrapper';
import { BusService } from '../_service/bus.service';
import { ProfileComponent } from '../my/profile.component';
import { AuthGuard } from '../_helper/auth.guard';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { WelcomeComponent } from './welcome.component';
import { Router } from '@angular/router';

class exitClick implements OnMenuClick {

  constructor(private home: HomeComponent){
  }
  onClick(menu:Menu){
    this.home.home();
    return false;
  }
}

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  @ViewChild('content') content: DclWrapper;

  menuFactory: MenuFactory;

  constructor(private busService: BusService, public authGuard: AuthGuard, private router: Router) {
    
  }
  ngOnInit(){
    //console.log('home');
    this.menuFactory = new MenuFactory(this.busService, this.content);
    this.menuFactory.createMenu(ProfileComponent, null, this.authGuard.profile.AVATAR);
    this.menuFactory.createMenu(null, '返回', null, new exitClick(this));
    this.busService.receive(this,msg => {
      this.authGuard.loadComponentAfterToken(new DclWrapperMessage(this.content, this.content, msg.component,null));
    })
    this.home();
  }

  home(){
    this.authGuard.loadComponentAfterToken(new DclWrapperMessage(this.content, this.content, WelcomeComponent,null));
  }

}