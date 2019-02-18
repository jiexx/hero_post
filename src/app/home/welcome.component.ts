import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef, APP_ID, HostListener } from '@angular/core';
import { DclComponent } from '../_helper/dcl.component';
import { AuthGuard } from '../_helper/auth.guard';
import { TabDirective } from 'ngx-bootstrap/tabs';

import { HttpRequest } from '../_helper/http.request';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { PosterComponent } from '../h.poster/poster.component';
import { HomeComponent } from './home.component';

@Component({
    templateUrl: './welcome.component.html'
})

export class WelcomeComponent implements OnInit, AfterViewInit, DclComponent  {

    constructor(protected hr: HttpRequest, private busService: BusService) {
    }
    food = ['assets/img/thumb01.jpg',
    'assets/img/thumb02.jpg',
    'assets/img/thumb03.jpg',
    'assets/img/thumb04.jpg',
    'assets/img/thumb05.jpg',
    'assets/img/thumb06.jpg',
    'assets/img/thumb07.jpg',
    'assets/img/thumb08.jpg',
    'assets/img/thumb09.jpg'];
    
    life = ['assets/img/thumb10.jpg',
    'assets/img/thumb11.jpg',
    'assets/img/thumb12.jpg',
    'assets/img/thumb13.jpg',
    'assets/img/thumb14.jpg',
    'assets/img/thumb15.jpg',
    'assets/img/thumb16.jpg',
    'assets/img/thumb17.jpg',
    'assets/img/thumb18.jpg'];
    ngOnInit() {

    }
    ngAfterViewInit(){

    }
    onSelect(value: any){
        this.busService.send(new DclWrapperMessage(this, 'HomeComponent', PosterComponent,null));
    }
    scrollable: boolean = false;
    offset: number = 0;
    mouseMove(e: MouseEvent): void {
        if(this.scrollable){
            let elem = e.target as HTMLElement;
            if(!elem.classList.contains('flex-row')) elem = elem.parentElement;
            //console.log("mousemove demo events",elem.getAttribute('id'),-e.clientX+this.offset) 
            elem.scrollTo({ left: -e.clientX+this.offset, top: 0, behavior: 'smooth' });
            //elem.scrollLeft = 100;
        }
    }
    @HostListener('mouseup', ['$event'])
    @HostListener('touchup', ['$event'])
    onmouseup(e: MouseEvent) {
        //console.log("onmouseup");
        this.scrollable = false;
    }
    @HostListener('mousedown', ['$event'])
    @HostListener('touchdown', ['$event'])
    onmousedown(e: MouseEvent) {
        //console.log("onmousedown");
        e.preventDefault();
        this.scrollable = true;
        this.offset = e.clientX;
    }
    
    load(d: any = null) {
        
    }
}