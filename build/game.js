/**
 * Created by amitkum on 18/7/15.
 */
function Grid(){
    this.grid=[];
}
Grid.prototype.addTile= function (tile,elementId) {
    this.grid.push({tile:tile,id:elementId});
    //console.log(this.grid);
};
Grid.prototype.findTileById= function (elementId) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        if(tilet.id==elementId){
            tile=tilet.tile;
        }
    });
    return tile;
};
Grid.prototype.findTileByPosition= function (position) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        tilet=tilet.tile;
        if(tilet.x==position.x&&tilet.y==position.y){
            tile=tilet;
        }
    });
    if(tile==null) console.log('nothing find');
    return tile;
};
Grid.prototype.getSplitElements=function(tile){
    //var splitValue=parseInt(Math.floor(tile.value/2));
    //console.log(this.directions(tile));
    return this.directions(tile);
};
Grid.prototype.directions= function (tile) {
    var corner=this.isCorner(tile);//corner has directions in which tiles has to be fired
    if(corner){
        return this.makeChildTiles(tile,corner);
    }
    return false;
};
Grid.prototype.makeChildTiles= function (tile,directions) {
    var tiles=[];
    var initPosition={x:tile.x,y:tile.y};
    var childValue=this.splitValue(tile.value,2);
    directions.forEach(function (direction) {
        var tile=new Tile(initPosition,childValue);
        tile.firedFrom=initPosition;
        tile.fireDirection=direction;
        tiles.push(tile);
    });
    return tiles;
};
Grid.prototype.splitValue= function (initialValue, parts) {
    return parseInt(Math.floor(initialValue/parts));
};
Grid.prototype.isCorner= function (tile) {
    if(tile.x==0&&tile.y==0){
        return [directions.right,directions.down];
    }
    if(tile.x==3&&tile.y==0){
        return [directions.left,directions.down];
    }
    if(tile.x==0&&tile.y==3){
        return [directions.right,directions.up];
    }
    if(tile.x==3&&tile.y==3){
        return [directions.left,directions.up];
    }
    return false;
};;/**
 * Created by amitkum on 18/7/15.
 */
function InputManager(){
    this.events={};
    if (window.navigator.msPointerEnabled) {
        //Internet Explorer 10 style
        this.eventTouchstart    = "MSPointerDown";
        this.eventTouchmove     = "MSPointerMove";
        this.eventTouchend      = "MSPointerUp";
    } else {
        this.eventTouchstart    = "touchstart";
        this.eventTouchmove     = "touchmove";
        this.eventTouchend      = "touchend";
    }
    this.listen();
}
InputManager.prototype.restart=function(event){
    event.stopPropagation();
    event.preventDefault();
    this.emit('restart');
};
InputManager.prototype.on= function (event,callback) {
    if(!this.events[event]){
        this.events[event]=[];
    }
    this.events[event].push(callback);
};
InputManager.prototype.emit= function (event,data) {
    console.log(event,data,'emited');
    var callbacks=this.events[event];
    if(callbacks){
        callbacks.forEach(function (callback) {
            callback(data);
        })
    }
};
InputManager.prototype.listen= function () {
    var self=this;
    var tile=document.querySelector('.tile');
    this.bindButtonPress('.newGame',this.restart);
};
InputManager.prototype.bindButtonPress= function (selector,fn) {
    var button = document.querySelector(selector);
    //console.log(selector+' binded with \n'+fn);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
};;/**
 * Created by amitkum on 18/7/15.
 */
function HTMLActuator(){
    this.gameContainer=document.querySelector('.gameContainer');
    this.gameContainerInner=document.querySelector('.gameContainerInner');
    this.tileContainer=document.querySelector('.tileContainer');
}
HTMLActuator.prototype.fireTile= function (tile,parent) {
    console.log('fired',tile);
    var init={};
    init.x=tile.x;
    init.y=tile.y;
    var nextPosition=this.findNextPosition(init,tile.fireDirection,parent);
    console.log(nextPosition);
};
HTMLActuator.prototype.findNextPosition= function (position, dir,parent) {
    var toMerge=null;
    var i=0;
    if(directions.right==dir){
        for(i=position.x+1;i<parent.size;i++){
            toMerge=parent.grid.findTileByPosition({x:i,y:position.y});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
    if(directions.down==dir){
        for(i=position.y+1;i<parent.size;i++){
            toMerge=parent.grid.findTileByPosition({x:position.x,y:i});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
    if(directions.left==dir){
        for(i=position.x-1;i>-1;i--){
            toMerge=parent.grid.findTileByPosition({x:i,y:position.y});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
    if(directions.up==dir){
        for(i=position.y;i>=-1;i--){
            toMerge=parent.grid.findTileByPosition({x:position.x,y:i});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
};
HTMLActuator.prototype.addTile= function (tile,parent) {
    var self=this;
    var wrapper=document.createElement('div');
    var inner=document.createElement('div');
    var clicker=document.createElement('div');

    inner.setAttribute('class','inner');
    inner.textContent=tile.value;
    wrapper.appendChild(inner);
    clicker.setAttribute('class','clicker')

    var position=tile.previousPosition||{x:tile.x,y:tile.y};
    var positionClass=this.positionClass(position);
    var classes=['tile','tile'+this.valueClass(tile.value),positionClass,'new'];
    this.applyClasses(wrapper,classes);

    var id=this.uniqueIdentity(parent);
    this.addIdentity(wrapper,id);
    this.addIdentity(clicker,id);

    wrapper.appendChild(clicker);

    this.tileContainer.appendChild(wrapper);
    parent.grid.addTile(tile,id);

    parent.inputManager.bindButtonPress(".clicker[data-id='"+id+"']", parent.split.bind(parent));
};
HTMLActuator.prototype.positionClass= function (position) {
    return 'tile-position-'+position.x+'-'+position.y;
};
HTMLActuator.prototype.valueClass= function (value) {
  return parseInt(Math.floor(value/100)*100);
};
HTMLActuator.prototype.addIdentity= function (element,id) {
    element.setAttribute('data-id',id.toString());
};
HTMLActuator.prototype.applyClasses=function(element,classes){
    element.setAttribute('class',classes.join(' '));
};
HTMLActuator.prototype.uniqueIdentity= function (parent) {
    parent.identity++;
    return parent.identity;
};
HTMLActuator.prototype.mergeTiles=function(firstTile,secondTile){

};
HTMLActuator.prototype.removeTile= function (tileId) {
    var self=this;
    var tileWrapper=document.querySelector(".tile[data-id='"+tileId+"']");
    console.log('tile id is '+tileId+' tileWrapper is ',tileWrapper,this.tileContainer);
    tileWrapper.remove();
    setTimeout(function () {tileWrapper.remove();},200);
};;/**
 * Created by amitkum on 18/7/15.
 */
function Tile(position,value){
    this.x=position.x;
    this.y=position.y;
    this.value=value;
    this.firedFrom=null;
    this.fireDirection=null;
}
Tile.prototype.savePosition=function(){
    this.previousPosition={x:this.x,y:this.y};
};
Tile.prototype.updatePosition= function (position) {
    this.x = position.x;
    this.y = position.y;
};
Tile.prototype.serialize = function () {
    return {
        position: {
            x: this.x,
            y: this.y
        },
        value: this.value
    };
};
Tile.prototype.fireIt = function (direction) {

};;/**
 * Created by amitkum on 18/7/15.
 */
const directions={up:1, right:2, down:3, left:4};
function GameManager(size,InputManager,Actuator,StorageManager){
    this.size=size;
    this.inputManager=new InputManager;
    this.storagemanager=StorageManager;
    this.actuator=new HTMLActuator;
    this.grid=new Grid;
    this.startTiles=256;
    this.identity=0;
    this.inputManager.on('restart',this.restart.bind(this));
    this.setup();
}

GameManager.prototype.setup=function(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var tile=new Tile({x:i,y:j},128);
            this.actuator.addTile(tile,this);
        }
    }
};
GameManager.prototype.restart= function () {

};
GameManager.prototype.split= function (event) {
    var self=this;
    var id=parseInt(event.target.dataset.id);
    var tile=this.grid.findTileById(id);
    var splitElements=this.grid.getSplitElements(tile);
    if(splitElements){
        splitElements.forEach(function(element){
            self.actuator.removeTile(id);
            self.actuator.addTile(element,self);
            self.actuator.fireTile(element,self);
        });
    }

    //var newTile=new Tile({x:id,y:1},256);
    //this.actuator.addTile(newTile,this);
};
;/**
 * Created by amitkum on 18/7/15.
 */
var game=null;
window.requestAnimationFrame(function () {
    game=new GameManager(4,InputManager,1,1);
});