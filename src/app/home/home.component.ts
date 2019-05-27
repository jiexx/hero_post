import { Component, OnInit, ViewChild, Type, AfterViewInit } from '@angular/core';
import { CommonModule , Location} from '@angular/common';
import { MenuFactory, OnMenuClick, Menu } from '../_helper/navbar.component';
import { DclWrapper } from '../_helper/dcl.wrapper';
import { BusService } from '../_service/bus.service';
import { ProfileComponent } from '../my/profile.component';
import { AuthGuard } from '../_helper/auth.guard';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { WelcomeComponent } from './welcome.component';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
/* import { PosterComponent } from '../h.poster/poster.component';
import { EditorComponent } from '../h.poster/editor.component'; */
import { ProductComponent } from '../h.poster/product.component';

class Trigger {
  triggers: any[];
  constructor(triggers: any[]){
    this.triggers = triggers
  }
  handle(route: Router, authGuard: AuthGuard, content: DclWrapper){
    
  }
}

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

  triggers: any;

  constructor(private busService: BusService, private authGuard: AuthGuard, private route: Router, private activatedRoute: ActivatedRoute, private location: Location) {
    
  }
  ngOnInit(){
    this.menuFactory = new MenuFactory(this.authGuard, this.content);
    this.menuFactory.createMenu(ProfileComponent, null, this.authGuard.profile.AVATAR);
    this.menuFactory.createMenu(null, '返回', null, new exitClick(this));

    this.triggers = {
      /* 'poster': PosterComponent, */
      'product':ProductComponent,
      /* 'editor': EditorComponent, */
      'home': WelcomeComponent,
    }

    if(this.triggers[this.activatedRoute.snapshot.url[0].path]){
      this.authGuard.loadComponentAfterToken(
        new DclWrapperMessage(this.content, this.content, this.triggers[this.activatedRoute.snapshot.url[0].path],this.activatedRoute.snapshot.queryParams)
      );
    }
    this.location.go('');
  }

  home(){
    //this.route.navigate(['/home'], {queryParams: {}});
    this.authGuard.loadComponentAfterToken(
      new DclWrapperMessage(this.content, this.content, this.triggers['home'],this.activatedRoute.snapshot.queryParams)
    );
  }

}