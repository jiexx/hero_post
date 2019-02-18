import { ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Component } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { DclComponent } from './dcl.component';


@Component({
    selector: 'wrapper',
    template: `<div #target></div>`
})
export class DclWrapper {
    @ViewChild('target', { read: ViewContainerRef }) target;
    cmpRef: ComponentRef<DclComponent>;
    private isViewInitialized: boolean = false;
    dclMessage: DclWrapperMessage;

    constructor(public resolver: ComponentFactoryResolver,public busService: BusService) {
        busService.receive(this,dclmsg => {
            this.dclMessage = <DclWrapperMessage>dclmsg;
            this.loadComponent();
        })
    }
    removeComponent(){
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    }

    loadComponent() {
        if (!this.isViewInitialized || !this.dclMessage || this.dclMessage.to != this) {
            return;
        }
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
        var factory = this.resolver.resolveComponentFactory(this.dclMessage.component);
        this.cmpRef = this.target.createComponent(factory);
        (<DclComponent>this.cmpRef.instance).load(this.dclMessage.data);
        this.cmpRef.changeDetectorRef.detectChanges();
    }

    ngOnChanges() {
        this.loadComponent();
    }

    ngAfterViewInit() {
        this.isViewInitialized = true;
        this.loadComponent();
    }

    ngOnDestroy() {
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    }
}