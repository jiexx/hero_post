import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService {
    public MEDIA_HOST = {
        ADDR: "showmemoney.cc",
        PORT: "9900",
        //URL: 'http://127.0.0.1:8999/f/'
        URL: 'http://file.showmemoney.cc/'
    };
    public REST_HOST = {
        //URL: "http://localhost:8999/"
        URL: 'http://app.showmemoney.cc/'
    }
    constructor(){
    }
}