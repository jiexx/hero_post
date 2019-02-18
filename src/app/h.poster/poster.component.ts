import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef, APP_ID, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { DclComponent } from '../_helper/dcl.component';
import { AuthGuard } from '../_helper/auth.guard';
import { TabDirective } from 'ngx-bootstrap/tabs';

import { HttpRequest } from '../_helper/http.request';
import { TagModel } from 'ngx-chips/core/accessor';
import { of,Observable} from 'rxjs';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { EditorComponent } from './editor.component';


@Component({
    templateUrl: './poster.component.html',
    animations: [
        trigger(
          'enterAnimation', [
            transition(':enter', [
              style({/*transform: 'translateX(100%)',*/ opacity: 0}),
              animate('200ms', style({ /*transform:'translateX(0)',*/ opacity: 1}))
            ]),
            transition(':leave', [
              style({/*transform: 'translateX(0)',*/ opacity: 1}),
              animate('200ms', style({/*transform: 'translateX(100%)',*/ opacity: 0}))
            ])
          ]
        )
      ],
})

export class PosterComponent implements OnInit, AfterViewInit, DclComponent  {

    constructor(protected hr: HttpRequest, private busService: BusService) {
    }
    show = false;
    cover = 'assets/img/thumb01.jpg';
    letter = ['assets/img/orig01.jpg'];
    names = [];
    selected = 'mail';
    ngOnInit() {

    }
    ngAfterViewInit(){

    }
    onEdit(){
        this.busService.send(new DclWrapperMessage(this, 'HomeComponent', EditorComponent,null));
    }
    onSelect(value: any){
        if(this.selected='mail'){
            this.selected = 'ecard';
        }else{
            this.selected = 'mail';
        }
    }

    onNameAdd($event){
        console.log(this.names);
        this.letter.push(this.letter[0]);
    }
    onNameRemove($event){
        console.log(this.names);
        this.letter.pop();
    }
    
    load(d: any = null) {
        
    }
}