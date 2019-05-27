import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../_helper/auth.guard';
import { BusService } from '../_service/bus.service';
import { AuthMessage } from '../_service/auth.message';
import { DomSanitizer } from '@angular/platform-browser';
import { DclComponent } from '../_helper/dcl.component';
import { HttpRequest } from '../_helper/http.request';
import { DialogMessage } from '../_service/dialog.message';
import { DialogComponent } from '../_helper/dialog.component';
import { DclWrapperMessage } from '../_service/dclwrapper.message';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit, AfterViewInit, DclComponent {
    loginForm: FormGroup;
    loading = false;
    tel: FormControl = new FormControl('', [Validators.required,Validators.pattern(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/)] );
    code: FormControl = new FormControl('',[Validators.required,Validators.pattern(/^\d{4}$/)]);

    constructor(
        private formBuilder: FormBuilder,
        private busService: BusService, 
        private auth: AuthGuard)
         {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            tel: this.tel,
            code: this.code
        });
        // reset login status

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returl'];
        
    }

    ngAfterViewInit(){

    }

    err: string = '';
    onLogin() {
        this.loginForm.updateValueAndValidity();
        if (this.loginForm.controls.code.invalid) {
            this.loginForm.controls.code.markAsDirty();
            this.err = '请正确填写4位验证码';
            //this.busService.send(new DialogMessage(this, DialogComponent, '请正确填写4位验证码'));
            return;
        }
        this.auth.login(this.loginForm.getRawValue(), success=>{
            this.busService.send(this.last);
        },error => {
            this.loginForm.get(error.data).setErrors({backend:true})
            this.err = error.msg;
        });
    }
    onCheckin(){
        this.loginForm.updateValueAndValidity();
        if (this.loginForm.controls.tel.invalid) {
            this.loginForm.controls.tel.markAsDirty();
            //this.busService.send(new DialogMessage(this, DialogComponent, '请正确填写11位手机号'));
            return;
        }
        this.auth.checkin(this.loginForm.controls.tel.value, 
        null, 
        error => {
            this.loginForm.get(error.data).setErrors({backend:true})
            this.err = error.msg;
        });
    }

    last: DclWrapperMessage = null
    load(d: any = null) {
        this.last = d;
    }
}