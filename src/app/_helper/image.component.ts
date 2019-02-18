import { Component, ChangeDetectorRef, Input, OnInit, Sanitizer, Output } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { ConfigService } from '../app.config';
import { HttpRequest } from './http.request';

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


@Component({
    selector: 'comp-image',
    templateUrl: './image.component.html'
})
export class ImageComponent {
    @Input() zoomSize: any = {w:1, h:1};  // style show width
    @Input() max: number = 1; // contain number of picture

    @Input() imageClass: number = 0;
    @Input() onUpload: Function = null; 

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
    }
    get images(): any[] {
        return this._images;
    }
    constructor(
        private hr: HttpRequest,
        private ref: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private config: ConfigService
     ) { 
    }


    onChange(files, canvas: HTMLCanvasElement){
        if (!files[0] || !files[0].type) return;
        var that = this;
        for(var i in files) {
          if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
            var reader = new FileReader();
            reader.onloadend = function (evt:any) {
                var img = new Image();
                img.src = evt.target.result;
                var ctx = canvas.getContext("2d");
                ctx.fillStyle="#ffffff";
                canvas.width = that.zoomSize.w;
                canvas.height = that.zoomSize.h;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                img.onload = function() {
                    var t = Project.P(img.width, img.height, canvas.width, canvas.height);
                    ctx.drawImage(img, t.srcX, t.srcY, t.srcW, t.srcH, t.dstX, t.dstY, t.dstW, t.dstH );
                    that.save(canvas.toDataURL("image/jpeg"));
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            reader.readAsDataURL(files[i]);
          }
        }
    }
    @Output() imagesChange:EventEmitter<any> = new EventEmitter();
    save(data:string){
        this._images.push(data);
        this.imagesChange.emit(this._images);
        this.ref.detectChanges();
        this.hr.upload(data, (result) => {
            this._images.pop();
            this._images.push(this.config.MEDIA_HOST.URL+result.data);
            if(this.onUpload) this.onUpload(result.data);
        });
    }
    onClick(index:number){
        this._images.splice(index,1);
    }
}