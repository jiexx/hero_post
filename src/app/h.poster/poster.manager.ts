export class PosterManager {
    id: string;
    num: string[];
    show: boolean[];
    posters: string[] = [];
    constructor(id: string, num: string[] = ['00','01']){ //posterid_no1.svg posterid_no1.json, posterid_no2.svg posterid_no2.json
        this.id = id;
        this.num = num;
        // var i = 2;
        // while(this.toJSON(i)){
        //     this.num.push(((100+i)+'').substr(1));
        //     i ++;
        // }
        
        this.show = new Array(num.length).fill(false);
        this.posters = new Array(num.length).fill('');
        for(var i = 0; i < num.length; i ++){
            this.posters[i] = this.getPosterSVG(i);
        }
    }
    getUploadData(){
        let svg = [], json = [];
        for(var i = 0 ; i < this.num.length ; i ++){
            var s = this.toSVG(i);
            var j = this.toJSON(i);
            svg.push(s);
            json.push(j);
        }
        return {posterid:this.id, posternum:this.num.length, data:{svg:svg, json:json, png:this.toPNG()}};
    }
    fromDownData(data: any){
        if(data.svg &&　data.json && data.svg.length == data.json.length){
            for(var i = 0 ; i < this.num.length ; i ++){
                PosterManager.savePosterSVG(this.getPosterNum(i), data.svg[i]);
                PosterManager.savePosterJSON(this.getPosterNum(i), data.json[i]);
            }
        }
        PosterManager.savePosterPNG(this.getPosterNum(0), data.png);
    }
    getPosters(){
        for(var i = 0; i < this.num.length; i ++){
            this.posters[i] = this.getPosterSVG(i);
        }
        return this.posters;
    }
    getPostersNum(){
        return this.num.length;
    }
    toggle(index: number){
        this.show[index] = !this.show[index];
    }
    visible(index: number){
        return this.show[index];
    }
    append(){
        this.num.push(((100+this.num.length)+'').substr(1));
        var posterNum = this.getPosterNum(this.num.length-1);
        PosterManager.savePosterSVG(posterNum, this.toSVG(1));
        PosterManager.savePosterJSON(posterNum, this.toJSON(1));
    }
    pngRemoteId(){
        return this.id+'_'+(100+this.num.length).toString(10).substr(1)+'_'+this.num.length+'.png';
    }
    toPNG(){
        var no = this.id+'_'+this.num[0]+'_2';
        if(localStorage.getItem(no)){
            return localStorage.getItem(no);
        }
        return null
    }
    toSVG(index: number){
        var no = this.svgName(index);//this.id+'_'+this.num[index]+'_0';
        if(localStorage.getItem(no)){
            return localStorage.getItem(no);
        }
        return null
    }
    toJSON(index: number){
        var no = this.jsonName(index);//this.id+'_'+this.num[index]+'_1';
        if(localStorage.getItem(no)){
            return localStorage.getItem(no);
        }
        return null;
    }
    getPosterSVG(index: number){
        var no = this.toSVG(index);
        if(!no){
            return 'assets/img/thumb'+this.num[index]+'.jpg';
        }
        return no;
    }
    getPosterNum(index: number){
        return this.id+'_'+this.num[index];
    }
    svgName(index: number){
        return this.getPosterNum(index) + '_0'
    }
    jsonName(index: number){
        return this.getPosterNum(index) + '_1'
    }
    svgRemoteName(index: number){
        return this.getPosterNum(index) + '_' + this.num.length + '.svg';
    }
    jsonRemoteName(index: number){
        return this.getPosterNum(index) + '_' + this.num.length + '.json';
    }
    pngRemoteName(index: number){
        return this.getPosterNum(index) + '_0'
    }
    static from(id: string, num: number){ //2026_01_2.png
        var n = new Array(num).fill(0).map((v,i)=>{return ((100+i)+'').substr(1)});
        return new PosterManager(id, n);
    }
    static _clear(posterNum: string){
        let id = PosterManager.getPosterID(posterNum);
        let re = new RegExp(id+'_[0-9]{2}_[0-9]{1}');
        for(var i=0; i<localStorage.length;i++){
            if(!re.test(localStorage.key(i)) && localStorage.key(i) != 'token'){
                localStorage.removeItem(localStorage.key(i));
            }
        }
    }
    static getPosterID(posterNum: string){
        return posterNum.split('_')[0];
    }
    static savePosterSVG(posterNum: string, svg: string){
        try{
            PosterManager._clear(posterNum);
            localStorage.setItem(posterNum+'_0', svg);
        }catch(e){

        }
    }
    static savePosterJSON(posterNum: string, json: string){
        try{
            PosterManager._clear(posterNum);
            localStorage.setItem(posterNum+'_1', json);
        }catch(e){

        }
    }
    static savePosterPNG(posterNum: string, json: string){
        try{
            PosterManager._clear(posterNum);
            localStorage.setItem(posterNum+'_2', json);
        }catch(e){

        }
    }
    static getPosterJSON(posterNum: string){
        return localStorage.getItem(posterNum+'_1');
    }
    upload(){

    }
}