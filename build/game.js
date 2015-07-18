/*!
 * BubbleUp
 * http://github.com/asaharan/bubbleUp
 * @licence MIT
*/
'use strict';
/*!
 * js/animation_polyfill.js
*/
/**
 * Created by amitkum on 19/7/15.
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());;
/*!
 * js/grid.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
function Grid(){
    this.grid=[];
}
Grid.prototype.addTile= function (tile) {
    this.grid.push(tile);
};
Grid.prototype.removeTile= function (id) {
    var newGrid=[];
    this.grid.forEach(function (tile) {
        if(tile.element_id!=id){
            newGrid.push(tile);
        }
    });
    this.grid=[];
    this.grid=newGrid.slice();
};
Grid.prototype.findTileById= function (elementId) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        if(tilet.element_id==elementId){
            tile=tilet;
        }
    });
    return tile;
};
Grid.prototype.findTileByPosition= function (position) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        if(tilet.x==position.x&&tilet.y==position.y){
            tile=tilet;
        }
    });
    return tile;
};
Grid.prototype.getSplitElements=function(tile){
    return this.directions(tile);
};
Grid.prototype.directions= function (tile) {
    var corner=this.isCorner(tile);//corner has directions in which tiles has to be fired
    if(corner){
        return this.makeChildTiles(tile,corner);
    }
    var center=this.isCenter(tile);
    if(center){
        return this.makeChildTiles(tile,center);
    }
    var edge=this.isEdge(tile);
    if(edge){
        return this.makeChildTiles(tile,edge);
    }
    return false;
};
Grid.prototype.makeChildTiles= function (tile,directions) {//tiles to be fired
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
};
Grid.prototype.isCenter=function(tile){
    if(tile.x>0&&tile.x<size-1&&tile.y>0&&tile.y<size-1){
        return [directions.up,directions.right,directions.down,directions.left];
    }
    return false;
};
Grid.prototype.isEdge= function (tile) {
    if(tile.x==0&&(tile.y==1||tile.y==2)){//left edge
        return [directions.up,directions.right,directions.down];
    }
    if(tile.x==3&&(tile.y==1||tile.y==2)){//right edge
        return [directions.up,directions.down,directions.left];
    }
    if(tile.y==0&&(tile.x==1||tile.x==2)){//top edge
        return [directions.right,directions.down,directions.left];
    }
    if(tile.y==3&&(tile.x==1||tile.x==2)){//bottom edge
        return [directions.top,directions.right,directions.left];
    }

};;
/*!
 * js/input_manager.js
*/
/**
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
};;
/*!
 * js/html_actuator.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
function HTMLActuator(){
    this.gameContainer=document.querySelector('.gameContainer');
    this.gameContainerInner=document.querySelector('.gameContainerInner');
    this.tileContainer=document.querySelector('.tileContainer');
}
HTMLActuator.prototype.fireTile= function (tile,parent) {
    var init={};
    init.x=tile.x;
    init.y=tile.y;
    var nextPosition=this.findNextPosition(init,tile.fireDirection,parent);
    if(nextPosition==null){
        //no one to catch so throwing tile
        this.eatUp(tile,parent);
    }else{
        var tilePresentThere=parent.grid.findTileByPosition(nextPosition);
        tile.nextValue=tile.value+tilePresentThere.value;
        this.removeTile(tilePresentThere.element_id,parent);
        this.moveTile(tile,nextPosition,parent);
        //console.log('removing ',tilePresentThere,' adding to ',tile);
    }
};
HTMLActuator.prototype.eatUp=function(tile,parent){
    this.removeTile(tile.element_id,parent);
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
        for(i=position.y-1;i>=-1;i--){
            toMerge=parent.grid.findTileByPosition({x:position.x,y:i});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
};
HTMLActuator.prototype.addTile= function (tile,parent) {
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
    this.addIdentity(wrapper,id,true);
    tile.element_id=id;
    this.addIdentity(clicker,id);
    wrapper.appendChild(clicker);

    this.tileContainer.appendChild(wrapper);
    parent.grid.addTile(tile);

    parent.inputManager.bindButtonPress(".clicker[data-id='"+id+"']", parent.split.bind(parent));
};
HTMLActuator.prototype.positionClass= function (position) {
    return 'tile-position-'+position.x+'-'+position.y;
};
HTMLActuator.prototype.valueClass= function (value) {
  return parseInt(Math.floor(value/100)*100);
};
HTMLActuator.prototype.addIdentity= function (element,id,iswrapper) {

    if(iswrapper!=true){
        element.setAttribute('data-id',id.toString());
    }
    if(iswrapper){element.setAttribute('id','tile-'+id.toString())}
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
HTMLActuator.prototype.removeTile= function (tileId,parent) {
    parent.grid.removeTile(tileId);//removed from grid array here now we have to remove visible tile
    var tileWrapper=document.getElementById('tile-'+tileId);
    this.removeElement(tileWrapper);
};
HTMLActuator.prototype.removeElement= function (element) {
    window.requestAnimationFrame(function () {
        element.remove();
    })
};
HTMLActuator.prototype.moveTile= function (tile, nextPosition) {
    var tileElement=document.getElementById('tile-'+tile.element_id);
    this.updateClasses(tileElement,this.positionClass(nextPosition));
    tile.x=nextPosition.x;
    tile.y=nextPosition.y;
    tile.value=tile.nextValue;
    this.applyValue(tile);
};
HTMLActuator.prototype.updateClasses= function (element, classToUpdate) {
    var self=this;
    var elementClassList=element.className.split(' ');
    elementClassList[2]=classToUpdate;
    window.requestAnimationFrame(function () {
        self.applyClasses(element,elementClassList);
    });
};
HTMLActuator.prototype.applyValue= function (tile) {
    var element=document.querySelector('#tile-'+tile.element_id+' > div.inner');
    element.textContent=tile.nextValue;
    console.log(element);
};;
/*!
 * js/tile.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
function Tile(position,value){
    this.x=position.x;
    this.y=position.y;
    this.value=value;
    this.firedFrom=null;
    this.fireDirection=null;
    this.element_id=null;
    this.previousValue=null;
    this.nextValue=value;
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

};;
/*!
 * js/game_manager.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
const directions={up:1, right:2, down:3, left:4};
function GameManager(size,InputManager,Actuator,StorageManager){
    this.size=size;
    this.inputManager=new InputManager;
    this.storagemanager=StorageManager;
    this.actuator=new HTMLActuator;
    this.grid=new Grid;
    this.startNumber=512;
    this.identity=0;
    this.inputManager.on('restart',this.restart.bind(this));
    this.setup();
}

GameManager.prototype.setup=function(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            //if(i==0&&j>0&&j!=3){
            //    continue;
            //}
            var tile=new Tile({x:j,y:i},this.startNumber);
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
            self.actuator.removeTile(id,self);
            self.actuator.addTile(element,self);
            self.actuator.fireTile(element,self);
        });
    }

    //var newTile=new Tile({x:id,y:1},256);
    //this.actuator.addTile(newTile,this);
};
;
/*!
 * js/application.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
var size=4;
var game;
window.requestAnimationFrame(function () {
    game=new GameManager(size,InputManager,1,1);
});