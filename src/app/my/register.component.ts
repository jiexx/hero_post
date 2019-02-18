import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BusService } from '../_service/bus.service';
import { DialogMessage } from '../_service/dialog.message';
import { DialogComponent } from '../_helper/dialog.component';
import { Router } from '@angular/router';
import { HttpRequest } from '../_helper/http.request';
import { AuthGuard } from '../_helper/auth.guard';
import { PhoneComponent } from '../_helper/phone.component';
import { ImageComponent } from '../_helper/image.component';

@Component({
    templateUrl: './register.component.html'
})

export class RegisterComponent implements DclComponent, OnInit  {
    @ViewChild('phone') pc: PhoneComponent;
    @ViewChild('image') ic: ImageComponent;
    profile: FormGroup ;

    username: FormControl = new FormControl('', [ Validators.required,Validators.pattern(/^[a-zA-Z\d\u4e00-\u9fa5]{6,8}$/) ] );
    password: FormControl = new FormControl('', [ Validators.required,Validators.pattern(/^[a-zA-Z\d]{6,8}$/) ] );
    address: FormControl = new FormControl('', [ Validators.required,Validators.pattern(/^[\d\u4e00-\u9fa5]{8,32}$/) ] );

    avatar: string[] = ['assets/img/avatar.svg'];
    mobile: string = null;
    constructor(
        private authGuard: AuthGuard,
        private hr: HttpRequest,
        private router: Router,
        private busService: BusService,
        private formBuilder: FormBuilder,
        )
    {
        authGuard.updateProfile(()=>{
            this.ngOnInit();
        });
    }

    ngOnInit() {
        this.username.setValue(this.authGuard.profile.USERNAME);
        this.password.setValue(this.authGuard.profile.PASSPWD);
        this.address.setValue(this.authGuard.profile.ADDRESS);
        this.avatar = [this.authGuard.profile.AVATAR];
        this.mobile = this.authGuard.profile.TEL;
        this.profile = this.formBuilder.group({
            username: this.username,
            password: this.password,
            address: this.address,
            avatar: new FormControl(this.avatar, [ Validators.required]),
            mobile: new FormControl(this.mobile, [ Validators.required]),
        });
        Object.keys(this.profile.controls).forEach(key => {
            this.profile.get(key).markAsPristine();
        });
    }

    onSave() {
        var that = this;
        var phone = this.pc.save();
        var image = this.ic.images;
        this.profile.controls.mobile.setValue(phone);
        this.profile.controls.avatar.setValue(image[0]);
        this.profile.updateValueAndValidity();
        if (this.profile.invalid) {
            Object.keys(this.profile.controls).forEach(key => {
              this.profile.get(key).markAsDirty();
            });
            this.busService.send(new DialogMessage(that, DialogComponent, '请正确填写个人信息'));
            return;
        }
        this.hr.post('my/profile', this.profile.getRawValue(), (result) => {
            that.authGuard.profile = {
                USERNAME:that.username.value, 
                USERPWD:that.password.value,
                TEL:phone,
                ADDRESS:that.address.value,
                AVATAR:image[0], 
                STATE:'LOGIN'
            };
            that.ngOnInit();
            that.busService.send(new DialogMessage(that, DialogComponent, '修改成功',()=>{
                that.router.navigate(['/home']);
            }));
        })
    }

    onCancel(){
        this.router.navigate(['/home'], {queryParams: {cancel: true}});
    }
    load(d: any = null) {
        
    }
}