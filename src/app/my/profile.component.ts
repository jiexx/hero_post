import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef } from '@angular/core';
import { DclComponent } from '../_helper/dcl.component';
import { AuthGuard } from '../_helper/auth.guard';


@Component({
    templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit, DclComponent  {
    profile: any;
    avialable: number = 0;
    nforward: number = 0;
    constructor( private authGuard: AuthGuard ) {
        authGuard.updateProfile();
    }

    ngOnInit() {
        this.profile = this.authGuard.profile;
    }
    
    load(d: any = null) {
        
    }
}