/*!
 * BubbleUp
 * http://github.com/asaharan/bubbleUp
 * @licence MIT
*/
/*!
 * js/storage_manager.js
*/
/**
 * Created by amitkum on 19/7/15.
 */
function StorageManager(){
    this.prefix='bubble';
    this.localStorage=window.localStorage;
}
StorageManager.prototype.set= function (what,value) {
    this.localStorage[what]=value;
};
StorageManager.prototype.get= function (what) {
    return this.localStorage[what];
};

StorageManager.prototype.bestScore= function (score) {
    var bestScoreString='bestScore';
    if(score!=null||score!=undefined){
        this.set(bestScoreString,score);
    }else{
        var bestScore= parseInt(this.get(bestScoreString));
        if(bestScore % 1 ===0){
            return bestScore;
        }
        return 0;
    }
};
StorageManager.prototype.currentScore=function(score){
    var currentScoreString='currentScore';
    if(score!=null||score!=undefined){
        this.set(currentScoreString,score);
    }else{
        var currentScore= parseInt(this.get(currentScoreString));
        if(currentScore% 1 ===0){
            return currentScore;
        }
        return 0;
    }
};;
/*!
 * js/grid.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
function Grid(){
    this.grid=[];
}
Grid.prototype.clearContainer= function () {
    this.grid=[];
};
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
    if(tile.x==size-1&&tile.y==0){
        return [directions.left,directions.down];
    }
    if(tile.x==0&&tile.y==size-1){
        return [directions.right,directions.up];
    }
    if(tile.x==size-1&&tile.y==size-1){
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
    if(tile.x==0&&(tile.y>0&&tile.y<size-1)){//left edge
        return [directions.up,directions.right,directions.down];
    }
    if(tile.x==size-1&&(tile.y>0&&tile.y<size-1)){//right edge
        return [directions.up,directions.down,directions.left];
    }
    if(tile.y==0&&(tile.x>0&&tile.x<size-1)){//top edge
        return [directions.right,directions.down,directions.left];
    }
    if(tile.y==size-1&&(tile.x>0&&tile.x<size-1)){//bottom edge
        return [directions.up, directions.right, directions.left];
    }
};
Grid.prototype.currentScore= function (parent) {
    var currentScore=0;
    this.grid.forEach(function (tile) {
        if(tile.isFixed(parent)){
            currentScore=tile.value;
        }
    });
    return currentScore;
};
Grid.prototype.isGameOver= function (parent) {
    var fixTile=parent.fixTile;
    console.log(fixTile);
    var i,count=0;
    for(i=0;i<size;i++){
        if(this.findTileByPosition({x:i,y:fixTile.y})!=null){
            count++;
        }
        if(this.findTileByPosition({x:fixTile.x,y:i})!=null){
            count++;
        }
        if(count>2){
            return false;
        }
    }
    return true;

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
    this.events={};
    this.gameContainer=document.querySelector('.gameContainer');
    this.gameContainerInner=document.querySelector('.gameContainerInner');
    this.tileContainer=document.querySelector('.tileContainer');
    this.currentScoreContainer=document.querySelector('.currentScore');
    this.bestScoreContainer=document.querySelector('.bestScore');
    this.currentScoreUpdater=document.querySelector('.currentScoreUpdater');
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
    }
};
HTMLActuator.prototype.eatUp=function(tile,parent){
    this.removeTile(tile.element_id,parent);
    this.emit('fireComplete');
};
HTMLActuator.prototype.clearContainer= function () {
    this.tileContainer.textContent='';
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
HTMLActuator.prototype.addTile= function (tile,parent,newTile) {
    newTile= newTile== true;
    var wrapper=document.createElement('div');
    var inner=document.createElement('div');
    var clicker=document.createElement('div');

    inner.setAttribute('class','inner');
    inner.textContent=tile.value;
    wrapper.appendChild(inner);
    clicker.setAttribute('class','clicker')

    var position=tile.previousPosition||{x:tile.x,y:tile.y};
    var positionClass=this.positionClass(position);
    var classes=['tile','tile'+this.valueClass(tile.value),positionClass];
    if(newTile){
        classes.push('new');
    }
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
    this.emit('fireComplete');
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
};

HTMLActuator.prototype.on= function (event,callback) {
    if(!this.events[event]){
        this.events[event]=[];
    }
    this.events[event].push(callback);
};
HTMLActuator.prototype.emit= function (event,data) {
    var callbacks=this.events[event];
    if(callbacks){
        callbacks.forEach(function (callback) {
            callback(data);
        })
    }
};
HTMLActuator.prototype.setCurrentScore= function (score,previousScore) {
    var self=this;
    this.currentScoreContainer.textContent=score;
    var updateScore=score-previousScore;
    if(updateScore>0&&updateScore%1===0){
        this.currentScoreUpdater.textContent='+'+updateScore;
        this.currentScoreUpdater.style.opacity=1;
        this.currentScoreUpdater.style.top='-20px';
        setTimeout(function () {
            self.currentScoreUpdater.setAttribute('style',' ');
        },300);
    }
};
HTMLActuator.prototype.setBestScore= function (score) {
    this.bestScoreContainer.textContent=score;
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

};
Tile.prototype.isFixed= function (parent) {
    if(parent.fixTile.x==this.x&&parent.fixTile.y==this.y){
        return true;
    }
    return false;
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
    this.storageManager=new StorageManager;
    this.actuator=new Actuator;
    this.grid=new Grid;
    this.startNumber=512;
    this.identity=0;
    this.fixTile=null;
    this.inTheWay=0;
    this.gameOver=false;
    this.inputManager.on('restart',this.restart.bind(this));
    this.actuator.on('fireComplete',this.fireComplete.bind(this));
    this.setup();
}

GameManager.prototype.setup=function(){
    this.gameOver=false;
    this.actuator.clearContainer();
    this.grid.clearContainer();
    for(var i=0;i<this.size;i++){
        for(var j=0;j<this.size;j++){
            var tile=new Tile({x:j,y:i},this.startNumber);
            this.actuator.addTile(tile,this,true);
        }
    }
    this.setFixedTile();
    this.updateScore(true);
};
GameManager.prototype.setFixedTile= function () {
    this.fixTile=this.grid.findTileByPosition(this.getRandomPosition());
    var stylesheetId='AsAdnHajAhdAHAStylesheet';
    var doesStyleSheetExist=document.getElementById(stylesheetId);
    if(doesStyleSheetExist!=null||doesStyleSheetExist!=undefined){
        doesStyleSheetExist.parentNode.removeChild(doesStyleSheetExist);
    }
    var stylesheet=document.createElement('style');
    stylesheet.textContent='.tile.tile-position-' + this.fixTile.x+'-'+this.fixTile.y+'{ box-shadow:'+'0 0 30px 10px rgba(243, 215, 116, 0.96), inset 0 0 0 1px rgba(213, 123, 123, 1);}';
    stylesheet.setAttribute('id',stylesheetId);
    document.querySelector('body').appendChild(stylesheet);
};
GameManager.prototype.getRandomPosition= function () {
    var random={};
    random.x=Math.floor(Math.random()*this.size);
    random.y=Math.floor(Math.random()*this.size);
    return random;
};
GameManager.prototype.restart= function () {
    this.setup();
};
GameManager.prototype.split= function (event) {
    if(this.gameOver){
        return;
    }
    var self=this;
    var id=parseInt(event.target.dataset.id);
    var tile=this.grid.findTileById(id);
    if(tile.isFixed(self)||self.inTheWay>0){
        return;
    }
    var splitElements=this.grid.getSplitElements(tile);
    self.inTheWay=splitElements.length;
    if(splitElements){
        splitElements.forEach(function(element){
            self.actuator.removeTile(id,self);
            self.actuator.addTile(element,self);
            window.requestAnimationFrame(function () {
                self.actuator.fireTile(element,self);
            });
        });
    }
};
GameManager.prototype.fireComplete=function(){//whwn fired tiles reaches its position this will be called
    this.inTheWay--;
    if(this.inTheWay==0){
        this.updateScore();
        this.gameOver=this.grid.isGameOver(this);
    }
};
GameManager.prototype.updateScore= function (isStartOfgame) {
    var currentScore=this.grid.currentScore(this);
    var previousScore=this.storageManager.currentScore();
    if(previousScore!=currentScore){
        this.actuator.setCurrentScore(currentScore,previousScore);
        this.storageManager.currentScore(currentScore);
    }
    if(isStartOfgame){
        this.actuator.setBestScore(this.storageManager.bestScore());
        this.actuator.setCurrentScore(currentScore,currentScore);
        return;
    }
    var bestScore=this.storageManager.bestScore();
    if(bestScore<currentScore){
        this.storageManager.bestScore(currentScore);
        this.actuator.setBestScore(currentScore);
    }
};;
/*!
 * js/application.js
*/
/**
 * Created by amitkum on 18/7/15.
 */
var size=4;
var game;
window.requestAnimationFrame(function () {
    game=new GameManager(size,InputManager,HTMLActuator,StorageManager);
});