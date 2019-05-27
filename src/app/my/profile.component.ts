import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef } from '@angular/core';
import { DclComponent } from '../_helper/dcl.component';
import { AuthGuard } from '../_helper/auth.guard';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit, DclComponent  {
    profile: any;
    avialable: number = 0;
    nforward: number = 0;
    constructor( private authGuard: AuthGuard,private sanitizer: DomSanitizer ) {
        authGuard.updateProfile();
    }

    ngOnInit() {
        this.profile = this.authGuard.profile;
    }
    
    load(d: any = null) {
        
    }
}