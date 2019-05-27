import { ChangeDetectionStrategy, Component, Input, OnInit,Type } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message'
import { AuthMessage } from '../_service/auth.message';
import { AuthGuard } from '../_helper/auth.guard';
import { DclComponent } from './dcl.component';
import { DclWrapper } from './dcl.wrapper';
import { LoginComponent } from '../login/login.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface OnMenuClick {

    onClick(menu:Menu);
}

class OnMenuDefaultClick implements OnMenuClick{
    onClick(menu:Menu){
        if(menu.target){
            menu.factory.auth.loadComponentAfterLogin(new DclWrapperMessage(menu.factory.wrapper, menu.factory.wrapper, menu.target,null), LoginComponent);
        }
    }
}

export class MenuFactory {
    constructor(public auth: AuthGuard,public wrapper: DclWrapper, public menus: Menu[] = []){
        return this;
    }
    createDropMenu(target: Type<DclComponent>, text: string){
        let dm = new DropMenu(text);
        dm.factory = this;
        this.menus.push(dm);
        return dm;
    }
    createMenu(target: Type<DclComponent>, text:string = null, icon: SafeResourceUrl = null, clicker: OnMenuClick = new OnMenuDefaultClick()){
        let menu = new Menu(target, text, icon,clicker);
        menu.factory = this;
        this.menus.push(menu);
        return menu;
    }
}
export class Menu{
    private sanitizer: DomSanitizer;
    factory: MenuFactory;
    constructor(public target: Type<DclComponent>, protected text: string = null, protected icon: SafeResourceUrl = null, protected clicker: OnMenuClick = new OnMenuDefaultClick()){
        return this;
    }
    onClick(){
        this.clicker.onClick(this);
    }
    
}
class DropMenu extends Menu{
    constructor(protected text: string, private child: Menu[] = []){
        super(null, text);
        return this;
    }
    createMenu(target: Type<DclComponent>, text:string, icon: any){
        let menu = new Menu(target, text, (icon));
        menu.factory = this.factory;
        this.child.push(menu);
        return menu;
    }
}
@Component({
    selector: 'comp-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent  {
    @Input() menuFactory: MenuFactory = null;

    constructor(
        private busService: BusService,
        private router: Router,
        private auth: AuthGuard
    ) { }
}
