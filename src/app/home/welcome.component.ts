import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef, APP_ID, HostListener } from '@angular/core';
import { DclComponent } from '../_helper/dcl.component';
import { AuthGuard } from '../_helper/auth.guard';
import { TabDirective } from 'ngx-bootstrap/tabs';

import { HttpRequest } from '../_helper/http.request';
import { BusService } from '../_service/bus.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './welcome.component.html'
})

export class WelcomeComponent implements OnInit, AfterViewInit, DclComponent  {

    constructor(protected hr: HttpRequest, private busService: BusService, private route: Router) {
    }
    food = [];
    
    life = [];
    ngOnInit() {
        this.hr.post('files/list/m',{}, result => {
            for(var i in result.data){
                // if(result.data[i].indexOf('.png') == result.data[i].length-4){
                //     this.food.push(this.hr.mediaUrlFromFoodId(result.data[i]));
                // }
                if(/^\d+_00_\d+\.svg$/.test(result.data[i]) ){
                    this.food.push(this.hr.mediaUrlFromFoodId(result.data[i]));
                }
            }
        });
        this.hr.post('files/list/n',{}, result => {
            for(var i in result.data){
                if(/^\d+_00_\d+\.svg$/.test(result.data[i]) ){
                    this.life.push(this.hr.mediaUrlFromLifeId(result.data[i]));
                }
            }
        });
    }

    ngAfterViewInit(){

    }
    onSelect(i: number, f: string){ //2026_01_2.png
        if(/[0-9]{4}_[0-9]{2}_[0-9]{1}/.test(f)){
            var n = f.split('_')[2].replace(/\.png/g, '');
            this.route.navigate(['/poster'], {queryParams: {id: (2019+i)+'',num:(n)}});
        }else {
            this.route.navigate(['/poster'], {queryParams: {id: (2019+i)+'',num:2}});
        }
        
    }
    onSelected(i: number, f: string){ //2026_01_2.png
        if(/[0-9]{4}_[0-9]{2}_[0-9]{1}/.test(f)){
            var n = f.match(/([\d]+)_([\d]+)_([\d]+)/);
            this.route.navigate(['/product'], {queryParams: {id: n[1]+'',num:n[3] }});
        }
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