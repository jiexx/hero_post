import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpRequest } from './http.request';
import { BusService } from '../_service/bus.service';
import { AuthMessage } from '../_service/auth.message';
import { HomeComponent } from '../home/home.component';
import { DclWrapperMessage } from '../_service/dclwrapper.message';

class User {
    set token(t:string){
        localStorage.setItem('token',t);
    }
    get token(){
        return localStorage.getItem('token');
    }
    set profile(t:any){
        localStorage.setItem('profile',JSON.stringify(t));
    }
    get profile(): any{
        let u = JSON.parse(localStorage.getItem('profile'));
        if(!u) u = {};
        u.AVATAR = u.AVATAR ? u.AVATAR : 'assets/img/avatar.svg';
        u.TEL = u.TEL? u.TEL : '';
        return u;
    }
    constructor(protected hr: HttpRequest){
        
    }
    sign(callback: Function = null){
        if(!this.token){
            this.hr.post('auth/sign',{}, result => {
                this.token = result.data;
                if(callback)callback();
            });
        }
    }
    updateProfile(callback: Function = null){
        if(!this.profile || (this.profile.STATE != 'LOGOUT' && this.profile.STATE != 'LOGIN')){
            this.hr.post('auth/user',{}, result => {
                this.profile = result.data;
                if(callback)callback();
            });
        }
    }
}

@Injectable()
export class AuthGuard extends User implements CanActivate  {
    

    constructor(private router: Router, protected hr: HttpRequest, private busService: BusService) { 
        super(hr);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //console.log('AuthGuard.getToken()',this.token);
        if(route.queryParams['a']){
            this.token = route.queryParams['a'];
            this.updateProfile(() =>{
                this.router.navigate(['/home']);
            });
        }else if (route.queryParams['cancel']){
            return true;
        }else if (!this.profile || (this.profile.STATE != 'LOGOUT' && this.profile.STATE != 'LOGIN')){
            //this.router.navigate(['/register']);
        }
        return true;
    }

    loadComponentAfterToken(msg: DclWrapperMessage) {
        if(this.token){
            this.busService.send(msg);
        }else {
            this.sign(() =>{
                //this.router.navigate(['/register']);
                this.busService.send(msg);
            });
        }
    }

}