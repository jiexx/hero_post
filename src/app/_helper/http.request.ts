import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../app.config";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpRequest {
    constructor(private http: HttpClient, private config: ConfigService){
    }
    mediaUrlFromPatternId(id:string){
        return this.config.MEDIA_HOST.URL+'lnk/h'+id;
    }
    mediaUrlFromResourceId(id:string){
        return this.config.MEDIA_HOST.URL+'lnk/i'+id;
    }
    mediaUrlFromFoodId(id:string){
        return this.config.MEDIA_HOST.URL+'lnk/m'+id;
    }
    mediaUrlFromLifeId(id:string){
        return this.config.MEDIA_HOST.URL+'lnk/n'+id;
    }
    mediaPathFromPatternUrl(url:string){
        return url.replace('/lnk/','/b64/').replace(this.config.MEDIA_HOST.URL,'');
    }
    mediaPathFromCaliId(id:string){
        return 'b64/g'+id;
    }
    mediaPathFromCharId(id:string){
        return 'b64/f'+id;
    }
    mediaPathFromPosterId(pid:string){
        return this.config.MEDIA_HOST.URL+'lnk/'+pid+'\n';
    }
    post(path: string, data: any, callback: Function, err: Function = null) {
        //console.log(path);
        this.http.post(this.config.REST_HOST.URL+path,data).subscribe(result =>{
            var r: any = result;
            if (r && r.code == 'OK') {
                callback(result);
            }
            if(err && r.code == 'ERR'){
                err(r);
            }
        })
    }
    upload(data: any, callback: Function) {
        this.http.post(this.config.MEDIA_HOST.URL+'upload',{file:data}).subscribe(result =>{
            var r: any = result;
            if (r && r.code == 'OK') {
                callback(result);
            }
        })
    }
}