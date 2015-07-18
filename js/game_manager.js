/**
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

};