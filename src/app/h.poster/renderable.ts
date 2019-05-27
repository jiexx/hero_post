import { fabric } from 'fabric';
import { PatternValidator } from '@angular/forms';


export class RenderableManager {
    renderables = {};
    canvas: fabric.Canvas;
    focusType: string;
    constructor(width: number, height: number) {
        this.canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            selection: true,
            selectionBorderColor: 'blue'
        });
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.on({
            'mouse:move': (e) => {
                if(this.needMoveLine && this.needMoveLine.type == 'line') {
                    var pointer = this.canvas.getPointer(e.e);
                    this.needMoveLine.left = Math.round(pointer.x);
                    this.needMoveLine.top = Math.round(pointer.y);
                    this.needMoveLine.setCoords();
                    this.canvas.renderAll();
                }
            },
            'mouse:down': (e) => {
                if(this.needMoveLine){
                    this.needMoveLine = null;
                }
            },
            'object:moving': (e) => { },
            'object:modified': (e) => { },
            'object:selected': (e) => {
                let selectedObject = e.target;
                selectedObject.hasRotatingPoint = true;
                selectedObject.transparentCorners = false;
                // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';
                if (selectedObject.type !== 'group' && selectedObject) {
                    this.focusType = selectedObject.type;
                    switch (selectedObject.type) {
                        case 'rect':
                        case 'circle':
                        case 'triangle':
                            break;
                        case 'i-text':
                            break;
                        case 'image':
                            console.log('image');
                            break;
                    }
                }
            },
            'selection:cleared': (e) => {
                this.canvas.discardActiveObject();
                this.canvas.renderAll();
            }
        });
    }
    toSVG(){
        return this.canvas.toSVG({ width: '100%', height: '100%'})
            .replace(/<desc.+\/desc>/g, '').replace(/xml:space=/g, 'preserveAspectRatio="xMidYMid meet" xml:space=');
    }
    toJSON(){
        return this.canvas.toJSON(['id','clazz']);
    }
    toPNG(){
        return this.canvas.toDataURL({
            format: 'png',
            quality: 0.8
          });
    }
    load(str:string){
        var json = JSON.parse(str);
        if(json){
            this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas), (o, object) => {
                this.mapping[object.clazz].create(object);
            });
        }
    }
    mapping = {
        'Text':{cn:'文字',create:(o) =>{ var obj = new Text(o); this._addRenderable(obj); return obj}},
        'Image':{cn:'图片',create:(o) =>{ var obj = new Image(o); this._addRenderable(obj); return obj}},
        'Line':{cn:'线条',create:(o) =>{ var obj = new Line(o); this._addRenderable(obj); return obj}},
        'Background':{cn:'背景',create:(o) =>{ var obj = new Background(this.canvas.width,this.canvas.height,o); this.bgID=obj.id;this._addRenderable(obj); return obj}},
    }
    _getReanderableName(renderable: Renderable){
        return this.mapping[renderable.constructor.name].cn;
    }
    getRenderableList(){
        let list = [];
        let count = 1;
        for(var i in this.renderables){
            list.push({name:this._getReanderableName(this.renderables[i])+' '+(count++), id: i});
        }
        return list;
    }
    _getActiveId(){
        return this.canvas.getActiveObject() ? this.canvas.getActiveObject().toObject().id : null
    }
    getActiveRenderable(){
        return this._getActiveId() ? this.renderables[this._getActiveId()] : null;
    }
    getActiveText(){
        let ar = this.getActiveRenderable();
        if( ar && ar.itext && ar.itext.text.length > 0){
            return ar.itext.text;
        }
        return null;
    }
    
    needMoveLine: fabric.Line = null;
    setActiveRenderable(id){
        let renderable = this.renderables[id];
        if(renderable){
            if(renderable.constructor.name == 'Text'){
                this.canvas.setActiveObject(renderable.itext);
            }else if(renderable.constructor.name == 'Image'){
                this.canvas.setActiveObject(renderable.image);
            }else if(renderable.constructor.name == 'Line'){
                this.canvas.setActiveObject(renderable.line);
                this.needMoveLine = renderable.line;
            }
            this.canvas.renderAll();
        }
    }
    addText(){
        let obj = new Text();
        this.renderables[obj.id] = obj;
        this.canvas.add(obj.itext);
        this.canvas.setActiveObject(obj.itext);
    }
    removeSelectedRenderable(id){
        let renderable = this.renderables[id];
        if(renderable){
            this.canvas.remove(renderable.ref);
            delete this.renderables[renderable.id];
        }
    }
    removeActive(){
        let activeObjects = this.canvas.getActiveObjects();
        var i = 0;
        for (i = 0 ; i < activeObjects.length ; i ++) {
            if(this.renderables[activeObjects[i].toObject().id]){
                delete this.renderables[activeObjects[i].toObject().id];
            }
            this.canvas.remove(activeObjects[i]);
            // this.textString = '';
        }
        if(i == activeObjects.length){
            this.canvas.discardActiveObject();
            return true;
        }
        return false;
    }
    setActiveStyle(styleName, value){
        let object = this.canvas.getActiveObject();
        if(object && object.type == 'i-text'){
            object.set(styleName, value);
        }else if(object &&　object.type == 'image') {
            if(styleName == 'fill'){
                if(object.paths>-1){
                    object.paths.forEach(function(path) {path.fill = value});
                    //object.set(styleName, value);
                }else {
                    let r = this.renderables[object.toObject().id] as Image;
                    if(r) {
                        r.setColor(value);
                    }
                }
            }else {
                object.set(styleName, value);
            }
        }else if(object && object.type == 'line'){
            if(styleName == 'fill'){
                object.set('fill', value);
                object.stroke = value;
            }else if(styleName == 'fontWeight') {
                object.strokeWidth = Math.floor(value/50)+1;
                object.setCoords();
            }
        }
        //object.setCoords();
        this.canvas.renderAll();
    }
    _getActiveProp(name) {
        var object = this.canvas.getActiveObject();
        if (!object) return '';
        if (object && object.type == 'line') {
            return object.fill;
        }
    
        return object[name] || '';
    }
    getActiveStyle(){
        return {
            fill: this._getActiveProp('fill'),
            opacity: this._getActiveProp('opacity'),

            textAlign: this._getActiveProp('textAlign'),
            fontFamily: this._getActiveProp('fontFamily'),
            
            fontSize: this._getActiveProp('fontSize'),
            fontWeight: this._getActiveProp('fontWeight'),
            fontStyle: this._getActiveProp('fontStyle'),
            
        }
    }
    vTypeset(){
        this.exec('vTypeset');
    }
    hTypeset(){
        this.exec('hTypeset');
    }
    alignLeft(){
        this.exec('translate', 10, 0);
    }
    alignRight(){
        this.exec('moveToRight', this.canvas.width - 10, 0);
    }
    alignHCenter(){
        this.exec('moveToCenterX', this.canvas.width, 0);
    }
    alignVCenter(){
        this.exec('moveToCenterX', this.canvas.height, 0);
    }
    stretch() {
        this.exec('stretch', this.canvas.width, this.canvas.height);
    }
    shrink() {
        this.exec('shrink');
    }
    exec(command: string, ...args: any[]){
        var select = this.getActiveRenderable();
        if(select && typeof select[command] == 'function'){
            select[command].apply(select,args);
            select.onCommandComplete();
            this.canvas.renderAll();
        }
    }
    _addRenderable(r: Renderable, needRender: boolean = true, needFocus: boolean = true){
        this.renderables[r.id] = r;
        this.canvas.add(r.ref);
        if(needFocus)this.canvas.setActiveObject(r.ref);
        if(needRender)this.canvas.renderAll();
    }
    forLayout = {size:64, numPerLine: 0};
    beginLayout(size:number){
        this.forLayout = {size:size, numPerLine:Math.floor((this.canvas.width+20)/size)};
    }

    nextLayout(index:number){
        return{y:Math.floor((index / this.forLayout.numPerLine))*this.forLayout.size + 10,
                x:(index % this.forLayout.numPerLine)*this.forLayout.size + 10}
    }
    addImage(src:string, top: number = null, left: number = null, size: number = null){
        fabric.Image.fromURL(src, (image) => {
            let img = new Image(image);
            img.scaleToWidth(size);
            img.translate(left?left:Math.floor(Math.random() * 300) + 1,top?top:10);
            this._addRenderable(img, true, false);
        });
    }
    bgID: number = -1;
    _getBackground() : Background{
        return this.renderables[this.bgID];
    }
    setBackgroundImage(src:string){
        fabric.Image.fromURL(src, (image) => {
            if(!this._getBackground()){
                let back = new Background(this.canvas.width, this.canvas.height);
                back.setImage(image);
                this._addRenderable(back, true, false);
                //this.canvas.discardActiveObject();
                back.ref.moveTo(-2);
                this.bgID = back.id;
            }else{
                this._getBackground().setImage(image);
                this.canvas.renderAll();
            }
        });
    }
    setBackgourndImageColor(value:string) {
        if(this._getBackground()){
            this._getBackground().setImageColor(value);
            this.canvas.renderAll();
        }
    }
    setBackgourndImageSize(value:number) {
        if(this._getBackground()){
            this._getBackground().setImageSize(value);
            this.canvas.renderAll();
        }
    }
    getBackgourndImageSize() {
        if(this._getBackground()){
            return this._getBackground().getImageSize();
        }
        return 0;
    }
    setBackgourndColor(value:string) {
        this.canvas.setBackgroundColor(value, this.canvas.renderAll.bind(this.canvas));
        this.canvas.renderAll();
    }
    setBackgourndImageTransparancy(value:number) {
        if(this._getBackground()){
            this._getBackground().img.setTransparancy(value);
            this.canvas.renderAll();
        }
    }
    top() {
        var object = this.canvas.getActiveObject();
        if(object ) {
            object.bringToFront();
        }
    }
    addLine(){
        let obj = new Line();
        this.renderables[obj.id] = obj;
        this.canvas.add(obj.line);
        this.canvas.setActiveObject(obj.line);
    }
}

abstract class  Renderable {
    id: number;
    ref: fabric.Object;
    extend(obj, id, clazz) {
        obj.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: id,
                    clazz: clazz
                });
            };
        })(obj.toObject);
    }
    randomId() {
        return Math.floor(Math.random() * 999999) + 1;
    }
    setId(obj) {
        this.id = this.randomId();
        this.extend(obj, this.id, this.constructor.name);
    }
    _matrix(){
        return this.ref.transformMatrix ? this.ref.transformMatrix : [1,0,0,1,0,0];
    }
    scale(delta: number){
        //var t = this._matrix();
        //this.ref.transformMatrix = fabric.util.multiplyTransformMatrices(t, [delta,0,0,delta,0,0]);
        this.ref.scaleX = delta;
        this.ref.scaleY = delta;
        this.ref.setCoords();
    }
    getScaleX(){
        return this.ref.scaleX;
    }
    scaleToWidth(to: number){
        var delta = to / this.ref.width;
        this.scale(delta);
    }
    scaleToHeight(to: number){
        var delta = to / this.ref.height;
        this.scale(delta);
    }
    setWidth(to: number){
        this.ref.width = to;
        this.ref.setCoords();
    }
    setHeight(to: number){
        this.ref.height = to;
        this.ref.setCoords();
    }
    zoomToWidth(to:number){
        var t = to / this.ref.width;
        this.ref.width = to;
        this.ref.height = t * this.ref.height;
        this.ref.setCoords();
    }
    zoomToHeight(to:number){
        var t = to / this.ref.height;
        this.ref.width = t * this.ref.width;
        this.ref.height = to;
        this.ref.setCoords();

    }
    scaleX(delta: number){
        //var t = this._matrix();
        //this.ref.transformMatrix = fabric.util.multiplyTransformMatrices(t, [delta,0,0,1,0,0]);
        this.ref.scaleX *= delta;
        this.ref.setCoords();
    }
    scaleY(delta: number){
        //var t = this._matrix();
        //this.ref.transformMatrix = fabric.util.multiplyTransformMatrices(t, [1,0,0,delta,0,0]);
        this.ref.scaleY *= delta;
        this.ref.setCoords();
    }
    translate(x: number, y: number){
        //var t = this._matrix();
        //this.ref.transformMatrix = fabric.util.multiplyTransformMatrices(t, [1,0,0,1,x,y]);
        this.ref.top = y;
        this.ref.left = x;
        this.ref.setCoords();
    }
    rotate(delta: number){
        var t = this._matrix();
        this.ref.transformMatrix = fabric.util.multiplyTransformMatrices(t, [1, delta, -delta, 1, 0, 0]);
    }
    stretch(w: number, h: number, aspect: boolean = false){
        if(aspect){
            this.ref.width > this.ref.height ? this.scaleToWidth(w) : this.scaleToHeight(h)
        }else {
            this.scaleX(w/this.ref.getScaledWidth());
            this.scaleY(h/this.ref.getScaledHeight());
        }
    }
    shrink(){
        this.scale(1.0);
    }
    moveToCenterX(w:number){
        var c = (w - this.ref.width) >> 1;
        this.translate(c, 0);
    }
    moveToCenterY(h:number){
        var c = (h - this.ref.height) >> 1;
        this.translate(0, c);
    }
    moveToRight(w:number){
        var r = (w - this.ref.width);
        this.translate(r, 0);
    }
    moveToBottom(h:number){
        var b = (h - this.ref.height);
        this.translate(0, b);
    }

    onCommandComplete(){
    }
}

class Text extends Renderable {
    static textInit: string = '请添加文字';
    constructor(itext: fabric.IText = null) {
        super();
        this.itext = itext ? itext: new fabric.IText(Text.textInit, {
            left: Math.floor(Math.random() * 100) + 1,
            top: 10,
            fontFamily: 'sans-serif',
            angle: 0,
            fill: '#dddddd',
            scaleX: 1.0,
            scaleY: 1.0,
            lockUniScaling: true,
            fontWeight: '',
            hasRotatingPoint: true
        });
        this.setId(this.itext);
        this.itext.onDeselect = (e) => {
            let txt = this.itext.text;
            if (txt == '') {
                this.itext.insertChars(Text.textInit);
            }
            this.itext.exitEditing();
        }
        this.itext.onSelect = (e) => {
            let txt = this.itext.text;
            if (txt == Text.textInit) {
                this.itext.removeChars(0, txt.length);
                this.itext.enterEditing();
                //console.log(this.itext.fill);
                this.itext.fill = '#000000';
            }
            
        }
    }
    get itext(): fabric.IText{
        return this.ref;
    }
    set itext(itext: fabric.IText){
        this.ref = itext;
    }
    onCommandComplete(){
        this.itext.exitEditing();
    }
    vTypeset(){
        if(this.itext.text.length == 0) return;
        let txt = this.itext.text.split ? this.itext.text.split('') : this.itext.text;
        let c = txt.filter((k)=>{return k != '\n'});
        this.itext.text = c.join('\n');
    }
    hTypeset(){
        if(this.itext.text.length == 0) return;
        let txt = this.itext.text.split ? this.itext.text.split('') : this.itext.text;
        let c = txt.filter((k)=>{return k != '\n'});
        this.itext.text = c.join('');
    }
}
class Image extends Renderable {
    //colorFilter: fabric.BlendColor;
    constructor(image: fabric.Image) {
        super();
        this.image = image;
        image.set({
            left: image.left ? image.left : 0,
            top: image.top ? image.top : 0,
            angle: image.angle ? image.angle : 0,
            //padding: 0,
            //cornersize: 10,
            hasRotatingPoint: true,
            //peloas: 12
            // width: 150,
            // height: 150
        });
        this.setId(this.image);
    }
    get image(): fabric.Image{
        return this.ref;
    }
    set image(image: fabric.Image){
        this.ref = image;
    }
    setColor(value:string){
        if(!this.image.filter){
            var colorFilter: fabric.BlendColor = new fabric.Image.filters.BlendColor({
                color: value,
                alpha: 1.0,
                mode: 'overlay'
            });
            this.image.filters[0] = colorFilter;
        }
        this.image.filters[0].color = value;
        this.image.applyFilters();
    }
    getColor(){
        return this.image.filter? this.image.filters[0].color: '#0000ff';
    }
    setTransparancy(value:number){
        if(!this.image.filter){
            var colorFilter: fabric.BlendColor = new fabric.Image.filters.BlendColor({
                color: '#ffffff',
                alpha: 1.0,
                mode: 'overlay'
            });
            this.image.filters[0] = colorFilter;
        }
        this.image.filters[0].alpha = value;
        this.image.applyFilters();
    }
    getTransparancy(){
        this.image.filters[0].alpha;
    }
    renderElement(){
        var patternSourceCanvas = new fabric.StaticCanvas();
        patternSourceCanvas.add(this.ref);
        patternSourceCanvas.setDimensions({
            width: this.ref.width,
            height: this.ref.height
        });
        patternSourceCanvas.renderAll();
        return patternSourceCanvas.getElement();
    }
}
class Line extends Renderable {
    constructor(line: fabric.Line = null) {
        super();
        this.line = line ? line : new fabric.Line([50, 100, 50, 200], {
            left: Math.floor(Math.random() * 100) + 1,
            top: 10,
            stroke: '#000000'
        });
        this.setId(this.line);
    }
    get line(): fabric.Line{
        return this.ref;
    }
    set line(line: fabric.Line){
        this.ref = line;
    }
    stretch(){
        this.scaleY(1.2);
    }
    shrink(){
        this.scaleY(0.8);
    }
}
class Pattern extends fabric.Pattern{
    constructor(opt){
        super(opt);
        var that = this as fabric.Pattern;
        that.patternTransform =[ 1, 0, 0, 1, 0, 0 ];
    }
    toSVG(object):string {
        var that = this as fabric.Pattern;
        var patternSource = typeof that.source === 'function' ? that.source() : that.source,
            patternWidth = (that.patternTransform[0] * patternSource.width) / object.width,
            patternHeight = (that.patternTransform[3] *patternSource.height) /object.height ,
            patternOffsetX = that.offsetX / object.width,
            patternOffsetY = that.offsetY / object.height,
            patternImgSrc = '';
        if (that.repeat === 'repeat-x' || that.repeat === 'no-repeat') {
          patternHeight = 1;
          if (patternOffsetY) {
            patternHeight += Math.abs(patternOffsetY);
          }
        }
        if (that.repeat === 'repeat-y' || that.repeat === 'no-repeat') {
          patternWidth = 1;
          if (patternOffsetX) {
            patternWidth += Math.abs(patternOffsetX);
          }
  
        }
        if (patternSource.src) {
          patternImgSrc = patternSource.src;
        }
        else if (patternSource.toDataURL) {
          patternImgSrc = patternSource.toDataURL();
        }

        return '<pattern id="SVGID_' + that.id +
                      '" x="' + patternOffsetX +
                      '" y="' + patternOffsetY +
                      '" width="' + patternWidth +
                      '" height="' + patternHeight + '">\n' +
                 '<image x="0" y="0"' +
                        ' width="' + patternSource.width * that.patternTransform[0] +
                        '" height="' + patternSource.height * that.patternTransform[3] +
                        '" xlink:href="' + patternImgSrc +
                 '"></image>\n' +
               '</pattern>\n';
      }
      toLive(ctx) {
        var that = this as fabric.Pattern;
        var source = typeof that.source === 'function' ? that.source() : that.source;
  
        // if the image failed to load, return, and allow rest to continue loading
        if (!source) {
          return '';
        }
  
        // if an image
        if (typeof source.src !== 'undefined') {
          if (!source.complete) {
            return '';
          }
          if (source.naturalWidth === 0 || source.naturalHeight === 0) {
            return '';
          }
        }
        return ctx.createPattern(source, that.repeat);
      }
}
//svg backgournd better than 1024. if small, after ctx transform, the image will be blurry 
class Background extends Renderable {
    constructor(w: number, h: number, bg: fabric.Rect = null) {
        super();
        this.ref = bg ? bg : new fabric.Rect({
            width: w,
            height: h,
            left: 0,
            top: 0,
        });

        if(bg && bg.fill && bg.fill.source){
            this._reloadPattern(bg.fill.source);
        }
        //this.ref.fill = null;
        this.ref.selectable = false;
        this.ref.hoverCursor = false;
        this.ref.moveCursor = false
        this.setId(this.ref);
    }
    _createPattern(){
        var pattern = new Pattern({
            source: this.img.ref.getElement(),
            repeat: 'repeat'
        }) as fabric.Pattern;
        pattern.patternTransform = this.ref.fill? this.ref.fill.patternTransform: [ 0.1, 0, 0, 0.1, 0, 0 ];
        this.ref.set('fill',pattern);
    }
    _reloadPattern(source){
        if(source && source.currentSrc){
            fabric.Image.fromURL(source.currentSrc, (img)=>{
                this.setImage(img);
            })
        }
    }
    img: Image;
    setImage(img:fabric.Image){
        this.img = new Image(img);
        this._createPattern();
    }
    getImageSize(){
        if(this.img){
            return this.ref.fill.patternTransform[0];
        }
        return 1;
    }
    setImageSize( scale: number ){
        if(this.img){
            //this.img.scale(scale);
            //this.setImage(this.img);
            this._createPattern();
            this.ref.fill.patternTransform =  [ scale, 0, 0, scale, 0, 0 ]
        }
    }
    getImageColor(){
        if(this.img){
            return this.img.getColor();
        }
        return '#0000ff';
    }
    setImageColor(value: string){
        if(this.img){
            this.img.setColor(value);
            this._createPattern();
        }
    }
    getImageTransparency(){
        if(this.img){
            return this.img.getTransparancy();
        }
        return '#0000ff';
    }
    setImageTransparency(value: number){
        if(this.img){
            this.img.setTransparancy(value);
            this._createPattern();
        }
    }

}