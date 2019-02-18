import { ChangeDetectionStrategy, Component, Input, OnInit,Type } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message'
import { AuthMessage } from '../_service/auth.message';
import { AuthGuard } from './auth.guard';
import { DclComponent } from './dcl.component';
import { DclWrapper } from './dcl.wrapper';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

/*
* 移动号段: 134,135,136,137,138,139,147,150,151,152,157,158,159,170,178,182,183,184,187,188 
* 联通号段: 130,131,132,145,155,156,170,171,175,176,185,186 
* 电信号段: 133,149,153,170,173,177,180,181,189 
*/
export class PhoneValidator{
    static limit(control:FormControl){
        if(control.parent && !/13[0-9]|14[5|7|9]|15[0-3|5-9]|17[0-1|3|5-8]|18[0-9]/.test(control.parent.value.join('')))
            return {  phoneNumberInvalid:true };
        return null;
    }
}

@Component({
    selector: 'comp-phone',
    templateUrl: 'phone.component.html'
})
export class PhoneComponent implements OnInit {

    @Input() mobile: string = null;
    @Input() title: string = null;
    
    phone: FormGroup;

    ctrls: FormArray;

    error: any = null;

    constructor(private formBuilder: FormBuilder) {
        
    }

    ngOnInit(){
        let mobile = this.mobile ? this.mobile : new Array(11).fill('');
        this.ctrls = new FormArray([
            new FormControl(mobile[0], [ Validators.required,Validators.pattern(/^1$/) ] ),
            new FormControl(mobile[1], [ Validators.required,Validators.pattern(/^3|4|5|7|8$/) ] ),
            new FormControl(mobile[2], [ Validators.required,PhoneValidator.limit ] )
        ]);
        this.ctrls.at(2).setParent(this.ctrls);
        for(var i = 3; i < 11 ; i ++) {
            this.ctrls.push(new FormControl(mobile[i], [ Validators.required,Validators.pattern(/^[0-9]$/) ] ));
        }
        this.phone = this.formBuilder.group({
            ctrls: this.ctrls
        });
    }

    valid(){
        for(var i = 0 ; i < this.ctrls.length ; i ++ ){
            if(this.ctrls.controls[i].errors) {
                this.error = this.ctrls.controls[i];
                return;
            }
        }
    }

    save(){
        this.valid();
        this.ctrls.updateValueAndValidity();
        if (this.ctrls.invalid) {
            Object.keys(this.ctrls.controls).forEach(key => {
              this.ctrls.get(key).markAsDirty();
            });
        }
        return this.ctrls.value.join('');
    }

    keytab(event, i){
        let element = event.srcElement.nextElementSibling;
        this.valid();
        let val = parseInt(this.ctrls.controls[i].value);
        if(val > 9) {
            this.ctrls.controls[i].setValue(event.key);
        }
        if(element == null) {
            //this.required();
            this.mobile = this.ctrls.value.join('');
            return;
        }else {
            
            element.focus();
        }
    }
}
