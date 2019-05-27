import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'comp-dialog',
    templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit {

    @ViewChild('dlg') dialog: ModalDirective;

    img: string = null;
    info: string = '';
    fnConfirm: Function = null;
    fnDecline: Function = null;

    constructor( private busService: BusService ) { 
        
    }
    ngOnInit() {
        this.busService.receive(this,msg => {
            if(typeof msg.info == 'string'){
                this.info = msg.info;
            }else if(typeof msg.info == 'object'){
                this.info = msg.info.info;
                this.img = msg.info.img;
            }
            
            this.fnDecline = msg.fail;
            this.fnConfirm = msg.pass;
            this.dialog.show();
        })
    }

    confirm(){
        if(this.fnConfirm) this.fnConfirm();
        this.dialog.hide();
    }
    decline(){
        if(this.fnDecline) this.fnDecline();
        this.dialog.hide();
    }
}