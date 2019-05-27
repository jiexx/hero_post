import { Component, ChangeDetectorRef, Input, AfterViewInit, OnInit, ViewChild, ElementRef, APP_ID, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { DclComponent } from '../_helper/dcl.component';
import { AuthGuard } from '../_helper/auth.guard';

import { HttpRequest } from '../_helper/http.request';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { PosterManager } from './poster.manager';
import { DialogMessage } from '../_service/dialog.message';
import { DialogComponent } from '../_helper/dialog.component';

import jsQR from "jsqr";

@Component({
  templateUrl: './product.component.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({/*transform: 'translateX(100%)',*/ opacity: 0 }),
          animate('200ms', style({ /*transform:'translateX(0)',*/ opacity: 1 }))
        ]),
        transition(':leave', [
          style({/*transform: 'translateX(0)',*/ opacity: 1 }),
          animate('200ms', style({/*transform: 'translateX(100%)',*/ opacity: 0 }))
        ])
      ]
    )
  ],
})

export class ProductComponent implements OnInit, AfterViewInit, DclComponent {

  posterManager: PosterManager
  constructor(protected hr: HttpRequest, private busService: BusService, private route: Router,public sanitizer: DomSanitizer) {
    var i = 1;
  }
  //show = [false,false];
  //photoes: any[] = ['assets/img/thumb01.jpg', 'assets/img/orig01.jpg']

  ngOnInit() {
  }
  ngAfterViewInit() {
    //this.photoes[0] = (JSON.parse(localStorage.getItem('0_svg')));
    
  }
  onSelect(i: number) {
    this.hr.post('qrcode', {url:this.hr.mediaUrlFromLifeId(this.posterManager.pngRemoteId())}, (result)=>{
      this.busService.send(new DialogMessage(this, DialogComponent, {info:result.data.url,img:result.data.qr}));
    });
    
  }
  load(d: any = null) {
    this.posterManager = PosterManager.from(d.id,parseInt(d.num));
    this.hr.post('poster/publish',{posterid:d.id, posternum:parseInt(d.num)}, (result)=>{
      this.posterManager.fromDownData(result.data);
    })
  }
}