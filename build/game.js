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
    event.preventDefault();
    this.emit('restart');
    console.log('restart');
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

    this.bindButtonPress('.newGame',this.restart);
};
InputManager.prototype.bindButtonPress= function (selector,fn) {
    var button = document.querySelector(selector);
    console.log('button binded'+selector,fn);
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
HTMLActuator.prototype.fireTile= function (tile) {

};;/**
 * Created by amitkum on 18/7/15.
 */
function Tile(position,value){
    this.x=position.x;
    this.y=position.y;
    this.value=value;
    this.previousPosition=null;
    this.firedFrom=null;
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
function GameManager(size,InputManager,Actuator,StorageManager){
    this.size=size;
    this.inputManager=new InputManager;
    this.storagemanager=StorageManager;
    this.actuator=Actuator;
    this.startTiles=256;

    this.inputManager.on('move',this.move.bind(this));
    this.inputManager.on('restart',this.restart.bind(this));
    this.setup();
}

GameManager.prototype.setup=function(){

};
GameManager.prototype.restart= function () {

};
GameManager.prototype.move= function () {

};;/**
 * Created by amitkum on 18/7/15.
 */
window.requestAnimationFrame(function () {
    console.log('Page loaded');
    new GameManager(4,InputManager,1,1);
});