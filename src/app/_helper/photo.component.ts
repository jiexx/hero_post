import { Component, ChangeDetectorRef, Input, OnInit, Sanitizer, Output } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { ConfigService } from '../app.config';
import { HttpRequest } from './http.request';
import { BusService } from '../_service/bus.service';
import { DialogMessage } from '../_service/dialog.message';
import { DialogComponent } from './dialog.component';

class Rect {
    r: number;
    constructor(public halfW: number, public halfH: number){
        this.r = halfH / halfW;
    }
    porject(dst: Rect){
        var halfW, halfH;
        if(this.r > dst.r) {
            halfH = this.halfW * dst.r
            return {x:0, y:this.halfH-halfH, w:this.halfW<<1, h:halfH<<1};
        }else {
            halfW = this.halfH / dst.r;
            return {x:this.halfW-halfW, y:0, w:halfW<<1, h:this.halfH<<1};
        }
    }
}

class Project {
    constructor(private r: Rect){
    }
    static P(imgWidth, imgHeight, canvWidth, canvHeight) {
        var src = new Rect(imgWidth >> 1, imgHeight >> 1);
        var a = src.porject(new Rect(canvWidth >> 1, canvHeight >> 1));
        return {
            srcX: a.x, srcY: a.y,  srcW: a.w,  srcH: a.h, 
            dstX: 0,   dstY: 0,    dstW: canvWidth,  dstH: canvHeight
        };
    }

}

class PageImages {
    windowStart: number;
    windowEnd: number;
    size: number;
    max: number = 500;
    constructor(pageSize: number) {
        this.size = pageSize;
        this.windowStart = 0;
        this.windowEnd = pageSize-1;
    }
    changeOnImages(images: any[]){
        this.max = images.length;
    }
    next() {
        if(this.windowEnd < this.max){
            this.windowStart ++;
            this.windowEnd ++;
        }
    }
    prev() {
        if(this.windowStart > 0) {
            this.windowStart --;
            this.windowEnd --;
        }
    }
}


@Component({
    selector: 'comp-photo',
    templateUrl: './photo.component.html'
})
export class PhotoComponent implements OnInit {
    @Input() zoomSize: any = {w:1, h:1};  // style show width
    @Input() max: number = 1; // contain number of picture
    @Input() pageSize: number = 1; // contain number of picture

    
    @Input() imageClass: number = 0;

    @Input() onSelect: Function = null;

    private _images: any[] = [];
    @Input() set images(values: any[]) {
        var res = [];
        for(var i = 0 ; i < values.length ; i ++) {
            if(values[i] && values[i].changingThisBreaksApplicationSecurity && values[i].changingThisBreaksApplicationSecurity.indexOf('image/')<0){
                res.push(this.sanitizer.bypassSecurityTrustResourceUrl(values[i]));
            }else{
                res.push(values[i]);
                
            }
        }
        this._images = res;
        if(this.pageImages)this.pageImages.changeOnImages(this._images);
    }
    get images(): any[] {
        return this._images;
    }

    pageImages: PageImages;
    fontSize: number;
    constructor(
        private ref: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private busService: BusService
     ) { 
         
         
    }

    ngOnInit(){
        this.fontSize = Math.ceil(this.zoomSize.h*0.8);
        this.pageImages = new PageImages(this.pageSize);
    }


    onChange(files){
        if (!files[0] || !files[0].type) return;
        for(var i in files) {
          if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
            if(files[i].size > 256000) {
                this.busService.send(new DialogMessage(this, DialogComponent, '文件不能超过256K'));
                continue;
            }
            var reader = new FileReader();
            reader.onloadend = (evt:any) => {
                this.save(evt.target.result);
            }
            reader.readAsDataURL(files[i]);
          }
        }
    }
    @Output() imagesChange:EventEmitter<any> = new EventEmitter();
    save(data:string){
        this._images.unshift(data);
        this.imagesChange.emit(this._images);
        this.ref.detectChanges();
        this.pageImages.changeOnImages(this._images);
    }
    onClick(index:number){
        if(this.onSelect && this.images[index+this.pageImages.windowStart]) this.onSelect(this.images[index+this.pageImages.windowStart]);
    }

}