import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../app.config";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpRequest {
    constructor(private http: HttpClient, private config: ConfigService){
    }
    post(path: string, data: any, callback: Function) {
        //console.log(path);
        this.http.post(this.config.REST_HOST.URL+path,data).subscribe(result =>{
            var r: any = result;
            if (r && r.code == 'OK') {
                callback(result);
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