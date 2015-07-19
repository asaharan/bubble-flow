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
};